import type { NetworthData } from '$lib/types';
import { eq } from 'drizzle-orm';
import { balances } from '../../schemas/schema';
import { getUserAccounts } from './accounts';
import { db } from './db';

export async function getNetworthData(userId: number): Promise<NetworthData> {
	const userAccounts = await getUserAccounts(userId);
	const networths = new Map<number, number>();

	await Promise.all(
		userAccounts.map(async (account) => {
			const accountBalances = await db
				.select()
				.from(balances)
				.where(eq(balances.accountId, account.id));

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

	// Sort the networths by date and get the most recent and oldest
	const sortedNetworths = [...networths.entries()].sort((a, b) => a[0] - b[0]);
	const current = sortedNetworths.length > 0 ? sortedNetworths[0][1] : 0;
	const oldest = sortedNetworths.length > 0 ? sortedNetworths[sortedNetworths.length - 1][1] : 0;

	return {
		history: new Map(sortedNetworths),
		current: current ?? 0,
		delta: current ? current - oldest : 0,
		deltaSince: new Date(sortedNetworths[sortedNetworths.length - 1][0])
	};
}
