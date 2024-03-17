import { createLinkToken } from '$lib/server/plaid';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { linkUserItem } from '$lib/server/plaid';
import { logger } from '$lib/util/logs';

export const load: PageServerLoad = async (event) => {
	logger.info(`Creating link token for user ${event.locals.user.username}`);
	const { link_token } = await createLinkToken(event.locals.user.id);
	return { linkToken: link_token };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { publicToken, metadata } = await request.json();
		return linkUserItem(locals.user.id, publicToken, metadata);
	}
};
