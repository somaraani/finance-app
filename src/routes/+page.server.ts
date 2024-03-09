import { data as networth } from '$lib/server/networth';
import { data as spending } from '$lib/server/spending';

export const load = () => {
	return { networth, spending };
};
