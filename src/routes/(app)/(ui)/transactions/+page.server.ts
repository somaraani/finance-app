import { TransactionsService } from '$lib/server/services/transactions';
import { logger } from '$lib/util/logs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	logger.info(`Fetching transactions for user ${event.locals.user.username}`);

	// We can invalidate the data to cause this to refresh
	event.depends('data:now');

	const transactions = await TransactionsService.getUserTransactions(event.locals.user.id);
	return { transactions };
};
