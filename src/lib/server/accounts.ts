import { desc, eq, getTableColumns } from 'drizzle-orm';
import { accounts, balances, instituations, userInstitutions } from '../../schemas/schema';
import { db } from './db';
import { plaidClient } from './plaid';
import type { AccountBalance, AccountMedata } from '$lib/types';
import type { AccountSubtype, AccountType } from 'plaid';

export async function getUserAccounts(userId: number) {
	return db
		.select({
			...getTableColumns(accounts),
			insitutionName: instituations.name
		})
		.from(accounts)
		.where(eq(accounts.userId, userId))
		.innerJoin(instituations, eq(instituations.id, accounts.institutionId));
}

async function getUserInstitutions(userId: number) {
	return db
		.select()
		.from(userInstitutions)
		.where(eq(userInstitutions.userId, userId))
		.leftJoin(instituations, eq(instituations.id, userInstitutions.institutionId));
}

/**
 * Returns an object mapping the plaid account ID to our internal account ID
 */
export async function getPlaidAccountMap(userId: number) {
	const dbAccounts = await db
		.select({
			...getTableColumns(accounts),
			institutionName: instituations.name
		})
		.from(accounts)
		.where(eq(accounts.userId, userId))
		.innerJoin(instituations, eq(instituations.id, accounts.institutionId));

	const accountIdMap: { [plaidId: string]: AccountMedata } = {};
	dbAccounts.forEach((account) => {
		accountIdMap[account.plaidAccountId] = {
			id: account.id,
			institutionId: account.institutionId,
			name: account.name,
			type: account.type as AccountType,
			subtype: account.subtype as AccountSubtype,
			institutionName: account.institutionName
		};
	});
	return accountIdMap;
}

/**
 * Updates the account balances for a user.
 * Use {@link getUserAccountBalances} to get most recent balances
 * @returns if any of the requests to plaid failed
 */
export async function syncAccountBalances(userId: number) {
	const query = await getUserInstitutions(userId);
	let failures = false;

	for (const institution of query) {
		const balancesResponse = await plaidClient.accountsBalanceGet({
			access_token: institution.user_institutions.accessToken
		});

		// if the request fails, nothing to ad
		if (balancesResponse.status !== 200) {
			failures = true;
			continue;
		}

		const accountsData = balancesResponse.data.accounts;

		// need to get internal account id that maps to the plaid account id
		const accountIdMap = await getPlaidAccountMap(userId);

		await Promise.all(
			accountsData.map(async (account) => {
				const accountId = accountIdMap[account.account_id].id;
				if (!accountId || !account.balances.current || !account.balances.iso_currency_code) return;

				await db.insert(balances).values({
					userId,
					accountId,
					balance: account.balances.current,
					currencyCode: account.balances.iso_currency_code,
					timestamp: new Date()
				});
			})
		);
	}

	return { failures };
}

/**
 * Returns the account balances for a user as stored in the database.
 * Use {@link syncAccountBalances} to update balances
 */
export async function getUserAccountBalances(userId: number): Promise<AccountBalance[]> {
	const result = await db
		.selectDistinctOn([accounts.id], {
			name: accounts.name,
			id: accounts.id,
			balance: balances.balance,
			lastUpdated: balances.timestamp,
			type: accounts.type,
			subtype: accounts.subtype,
			institutionName: instituations.name,
			institutionId: instituations.id
		})
		.from(accounts)
		.where(eq(balances.userId, userId))
		.innerJoin(balances, eq(balances.accountId, accounts.id))
		.innerJoin(instituations, eq(instituations.id, accounts.institutionId))
		.orderBy(accounts.id, desc(balances.timestamp));

	return result as AccountBalance[];
}
