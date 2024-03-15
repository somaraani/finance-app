import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Ranges } from '$lib/types';
import { getNetworthData } from '$lib/server/networth';

export const GET: RequestHandler = async ({ locals, url }) => {
	const range = url.searchParams.get('range') as Ranges;
	const networth = await getNetworthData(locals.user.id, range);
	return json(networth);
};
