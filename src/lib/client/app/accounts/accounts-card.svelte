<script lang="ts">
	import * as Card from '$lib/client/ui/card';
	import Separator from '$lib/client/ui/separator/separator.svelte';
	import { trpc } from '$lib/trpc/client';
	import { formatMoney, getRelativeTime } from '$lib/util';
	import AccountsIcon from './accounts-icon.svelte';

	const req = trpc().accounts.getAccounts.createQuery();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Accounts</Card.Title>
	</Card.Header>
	{#if $req.data}
		{#each $req.data as account}
			<Separator />
			<Card.Content class="flex items-center py-3">
				<div class="flex items-center gap-3 text-sm font-semibold">
					<AccountsIcon type={account.type} />
					<div>
						<p class="font-medium text-muted-foreground">
							{account.institutionName}
						</p>
						<p class="text-md font-semibold">{account.name}</p>
					</div>
				</div>
				<div class="ml-auto text-right">
					<p>
						{#if account.balance !== null}
							{account.balance.value.toLocaleString('en-US', {
								style: 'currency',
								currency: account.balance.currency,
								currencyDisplay: 'narrowSymbol'
							})}
							<span class="text-xs text-muted-foreground">{account.balance.currency}</span>

							{#if account.balance.currency !== account.convertedBalance.currency}
								= {account.convertedBalance.value.toLocaleString('en-US', {
									style: 'currency',
									currency: account.convertedBalance.currency,
									currencyDisplay: 'narrowSymbol'
								})}
								<span class="text-xs text-muted-foreground"
									>{account.convertedBalance.currency}</span
								>
							{/if}
						{:else}
							-
						{/if}
					</p>
					<p class="text-xs text-muted-foreground">
						Updated {getRelativeTime(account.lastUpdated)}
					</p>
				</div>
			</Card.Content>
		{/each}
	{/if}
</Card.Root>
