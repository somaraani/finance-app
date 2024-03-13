import { getUserTransactions } from '$lib/server/transactions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const transactions = await getUserTransactions(event.locals.user.id);
	return { transactions };
};
