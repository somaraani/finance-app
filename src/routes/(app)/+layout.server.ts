import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { users } from '../../schemas/schema';
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
		user
	};
};
