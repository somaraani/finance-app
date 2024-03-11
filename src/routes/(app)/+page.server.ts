import { getUserAccountBlances } from '$lib/server/accounts';
import { getNetworthData } from '$lib/server/networth';
import { getSpendingTimeline } from '$lib/server/spending';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const id = event.locals.user.id;
	return {
		networth: await getNetworthData(id),
		spending: await getSpendingTimeline(id),
		accounts: await getUserAccountBlances(id)
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw fail(401);
		}
	}
};
