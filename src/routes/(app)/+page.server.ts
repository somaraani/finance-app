import { AccountsService } from '$lib/server/services/accounts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const id = event.locals.user.id;

	// We can invalidate the data to cause this to refresh
	event.depends('data:now');

	return {
		accounts: await AccountsService.getUserAccountBalances(id)
	};
};
