import { lucia } from '$lib/server/util/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../../$types';

export const load: PageServerLoad = async (event) => {
	await lucia.invalidateSession(event.locals.session?.id ?? '');
	redirect(302, '/login');
};
