import { desc, eq, getTableColumns, inArray, type InferInsertModel } from 'drizzle-orm';
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
import type { Transaction } from 'plaid';
import type { AccountMedata } from '$lib/types';

function transformPlaidTransaction(
	transaction: Transaction,
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

export async function getUserTransactions(userId: number) {
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
		.where(eq(transactions.userId, userId))
		.innerJoin(accounts, eq(accounts.id, transactions.accountId))
		.innerJoin(instituations, eq(instituations.id, accounts.institutionId))
		.innerJoin(categories, eq(transactions.category, categories.id))
		.innerJoin(subcategories, eq(transactions.subcategory, subcategories.id))
		.orderBy(desc(transactions.timestamp));

	return result;
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
		tokens.map(async ({ accessToken }) => {
			const accountTransactions = await plaidClient.transactionsSync({
				access_token: accessToken,
				cursor: undefined
			});

			const newTransactions = accountTransactions.data.added.map((transaction) =>
				transformPlaidTransaction(transaction, userId, accountMap, categoryMap)
			);

			await db.insert(transactions).values(newTransactions);

			for (const transaction of accountTransactions.data.modified) {
				await db
					.update(transactions)
					.set({ ...transformPlaidTransaction(transaction, userId, accountMap, categoryMap) })
					.where(eq(transactions.plaidId, transaction.transaction_id));
			}

			// TODO what happens if deleted without an ID?
			const deletedIds = accountTransactions.data.removed
				.map((t) => t.transaction_id)
				.filter((t) => Boolean(t)) as string[];

			await db.delete(transactions).where(inArray(transactions.plaidId, deletedIds));
		})
	);
}
