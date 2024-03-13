import { desc, eq, getTableColumns } from 'drizzle-orm';
import { accounts, balances, instituations, userInstitutions } from '../../schemas/schema';
import { db } from './db';
import { plaidClient } from './plaid';
import type { Account } from '$lib/types';
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

export async function updateAccountBalances(userId: number) {
	const query = await getUserInstitutions(userId);

	for (const institution of query) {
		const balancesResponse = await plaidClient.accountsBalanceGet({
			access_token: institution.user_institutions.accessToken
		});

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
}

export async function getUserAccountBlances(userId: number) {
	// TODO change this logic into an SQL query
	const userAccounts = await getUserAccounts(userId);
	return Promise.all(
		userAccounts.map(async (account) => {
			const [balance] = await db
				.select()
				.from(balances)
				.where(eq(balances.accountId, account.id))
				.orderBy(desc(balances.timestamp))
				.limit(1);

			return {
				name: account.name,
				id: account.id,
				balance: balance.balance,
				lastUpdated: balance.timestamp,
				type: account.type as AccountType,
				subtype: account.subtype as AccountSubtype,
				institutionName: account.insitutionName,
				institutionId: account.institutionId
			} satisfies Account;
		})
	);

	// return db
	// 	.select({
	// 		...getTableColumns(balances),
	// 		...getTableColumns(accounts),
	// 		timestamp: max(balances.timestamp)
	// 	})
	// 	.from(balances)
	// 	.where(eq(balances.userId, userId))
	// 	.groupBy(balances.accountId)
	// 	.innerJoin(accounts, eq(accounts.id, balances.accountId))
	// 	.innerJoin(instituations, eq(accounts.institutionId, instituations.id));
}
