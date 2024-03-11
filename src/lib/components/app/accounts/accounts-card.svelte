<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { Account } from '$lib/types';
	import SavingsIcon from 'lucide-svelte/icons/piggy-bank';
	import ChequeingIcon from 'lucide-svelte/icons/banknote';
	import { AccountSubtype } from 'plaid';

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
				<div class="flex gap-3 text-sm font-semibold">
					{#if account.subtype === AccountSubtype.Savings}
						<SavingsIcon />
					{:else}
						<ChequeingIcon />
					{/if}
					<div>
						<p class="font-medium text-muted-foreground">
							{account.institutionName}
						</p>
						<p class="text-md font-semibold">{account.name}</p>
					</div>
				</div>
				<div class="ml-auto text-right">
					<p>{account.balance ? formatBalance(account.balance) : '-'}</p>
					<p class="text-xs text-muted-foreground">Upated 3 seconds ago</p>
				</div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
