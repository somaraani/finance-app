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

		// Sort the networths by date and get the most recent and oldest
		let lastValues = new Array(userAccounts.length).fill(undefined);

		// Sorts the history by date and fills in any missing days for an account with the last known value
		const sortedHistory = [...history.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([date, value]) => ({
				date: new Date(date),
				value: value.map((item, index) => {
					if (item !== undefined) {
						lastValues[index] = item;
					}
					return item !== undefined ? item : lastValues[index] ?? 0;
				})
			}));

		const lastZero = new Date(sortedHistory[0].date);

		lastZero.setDate(sortedHistory[0].date.getDate() - 1);

		if (startDate && sortedHistory[0].date > startDate) {
			sortedHistory.unshift(
				{ date: startDate, value: new Array(userAccounts.length).fill(0) },
				{ date: lastZero, value: new Array(userAccounts.length).fill(0) }
			);
		}

		return {
			accounts: userAccounts as AccountMedata[],
			history: sortedHistory
		};
	}
}
