import { getUserAccountBlances } from '$lib/server/accounts';
import { db } from '$lib/server/db';
import { getNetworthData } from '$lib/server/networth';
import { getSpendingTimeline } from '$lib/server/spending';
import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { users } from '../schemas/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const id = event.locals.user.id;
	const [user] = await db
		.select({
			username: users.username,
			firstname: users.firstname,
			lastname: users.lastname
		})
		.from(users)
		.where(eq(users.id, id));

	return {
		user,
		networth: await getNetworthData(id),
		spending: await getSpendingTimeline(id),
		accounts: await getUserAccountBlances(id)
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw fail(401);
		}
	}
};
