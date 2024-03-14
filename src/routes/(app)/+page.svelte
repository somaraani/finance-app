<script lang="ts">
	import AccountsCard from '$lib/components/app/accounts/accounts-card.svelte';
	import NetworthChart from '$lib/components/app/networth/networth-chart.svelte';
	import SpendingChart from '$lib/components/app/spending/spending-chart.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import SpendingCategories from '$lib/components/app/spending/spending-categories.svelte';

	export let data;
</script>

<h2 class="mb-6 text-3xl font-bold tracking-tight">Dashboard</h2>

{#if data.accounts?.length === 0}
	<div>
		<Card.Root>
			<Card.Header>
				<Card.Title>No Accounts Linked</Card.Title>
			</Card.Header>

			<Card.Content class="text-muted-foreground">Link an account to get started</Card.Content>

			<Card.Footer>
				<Button href="/link">Link Account</Button>
			</Card.Footer>
		</Card.Root>
	</div>
{:else}
	<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
		<NetworthChart data={data.networth} />
		<SpendingChart data={data.spending} />
		<AccountsCard data={data.accounts} />
		<SpendingCategories />
	</div>
{/if}
