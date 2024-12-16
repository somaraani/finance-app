import type { AccountBalance, AccountMedata, AccountType } from '$lib/types';
import type { UserInstitute } from '$lib/types/institutions.types';
import { and, desc, eq, getTableColumns, lte } from 'drizzle-orm';
import { accounts, balances, userInstitutions } from '../../../schemas/schema';
import { db } from '../util/db';
import { ConnectorsService } from './connectors';
import { ExchangeService } from './exchange';
import { UsersService } from './users';

export class AccountsService {
	static async createAccount(
		userId: number,
		institutionId: number,
		accountName: string,
		accountType: AccountType,
		currencyCode: string,
		connectorMetadata?: any
	): Promise<AccountMedata> {
		// Check if user institution exists
		const [userInstitution] = await db
			.select()
			.from(userInstitutions)
			.where(eq(userInstitutions.id, institutionId));

		if (!userInstitution) {
			throw new Error('User institution not found');
		}

		// Create account
		const [newAccount] = await db
			.insert(accounts)
			.values({
				userId,
				institutionId,
				name: accountName,
				type: accountType,
				currencyCode,
				connectorMetadata: JSON.stringify(connectorMetadata || '{}')
			})
			.returning();

		return {
			...newAccount,
			institutionName: userInstitution.name,
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

	static async getInstitutionById(userId: number, institutionId: number) {
		const [institution] = await db
			.select()
			.from(userInstitutions)
			.where(and(eq(userInstitutions.userId, userId), eq(userInstitutions.id, institutionId)));

		return institution;
	}

	static async getInstitutionAccounts(userId: number, institutionId: number) {
		return db
			.select()
			.from(accounts)
			.where(and(eq(accounts.userId, userId), eq(accounts.institutionId, institutionId)));
	}

	static async getOrCreateUserInstitution(userId: number, institutionName: string) {
		let institution = await AccountsService.findInstitutionByName(userId, institutionName);
		if (!institution) {
			institution = await AccountsService.createInstitution(userId, institutionName, 'manual');
		}
		return institution;
	}

	static async findInstitutionByName(userId: number, name: string) {
		const results = await db
			.selectDistinct()
			.from(userInstitutions)
			.where(and(eq(userInstitutions.userId, userId), eq(userInstitutions.name, name)));
		return results.length >= 1 ? results[0] : undefined;
	}

	static async updateInstitutionMetadata(institutionId: number, metadata: object) {
		const updated = await db
			.update(userInstitutions)
			.set({ connectorMetadata: JSON.stringify(metadata) })
			.where(eq(userInstitutions.id, institutionId))
			.returning();
		return { success: Boolean(updated?.length) };
	}

	static async createInstitution(
		userId: number,
		name: string,
		connectorType: string,
		connectorMetadata?: any
	) {
		const [newInstitution] = await db
			.insert(userInstitutions)
			.values({
				userId,
				name,
				connectorType,
				connectorMetadata: JSON.stringify(connectorMetadata || '{}')
			})
			.returning();

		return newInstitution;
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
			if (institution.connectorType !== 'manual') {
				await ConnectorsService.updateAccountBalances(userId, institution.id).catch((err) => {
					console.error(err);
					failures = true;
				});
			}
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
		const userCurrency = await UsersService.getUserCurrency(userId);

		const result = await db
			.selectDistinctOn([accounts.id], {
				name: accounts.name,
				id: accounts.id,
				balance: balances.balance,
				lastUpdated: balances.timestamp,
				type: accounts.type,
				institutionName: userInstitutions.name,
				institutionId: userInstitutions.id,
				currencyCode: accounts.currencyCode
			})
			.from(accounts)
			.where(eq(accounts.userId, userId))
			.leftJoin(balances, eq(balances.accountId, accounts.id))
			.innerJoin(userInstitutions, eq(userInstitutions.id, accounts.institutionId))
			.orderBy(accounts.id, desc(balances.timestamp));

		const accountBalances = await Promise.all(
			result.map(async (account) => {
				const convertedBalance =
					account.balance && account.currencyCode !== userCurrency
						? account.balance *
							(await ExchangeService.getExchangeRate(account.currencyCode, userCurrency!))
						: account.balance;

				return {
					...account,
					balance: { value: account.balance, currency: account.currencyCode },
					convertedBalance: { value: convertedBalance, currency: userCurrency }
				};
			})
		);

		return accountBalances as AccountBalance[];
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
					timestamp: date
				}))
			)
			.returning();
		return { success: Boolean(inserted?.length) };
	}

	/**
	 * Deletes an account for the specified user ID and account ID.
	 * @param userId - The ID of the user.
	 * @param accountId - The ID of the account.
	 */
	static async deleteAccount(userId: number, accountId: number) {
		const deleted = await db
			.delete(accounts)
			.where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
			.returning();
		return { success: Boolean(deleted?.length) };
	}
}
