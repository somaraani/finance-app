import { AccountsService } from '$lib/server/services/accounts';
import { ExportService } from '$lib/server/services/export';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const institutions = await AccountsService.getUserAccountsByInstitution(event.locals.user.id);

	// We can invalidate the data to cause this to refresh
	event.depends('data:now');

	return { institutions };
};

export const actions: Actions = {
	deleteInstitution: async (event) => {
		const request = await event.request.json();
		const result = await AccountsService.deleteInstitution(
			event.locals.user.id,
			request.institutionId
		).catch((e) => {
			console.error(e);
			return { success: false, error: e.message };
		});
		return result;
	},
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
	},
	export: async (event) => {
		const zipContent = await ExportService.exportUserAssetHistory(event.locals.user.id);
		const base64Data = zipContent.toString('base64');
		return base64Data;
	}
};
