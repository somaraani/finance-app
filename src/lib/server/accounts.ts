import type { Account } from '$lib/types';
import { eq } from 'drizzle-orm';
import { accounts, userInstitutions } from '../../schemas/schema';
import { db } from './db';
import { plaidClient } from './plaid';

export async function getUserAccounts(userId: string) {
	return db.select().from(accounts).where(eq(accounts.userId, userId));
}

export async function getUserAccountBlances(userId: string) {
	const balances: Account[] = [];
	const instituations = await db
		.select()
		.from(userInstitutions)
		.where(eq(userInstitutions.userId, userId));

	for (const institute of instituations) {
		const balancesResponse = await plaidClient.accountsBalanceGet({
			access_token: institute.accessToken
		});

		const accounts = balancesResponse.data.accounts;

		accounts.forEach(async (account) => {
			balances.push({
				name: account.name,
				id: account.account_id,
				balance: account.balances.current,
				type: account.type,
				subtype: account.subtype
			});
		});
	}

	console.log(balances);

	return balances;
}
