import { data as networth } from '$lib/server/networth';
import { data as spending } from '$lib/server/spending';
import { data as accounts } from '$lib/server/accounts';

export const load = () => {
	return { networth, spending, accounts };
};
