import type { AccountHistory, AccountMedata, NetworthData, Ranges } from '$lib/types';
import { getDatesFromRange } from '$lib/util/filters';
import { SQL, and, eq, gte } from 'drizzle-orm';
import { balances } from '../../../schemas/schema';
import { db } from '../util/db';
import { AccountsService } from './accounts';

export class AssetsService {
	static async getNetworthData(userId: number, range: Ranges): Promise<NetworthData | undefined> {
		const assets = await this.getAssetTimeline(userId, range);
		return assets?.history.map((d) => ({
			...d,
			value: d.value.reduce((a, b) => a + b, 0)
		}));
	}

	static async getAssetTimeline(
		userId: number,
		range: Ranges
	): Promise<AccountHistory | undefined> {
		const userAccounts = await AccountsService.getUserAccounts(userId);
		const history = new Map<number, number[]>();

		const { startDate } = getDatesFromRange(range);
		const filter: SQL[] = [];
		if (startDate) {
			filter.push(gte(balances.timestamp, startDate));
		}

		//TODO make this a sql statement
		await Promise.all(
			userAccounts.map(async (account, index) => {
				const accountBalances = await db
					.select()
					.from(balances)
					.where(and(eq(balances.accountId, account.id), ...filter));

				const accountMap = new Map<string, number>();

				// get the account balances for each day
				accountBalances.forEach((balance) => {
					const day = new Date(balance.timestamp).toLocaleDateString();
					accountMap.set(day, balance.balance);
				});

				// add each days most recent balance to the networth chart
				accountMap.forEach((balance, day) => {
					const dayTimestamp = new Date(day).getTime();
					let current = history.get(dayTimestamp);
					if (!current) {
						current = new Array(userAccounts.length).fill(undefined);
						history.set(dayTimestamp, current);
					}
					current[index] = balance; // Use the last balance if the current balance is 0
				});
			})
		);

		if (history.size === 0) {
			return;
		}

		// we need to know the last know value for each account
		let startingValues: number[] | undefined;
		if (startDate) {
			startingValues = await Promise.all(
				userAccounts.map(async (account) => {
					const lastValue = await AccountsService.getAccountBalance(account.id, startDate);
					return lastValue ?? 0;
				})
			);
		}

		let lastValues = new Array(userAccounts.length).fill(undefined);

		// Sorts the history by date and fills in any missing days for an account with the last known value
		let sortedHistory = [...history.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([date, value]) => ({
				date: new Date(date),
				value: value.map((item, index) => {
					if (item !== undefined) {
						lastValues[index] = item;
					}
					return item !== undefined
						? item
						: lastValues[index] ?? (startingValues ? startingValues[index] : 0);
				})
			}));

		const last = new Date(sortedHistory[0].date);
		last.setDate(sortedHistory[0].date.getDate() - 1);

		if (startDate && sortedHistory[0].date > startDate) {
			let currentDate = new Date(startDate);
			let newEntries = [];
			while (currentDate <= last) {
				newEntries.push({ date: new Date(currentDate), value: startingValues! });
				currentDate.setDate(currentDate.getDate() + 1);
			}
			sortedHistory = newEntries.concat(sortedHistory);
		}

		return {
			accounts: userAccounts as AccountMedata[],
			history: sortedHistory
		};
	}
}
