import type { Ranges, SpendingCategories, SpendingData } from '$lib/types';
import { TransactionsService } from './transactions';

export class SpendingService {
	static async getSpendingTimeline(userId: number): Promise<SpendingData> {
		const currentMonthStart = new Date();
		currentMonthStart.setDate(1);
		currentMonthStart.setHours(0, 0, 0, 0);

		const lastMonthStart = new Date(currentMonthStart);
		lastMonthStart.setMonth(currentMonthStart.getMonth() - 1);

		const transactions = await TransactionsService.getUserTransactions(userId, {
			startDate: lastMonthStart,
			order: 'asc'
		});

		const currentDate = new Date().getDate();
		const currentMonthSpending: number[] = new Array(currentDate).fill(0);
		const lastMonthSpending: number[] = new Array(31).fill(0);

		for (const transaction of transactions) {
			if (transaction.amount < 0) {
				continue;
			}

			const date = transaction.timestamp.getDate();
			const month = transaction.timestamp.getMonth();

			if (month === currentMonthStart.getMonth()) {
				currentMonthSpending[date - 1] += transaction.amount;
				for (let i = date; i < currentDate; i++) {
					currentMonthSpending[i] += transaction.amount;
				}
			} else if (month === lastMonthStart.getMonth()) {
				lastMonthSpending[date - 1] += transaction.amount;
				for (let i = date; i < lastMonthSpending.length; i++) {
					lastMonthSpending[i] += transaction.amount;
				}
			}
		}

		return lastMonthSpending.map((last, i) => ({
			index: i,
			last,
			current: i < currentMonthSpending.length ? currentMonthSpending[i] : undefined
		}));
	}

	static async getSpendingCategories(userId: number, range: Ranges): Promise<SpendingCategories> {
		const startDate = new Date();
		startDate.setMonth(new Date().getMonth() - 1);

		const transactions = await TransactionsService.getUserTransactions(userId, {
			range,
			order: 'asc'
		});

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
}
