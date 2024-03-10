import { data as accounts } from '$lib/server/accounts';
import { db } from '$lib/server/db';
import { data as networth } from '$lib/server/networth';
import { data as spending } from '$lib/server/spending';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { users } from '../schemas/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(301, '/login');
	}

	const [user] = await db
		.select({
			username: users.username,
			firstName: users.firstName,
			lastName: users.lastName
		})
		.from(users)
		.where(eq(users.id, event.locals.user.id));

	return { networth, spending, accounts, user };
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw fail(401);
		}
	}
};
