<script>
	import { browser } from '$app/environment';
	import { Topbar } from '$lib/client/layout';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	export let data;

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="hidden h-screen flex-col md:flex">
		<div class="border-b">
			<Topbar user={data.user} />
		</div>
		<div class="flex-1">
			<slot />
		</div>
	</div>
</QueryClientProvider>
