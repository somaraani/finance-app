import type { Ranges, SpendingCategories } from '$lib/types';
import { getUserTransactions } from './transactions';

export async function getSpendingTimeline(userId: number) {
	const startDate = new Date();
	startDate.setMonth(new Date().getMonth() - 1);

	const transactions = await getUserTransactions(userId, { startDate, order: 'asc' });
	const spending: { [date: string]: number } = {};

	let lastSpend = 0;

	for (const transaction of transactions) {
		// don't want to count money in for spends
		if (transaction.amount < 0) {
			continue;
		}

		const date = transaction.timestamp.toLocaleDateString();

		if (!spending[date]) {
			spending[date] = lastSpend;
		}

		spending[date] += transaction.amount;
		lastSpend = spending[date];
	}

	const history = Object.entries(spending)
		.map(([date, value]) => ({ date: new Date(date), value }))
		.sort((a, b) => a.date.getTime() - b.date.getTime());

	return { history };
}

export async function getSpendingCategories(
	userId: number,
	range: Ranges
): Promise<SpendingCategories> {
	const startDate = new Date();
	startDate.setMonth(new Date().getMonth() - 1);

	const transactions = await getUserTransactions(userId, { range, order: 'asc' });

	const spendingMap: { [key: string]: number } = {};

	for (const transaction of transactions) {
		// don't want to count money in for spends
		if (transaction.amount < 0) {
			continue;
		}

		if (!spendingMap[transaction.categoryName]) {
			spendingMap[transaction.categoryName] = 0;
		}

		spendingMap[transaction.categoryName] += transaction.amount;
	}

	const sortedCategories = Object.entries(spendingMap).sort((a, b) => b[1] - a[1]);

	const topCategories = sortedCategories.slice(0, 5);
	const otherCategories = sortedCategories.slice(5);

	const otherTotal = otherCategories.reduce((total, category) => total + category[1], 0);

	return [
		...topCategories.map(([label, value]) => ({ label, value })),
		{ label: 'Others', value: otherTotal }
	];
}
