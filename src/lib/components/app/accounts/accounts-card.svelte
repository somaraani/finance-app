<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { AccountBalance } from '$lib/types';
	import { getRelativeTime } from '$lib/util';
	import AccountsIcon from './accounts-icon.svelte';

	export let data: AccountBalance[];

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
	{#each data as account}
		<Separator />
		<Card.Content class="flex items-center py-3">
			<div class="flex items-center gap-3 text-sm font-semibold">
				<AccountsIcon type={account.type} subtype={account.subtype} />
				<div>
					<p class="font-medium text-muted-foreground">
						{account.institutionName}
					</p>
					<p class="text-md font-semibold">{account.name}</p>
				</div>
			</div>
			<div class="ml-auto text-right">
				<p>{account.balance ? formatBalance(account.balance) : '-'}</p>
				<p class="text-xs text-muted-foreground">
					Updated {getRelativeTime(account.lastUpdated)}
				</p>
			</div>
		</Card.Content>
	{/each}
</Card.Root>
