import { getUserAccountBalances } from '$lib/server/accounts';
import { getNetworthData } from '$lib/server/networth';
import { getSpendingTimeline } from '$lib/server/spending';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const id = event.locals.user.id;

	// We can invalidate the data to cause this to refresh
	event.depends('data:now');

	return {
		networth: await getNetworthData(id),
		spending: await getSpendingTimeline(id),
		accounts: await getUserAccountBalances(id)
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw fail(401);
		}
	}
};
