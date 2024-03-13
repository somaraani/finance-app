import { syncAccountBalances } from '$lib/server/accounts';
import { syncUserTransactions } from '$lib/server/transactions';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	const response = await syncAccountBalances(locals.user.id);
	await syncUserTransactions(locals.user.id);
	return json(response);
};
