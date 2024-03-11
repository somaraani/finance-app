import { getUserInstitutions } from '$lib/server/institutions';
import { unlinkItem } from '$lib/server/plaid';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const institutions = await getUserInstitutions(event.locals.user.id);
	return { institutions };
};

export const actions: Actions = {
	unlinkItem: async (event) => {
		const request = await event.request.json();
		const result = await unlinkItem(event.locals.user.id, request.institutionId);
		if (result) {
			return { success: true };
		} else {
			return { success: false };
		}
	}
};
