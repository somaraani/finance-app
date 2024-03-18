import type { AccountBalance, AccountType } from '$lib/types';
import type { UserInstitute } from '$lib/types/institutions.types';
import { and, desc, eq, getTableColumns } from 'drizzle-orm';
import { accounts, balances, userInstitutions } from '../../../schemas/schema';
import { db } from '../util/db';

export class AccountsService {
	static async createAccount(
		userId: number,
		accountName: string,
		accountType: AccountType,
		institutionName: string
	) {		
		// Check if user institution exists
		let [userInstitution] = await db
			.select()
			.from(userInstitutions)
			.where(and(eq(userInstitutions.userId, userId), eq(userInstitutions.name, institutionName)));

		// If user institution doesn't exist, create it
		if (!userInstitution) {
			[userInstitution] = await db.insert(userInstitutions).values({ userId, name: institutionName }).returning();
		}

		// Create account
		await db
			.insert(accounts)
			.values({
				userId,
				name: accountName,
				type: accountType,
				institutionId: userInstitution.id
			})
	}

	static async getUserAccounts(userId: number) {
		return db
			.select({
				...getTableColumns(accounts),
				insitutionName: userInstitutions.name,
			})
			.from(accounts)
			.where(eq(accounts.userId, userId))
			.innerJoin(userInstitutions, eq(userInstitutions.id, accounts.institutionId));
	}

	static async getUserInstitutions(userId: number) {
		return db
			.select()
			.from(userInstitutions)
			.where(eq(userInstitutions.userId, userId));
	}

	static async getUserAccountsByInstitution(userId: number): Promise<UserInstitute[]> {
		const userAccounts = await this.getUserAccountBalances(userId);
		const institutionMap: { [key: string]: UserInstitute } = {};

		userAccounts.forEach((account) => {
			const institutionId = account.institutionId;
			if (!institutionMap[institutionId]) {
				institutionMap[institutionId] = {
					id: account.institutionId,
					name: account.institutionName,
					accounts: []
				};
			}
			institutionMap[institutionId].accounts.push(account);
		});

		return Object.values(institutionMap);
	}

	/**
	 * Updates the account balances for a user.
	 * Use {@link getUserAccountBalances} to get most recent balances
	 * @returns if any of the requests to plaid failed
	 */
	static async syncAccountBalances(userId: number) {
		const query = await this.getUserInstitutions(userId);
		let failures = false;

		for (const institution of query) {
			// handle each connector 
		}

		return { failures };
	}

	/**
	 * Returns the account balances for a user as stored in the database.
	 * Use {@link syncAccountBalances} to update balances
	 */
	static async getUserAccountBalances(userId: number): Promise<AccountBalance[]> {
		const result = await db
			.selectDistinctOn([accounts.id], {
				name: accounts.name,
				id: accounts.id,
				balance: balances.balance,
				lastUpdated: balances.timestamp,
				type: accounts.type,
				institutionName: userInstitutions.name,
				institutionId: userInstitutions.id
			})
			.from(accounts)
			.where(eq(balances.userId, userId))
			.innerJoin(balances, eq(balances.accountId, accounts.id))
			.innerJoin(userInstitutions, eq(userInstitutions.id, accounts.institutionId))
			.orderBy(accounts.id, desc(balances.timestamp));

		return result as AccountBalance[];
	}
}
