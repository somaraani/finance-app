import { AccountsService } from '$lib/server/services/accounts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const institutions = await AccountsService.getUserAccountsByInstitution(event.locals.user.id);

	// We can invalidate the data to cause this to refresh
	event.depends('data:now');

	return { institutions };
};

export const actions: Actions = {
	deleteAccount: async (event) => {
		const request = await event.request.json();
		const result = await AccountsService.deleteAccount(
			event.locals.user.id,
			request.accountId
		).catch((e) => {
			console.error(e);
			return { success: false, error: e.message };
		});
		return result;
	},
	addBalance: async (event) => {
		const { accountId, balance, date } = await event.request.json();
		const result = await AccountsService.createAccountBalance(
			event.locals.user.id,
			accountId,
			balance,
			new Date(date)
		).catch((e) => {
			console.error(e);
			return { success: false, error: e.message };
		});
		return result;
	}
};
