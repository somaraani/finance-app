import { updateAccountBalances } from '$lib/server/accounts';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	const response = await updateAccountBalances(locals.user.id);
	return json(response);
};
