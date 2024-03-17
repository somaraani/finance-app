import { AccountsService } from '$lib/server/services/accounts';
import { PlaidService } from '$lib/server/services/plaid';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const institutions = await AccountsService.getUserAccountsByInstitution(event.locals.user.id);
	return { institutions };
};

export const actions: Actions = {
	unlinkItem: async (event) => {
		const request = await event.request.json();
		return PlaidService.unlinkItem(event.locals.user.id, request.institutionId).catch((e) => {
			console.error(e);
			return { success: false, error: e.message };
		});
	}
};
