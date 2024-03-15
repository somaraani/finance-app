<script lang="ts">
	import AccountsCard from '$lib/client/app/accounts/accounts-card.svelte';
	import NetworthChart from '$lib/client/app/networth/networth-chart.svelte';
	import SpendingCategories from '$lib/client/app/spending/spending-categories.svelte';
	import SpendingChart from '$lib/client/app/spending/spending-chart.svelte';
</script>

<h2 class="mb-6 text-3xl font-bold tracking-tight">Dashboard</h2>
<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
	<NetworthChart />
	<SpendingChart />
	<SpendingCategories />
	<AccountsCard />
</div>
