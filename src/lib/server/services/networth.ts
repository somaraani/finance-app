import type { NetworthData, Ranges } from '$lib/types';
import { getDatesFromRange } from '$lib/util/filters';
import { and, eq, gte } from 'drizzle-orm';
import { AccountsService } from './accounts';
import { balances } from '../../../schemas/schema';
import { db } from '../util/db';

export class NetworthService {
	static async getNetworthData(userId: number, range: Ranges): Promise<NetworthData | undefined> {
		const userAccounts = await AccountsService.getUserAccounts(userId);
		const networths = new Map<number, number>();

		const { startDate } = getDatesFromRange(range);

		//TODO make this a sql statement
		await Promise.all(
			userAccounts.map(async (account) => {
				const accountBalances = await db
					.select()
					.from(balances)
					.where(and(eq(balances.accountId, account.id), gte(balances.timestamp, startDate)));

				const accountMap = new Map<string, number>();

				// get the account balances for each day
				accountBalances.forEach((balance) => {
					const day = new Date(balance.timestamp).toLocaleDateString();
					accountMap.set(day, balance.balance);
				});

				// add each days most recent balance to the networth chart
				accountMap.forEach((balance, day) => {
					const dayTimestamp = new Date(day).getTime();
					const current = networths.get(dayTimestamp) || 0;
					networths.set(dayTimestamp, current + balance);
				});
			})
		);

		if (networths.size === 0) {
			return;
		}

		// Sort the networths by date and get the most recent and oldest
		const history = [...networths.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([date, value]) => ({ date: new Date(date), value }));

		const lastZero = new Date(history[0].date);
		lastZero.setDate(history[0].date.getDate() - 1);

		if (history[0].date > startDate) {
			history.unshift({ date: startDate, value: 0 }, { date: lastZero, value: 0 });
		}

		return history;
	}
}
