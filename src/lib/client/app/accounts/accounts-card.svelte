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
					<AccountsIcon type={account.type} subtype={account.subtype} />
					<div>
						<p class="font-medium text-muted-foreground">
							{account.institutionName}
						</p>
						<p class="text-md font-semibold">{account.name}</p>
					</div>
				</div>
				<div class="ml-auto text-right">
					<p>{account.balance ? formatMoney(account.balance) : '-'}</p>
					<p class="text-xs text-muted-foreground">
						Updated {getRelativeTime(account.lastUpdated)}
					</p>
				</div>
			</Card.Content>
		{/each}
	{/if}
</Card.Root>
