import { eq } from 'drizzle-orm';
import { instituations, accounts } from '../../schemas/schema';
import { db } from './db';
import type { Account } from '$lib/types';

export type UserInstitute = {
	name: string;
	id: string;
	accounts: Account[];
};

export async function getUserInstitutions(userId: string) {
	const userAccounts = await db
		.select({
			instituationId: instituations.id,
			institutionName: instituations.name,
			details: accounts
		})
		.from(accounts)
		.where(eq(accounts.userId, userId))
		.leftJoin(instituations, eq(instituations.id, accounts.institutionId));

	const output: { [key: string]: UserInstitute } = {};

	//TODO deal with unknon institution

	userAccounts.forEach((account) => {
		if (!output[account.instituationId ?? 'unknown']) {
			output[account.instituationId ?? 'unknown'] = {
				name: account.institutionName ?? 'unknown',
				id: account.instituationId ?? 'unknown',
				accounts: []
			};
		}

		if (account.details) {
			output[account.instituationId ?? 'unknown'].accounts.push({
				...account.details,
				balance: 0,
				lastUpdated: null
			} as Account);
		}
	});

	return Object.values(output);
}
