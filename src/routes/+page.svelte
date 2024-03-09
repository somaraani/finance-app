<script lang="ts">
	import NetworthChart from '$lib/components/app/networth/networth-chart.svelte';
	import SpendingChart from '$lib/components/app/spending/spending-chart.svelte';
	import Topbar from '$lib/components/layout/topbar.svelte';
</script>

<div class="hidden flex-col md:flex">
	<div class="border-b">
		<Topbar />
	</div>
	<div class="flex-1 space-y-4 p-8 pt-6">
		<h2 class="mb-6 text-3xl font-bold tracking-tight">Dashboard</h2>
		<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
			<NetworthChart />
			<SpendingChart />
		</div>
	</div>
</div>
