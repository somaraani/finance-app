import {
	and,
	asc,
	desc,
	eq,
	getTableColumns,
	gte,
	lte,
	type InferInsertModel,
	type SQLWrapper
} from 'drizzle-orm';
import {
	accounts,
	categories,
	instituations,
	subcategories,
	transactions,
	userInstitutions
} from '../../schemas/schema';
import { db } from './db';
import { plaidClient } from './plaid';
import { getPlaidAccountMap } from './accounts';
import type { Transaction as PlaidTransaction } from 'plaid';
import type { AccountMedata, Ranges } from '$lib/types';
import { logger } from '$lib/util/logs';
import type { Transaction } from '$lib/types/transactions.types';
import { getDatesFromRange } from '$lib/util/filters';

function transformPlaidTransaction(
	transaction: PlaidTransaction,
	userId: number,
	accountMap: { [key: string]: AccountMedata },
	categoryMap: { [key: string]: number }
): InferInsertModel<typeof transactions> {
	return {
		userId,
		name: transaction.name,
		accountId: accountMap[transaction.account_id].id,
		plaidId: transaction.transaction_id,
		amount: transaction.amount,
		currencyCode: transaction.iso_currency_code ?? transaction.unofficial_currency_code,
		timestamp: new Date(transaction.authorized_date ?? transaction.date),
		category: transaction.personal_finance_category?.primary
			? categoryMap[transaction.personal_finance_category.primary]
			: undefined,
		subcategory: transaction.personal_finance_category?.detailed
			? categoryMap[transaction.personal_finance_category.detailed]
			: undefined,
		pending: transaction.pending,
		channel: transaction.payment_channel,
		iconUrl: transaction.logo_url ?? transaction.personal_finance_category_icon_url
	};
}

export async function getUserTransactions(
	userId: number,
	options?: {
		/**
		 * Date to start on
		 */

		startDate?: Date;

		/**
		 * Date to end on
		 */
		endDate?: Date;

		/**
		 * Range to set, instead of start and end date
		 */
		range?: Ranges;

		/**
		 * The order to return in. Desc is most recent first.
		 */
		order?: 'asc' | 'desc';
	}
): Promise<Transaction[]> {
	const filters: SQLWrapper[] = [];

	let startDate, endDate;

	if (options?.range) {
		const rangeDates = getDatesFromRange(options?.range);
		startDate = rangeDates.startDate;
		endDate = rangeDates.endDate;
	} else {
		startDate = options?.startDate;
		endDate = options?.endDate;
	}

	if (startDate) {
		filters.push(gte(transactions.timestamp, startDate));
	}

	if (endDate) {
		filters.push(lte(transactions.timestamp, endDate));
	}

	let order;
	if (options?.order === 'asc') {
		order = asc(transactions.timestamp);
	} else {
		order = desc(transactions.timestamp);
	}

	const result = await db
		.select({
			...getTableColumns(transactions),
			categoryName: categories.name,
			subcategoryName: subcategories.name,
			institutionName: instituations.name,
			institutionId: instituations.id,
			accountName: accounts.name
		})
		.from(transactions)
		.where(and(eq(transactions.userId, userId), ...filters))
		.innerJoin(accounts, eq(accounts.id, transactions.accountId))
		.innerJoin(instituations, eq(instituations.id, accounts.institutionId))
		.innerJoin(categories, eq(transactions.category, categories.id))
		.innerJoin(subcategories, eq(transactions.subcategory, subcategories.id))
		.orderBy(order);

	return result as Transaction[];
}

async function getPlaidCategoryMap() {
	const categoriesQuery = await db.select().from(categories);
	const subcategoriesQuery = await db.select().from(subcategories);

	const map: { [key: string]: number } = {};

	[...categoriesQuery, ...subcategoriesQuery].forEach((cat) => {
		if (cat.plaidCategory) {
			map[cat.plaidCategory] = cat.id;
		}
	});

	return map;
}

export async function syncUserTransactions(userId: number) {
	const tokens = await db
		.select()
		.from(userInstitutions)
		.where(eq(userInstitutions.userId, userId));

	const accountMap = await getPlaidAccountMap(userId);
	const categoryMap = await getPlaidCategoryMap();

	await Promise.all(
		tokens.map(async ({ accessToken, id, plaidCursor }) => {
			const accountTransactions = await plaidClient.transactionsSync({
				access_token: accessToken,
				cursor: plaidCursor || undefined
			});

			const newTransactions = accountTransactions.data.added.map((transaction) =>
				transformPlaidTransaction(transaction, userId, accountMap, categoryMap)
			);

			if (newTransactions.length) {
				await db.insert(transactions).values(newTransactions);
			}
			logger.info(`Added ${newTransactions.length} new transactions`);

			for (const transaction of accountTransactions.data.modified) {
				await db
					.update(transactions)
					.set({ ...transformPlaidTransaction(transaction, userId, accountMap, categoryMap) })
					.where(eq(transactions.plaidId, transaction.transaction_id));
			}
			logger.info(`Modified ${accountTransactions.data.modified.length} transactions`);

			for (const transaction of accountTransactions.data.removed) {
				if (!transaction.transaction_id) {
					logger.warn('Removed transaction has no plaid transaction id');
					continue;
				}
				await db.delete(transactions).where(eq(transactions.plaidId, transaction.transaction_id));
			}
			logger.info(`Removed ${accountTransactions.data.removed.length} transactions`);

			// Add cursor for next sync
			const cursor = accountTransactions.data.next_cursor;
			await db
				.update(userInstitutions)
				.set({
					plaidCursor: cursor
				})
				.where(eq(userInstitutions.id, id));
		})
	);
}
