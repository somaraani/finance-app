<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import DashboardIcon from 'lucide-svelte/icons/layout-dashboard';
	import NetworthIcon from 'lucide-svelte/icons/piggy-bank';
</script>

<div class="flex h-full flex-row">
	<div class="w-1/6 p-2">
		<Button href="/insights" class="w-full justify-start" variant="ghost"
			><DashboardIcon />Dashboard</Button
		>
		<Button href="/insights/networth" class="w-full justify-start" variant="ghost"
			><NetworthIcon />Networth</Button
		>
	</div>
	<Separator orientation="vertical" />
	<div class="w-full p-8">
		<slot />
	</div>
</div>
