import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { PlaidService } from '$lib/server/services/plaid';

export const load: PageServerLoad = async (event) => {
	const { link_token } = await PlaidService.createLinkToken(event.locals.user.id);
	return { linkToken: link_token };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { publicToken, metadata } = await request.json();
		return PlaidService.linkUserItem(locals.user.id, publicToken, metadata);
	}
};
