<script lang="ts">
	import AccountsCard from '$lib/client/app/accounts/accounts-card.svelte';
	import NetworthChart from '$lib/client/app/networth/networth-chart.svelte';
	import SpendingChart from '$lib/client/app/spending/spending-chart.svelte';
	import * as Card from '$lib/client/ui/card';
	import { Button } from '$lib/client/ui/button';
	import SpendingCategories from '$lib/client/app/spending/spending-categories.svelte';
</script>

<h2 class="mb-6 text-3xl font-bold tracking-tight">Dashboard</h2>
<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
	<NetworthChart />
	<!-- <SpendingChart data={data.spending} />
	<AccountsCard data={data.accounts} /> -->
	<SpendingCategories />
</div>
