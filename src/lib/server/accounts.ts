import { desc, eq, getTableColumns } from 'drizzle-orm';
import { accounts, balances, instituations, userInstitutions } from '../../schemas/schema';
import { db } from './db';
import { plaidClient } from './plaid';
import type { Account } from '$lib/types';

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

export async function updateAccountBalances(userId: number) {
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
		const dbAccounts = await db.select().from(accounts).where(eq(accounts.userId, userId));
		const accountIdMap = new Map<string, number>();
		dbAccounts.forEach((account) => {
			accountIdMap.set(account.plaidAccountId, account.id);
		});

		await Promise.all(
			accountsData.map(async (account) => {
				const accountId = accountIdMap.get(account.account_id);
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

export async function getUserAccountBlances(userId: number): Promise<Account[]> {
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

	return result as Account[];
}
