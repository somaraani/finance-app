import { syncAccountBalances } from '$lib/server/accounts';
import { syncUserTransactions } from '$lib/server/transactions';
import { logger } from '$lib/util/logs';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	logger.info(`Syncing accounts for user ${locals.user.username}`);
	const response = await syncAccountBalances(locals.user.id);
	await syncUserTransactions(locals.user.id);
	return json(response);
};
