import { getSpendingCategories } from '$lib/server/services/spending';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Ranges } from '$lib/types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const range = url.searchParams.get('range') as Ranges;
	const categories = await getSpendingCategories(locals.user.id, range);
	return json(categories);
};
