import type { AccountBalance, AccountMedata, AccountType } from '$lib/types';
import type { UserInstitute } from '$lib/types/institutions.types';
import { and, desc, eq, getTableColumns, lte } from 'drizzle-orm';
import { accounts, balances, userInstitutions } from '../../../schemas/schema';
import { db } from '../util/db';

export class AccountsService {
	static async createAccount(
		userId: number,
		accountName: string,
		accountType: AccountType,
		institutionName: string
	): Promise<AccountMedata> {
		// Check if user institution exists
		let [userInstitution] = await db
			.select()
			.from(userInstitutions)
			.where(and(eq(userInstitutions.userId, userId), eq(userInstitutions.name, institutionName)));

		// If user institution doesn't exist, create it
		if (!userInstitution) {
			[userInstitution] = await db
				.insert(userInstitutions)
				.values({ userId, name: institutionName })
				.returning();
		}

		// Create account
		const [newAccount] = await db
			.insert(accounts)
			.values({
				userId,
				name: accountName,
				type: accountType,
				institutionId: userInstitution.id
			})
			.returning();

		return {
			...newAccount,
			institutionName,
			institutionId: userInstitution.id
		} as AccountMedata;
	}

	static async deleteInstitution(userId: number, institutionId: number) {
		const deleted = await db
			.delete(userInstitutions)
			.where(and(eq(userInstitutions.id, institutionId), eq(userInstitutions.userId, userId)))
			.returning();
		return { success: Boolean(deleted?.length) };
	}

	static async getUserAccounts(userId: number): Promise<AccountMedata[]> {
		const accs = await db
			.select({
				...getTableColumns(accounts),
				institutionId: userInstitutions.id,
				institutionName: userInstitutions.name
			})
			.from(accounts)
			.where(eq(accounts.userId, userId))
			.innerJoin(userInstitutions, eq(userInstitutions.id, accounts.institutionId));

		return accs as AccountMedata[];
	}

	static async getUserInstitutions(userId: number) {
		return db.select().from(userInstitutions).where(eq(userInstitutions.userId, userId));
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

	static async getAccountBalance(
		accountId: number,
		date: Date = new Date()
	): Promise<number | undefined> {
		// Query the database for the most recent balance of the specified account before the specified date
		const result = await db
			.select({ balance: balances.balance })
			.from(balances)
			.where(and(eq(balances.accountId, accountId), lte(balances.timestamp, date)))
			.orderBy(desc(balances.timestamp))
			.limit(1);

		if (result.length === 0) {
			return undefined;
		}

		return result[0].balance;
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
			.where(eq(accounts.userId, userId))
			.leftJoin(balances, eq(balances.accountId, accounts.id))
			.innerJoin(userInstitutions, eq(userInstitutions.id, accounts.institutionId))
			.orderBy(accounts.id, desc(balances.timestamp));

		return result as AccountBalance[];
	}

	/**
	 * Creates an account balance for the specified account ID with the given balance.
	 * @param accountId - The ID of the account.
	 * @param balance - The balance to set for the account.
	 */
	static async createAccountBalance(
		userId: number,
		accountId: number,
		balance: number,
		date: Date
	) {
		const inserted = await db
			.insert(balances)
			.values({
				userId,
				accountId,
				balance,
				currencyCode: 'CAD', // TODO set a correct currency code
				timestamp: date
			})
			.returning();
		return { success: Boolean(inserted?.length) };
	}

	/**
	 * Creates an account balance for the specified account ID with the given balance.
	 * @param accountId - The ID of the account.
	 * @param balance - The balance to set for the account.
	 */
	static async createAccountBalances(
		userId: number,
		accountId: number,
		data: { balance: number; date: Date }[]
	) {
		const inserted = await db
			.insert(balances)
			.values(
				data.map(({ balance, date }) => ({
					userId,
					accountId,
					balance,
					currencyCode: 'CAD', // TODO set a correct currency code
					timestamp: date
				}))
			)
			.returning();
		return { success: Boolean(inserted?.length) };
	}

	/**
	 * Creates an account balance for the specified account ID with the given balance.
	 * @param accountId - The ID of the account.
	 * @param balance - The balance to set for the account.
	 */
	static async deleteAccount(userId: number, accountId: number) {
		const deleted = await db
			.delete(accounts)
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
			.returning();
		return { success: Boolean(deleted?.length) };
	}
}
