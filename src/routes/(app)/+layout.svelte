<script>
	import { browser } from '$app/environment';
	import { Topbar } from '$lib/components/layout';
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
	<div class="hidden flex-col md:flex">
		<div class="border-b">
			<Topbar user={data.user} />
		</div>
		<div class="flex-1 space-y-4 p-8 pt-6">
			<slot />
		</div>
	</div>
</QueryClientProvider>
