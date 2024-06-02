import { AccountsService } from '$lib/server/services/accounts';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	redirect(302, '/insights');
};
