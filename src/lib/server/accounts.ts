import type { Account } from '$lib/types';
import { eq } from 'drizzle-orm';
import { accounts, instituations, userInstitutions } from '../../schemas/schema';
import { db } from './db';
import { plaidClient } from './plaid';

export async function getUserAccounts(userId: string) {
	return db.select().from(accounts).where(eq(accounts.userId, userId));
}

export async function getUserAccountBlances(userId: string) {
	const balances: Account[] = [];

	const query = await db
		.select()
		.from(userInstitutions)
		.where(eq(userInstitutions.userId, userId))
		.leftJoin(instituations, eq(instituations.id, userInstitutions.institutionId));

	for (const institution of query) {
		const balancesResponse = await plaidClient.accountsBalanceGet({
			access_token: institution.user_institutions.accessToken
		});

		const accounts = balancesResponse.data.accounts;

		accounts.forEach((account) => {
			balances.push({
				name: account.name,
				id: account.account_id,
				balance: account.balances.current,
				type: account.type,
				subtype: account.subtype,
				institutionName: institution.institutions?.name,
				lastUpdated: new Date()
			});
		});
	}

	return balances;
}
