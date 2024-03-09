<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { Account } from '$lib/types';

	export let data: Account[];

	function formatBalance(balance: number): string {
		return balance.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Accounts</Card.Title>
	</Card.Header>
	<Card.Content>
		{#each data as account}
			<Separator />
			<div class="flex items-center py-3">
				<div class="text-sm font-semibold">{account.name}</div>
				<div class="ml-auto">{formatBalance(account.balance)}</div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
