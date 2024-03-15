<script lang="ts">
	import { Button } from '$lib/client/ui/button';
	import { Separator } from '$lib/client/ui/separator';
	import DashboardIcon from 'lucide-svelte/icons/layout-dashboard';
	import NetworthIcon from 'lucide-svelte/icons/piggy-bank';
	import SpendingIcon from 'lucide-svelte/icons/hand-coins';
</script>

<div class="flex h-full flex-row">
	<div class="w-1/6 p-2">
		<Button href="/insights" class="w-full justify-start" variant="ghost"
			><DashboardIcon />Dashboard</Button
		>
		<Button href="/insights/networth" class="w-full justify-start" variant="ghost"
			><NetworthIcon />Networth</Button
		>
		<Button href="/insights/spending" class="w-full justify-start" variant="ghost"
			><SpendingIcon />Spending</Button
		>
	</div>
	<Separator orientation="vertical" />
	<div class="w-full p-8">
		<slot />
	</div>
</div>

<style>
	:global(.vis-xy-container) {
		--vis-tooltip-padding: '0px';
		--vis-tooltip-background-color: 'transparent';
		--vis-tooltip-border-color: 'transparent';
	}

	:global(vis-single-container) {
		--vis-donut-central-label-text-color: hsl(var(--foreground));
		--vis-donut-central-sub-label-text-color: hsl(var(--muted-foreground));
		--vis-donut-central-label-font-size: 24px;
		--vis-donut-central-label-font-weight: 700;
		--vis-donut-central-sub-label-font-size: 1em;
		--vis-font-family: inherit;
	}
</style>
