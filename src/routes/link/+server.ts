import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { linkUserItem } from '$lib/server/plaid';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { publicToken, metadata } = await request.json();
	await linkUserItem(locals.user.id, publicToken, metadata);
	return json({ success: true });
};
