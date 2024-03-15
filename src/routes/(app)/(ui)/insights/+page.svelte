<script lang="ts">
	import AccountsCard from '$lib/components/app/accounts/accounts-card.svelte';
	import NetworthChart from '$lib/components/app/networth/networth-chart.svelte';
	import SpendingChart from '$lib/components/app/spending/spending-chart.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import SpendingCategories from '$lib/components/app/spending/spending-categories.svelte';
</script>

<h2 class="mb-6 text-3xl font-bold tracking-tight">Dashboard</h2>

<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
	<NetworthChart />
	<!-- <SpendingChart data={data.spending} />
	<AccountsCard data={data.accounts} /> -->
	<SpendingCategories />
</div>
