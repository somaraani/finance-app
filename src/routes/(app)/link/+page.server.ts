import { createLinkToken } from '$lib/server/plaid';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { link_token } = await createLinkToken(event.locals.user.id);
	return { linkToken: link_token };
};
