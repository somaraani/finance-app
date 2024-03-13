<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { getRelativeTime, pageAction } from '$lib/util';
	import { toast } from 'svelte-sonner';
	import type { ActionData } from './$types';
	import AccountsIcon from '$lib/components/app/accounts/accounts-icon.svelte';
	import NewIcon from 'lucide-svelte/icons/plus';
	import UnlinkDialog from '$lib/components/app/accounts/unlink-dialog.svelte';
	import { Separator } from '$lib/components/ui/separator';

	export let data;

	async function unlink(institutionId: number) {
		const result = await pageAction<ActionData>('?/unlinkItem', { institutionId });
		if (!result?.success) {
			toast.error('Failed to unlink account', {
				description: result?.error
			});
		} else {
			toast.success('Successfully unlinked account');
		}
	}
</script>

<div class="flex">
	<h2 class="mb-6 text-3xl font-bold tracking-tight">Linked Accounts</h2>
	<div class="ml-auto">
		<Button variant="link" href="/link"><NewIcon />Add New</Button>
	</div>
</div>
<div>
	{#each data.institutions as institute}
		<div class="mb-8">
			<Card.Root>
				<Card.Header class="flex flex-row items-center rounded-t py-2">
					<Card.Title class="flex flex-row items-center gap-2">
						{institute.name}
					</Card.Title>
					<div class="ml-auto flex items-center gap-3">
						<p class="text-sm text-muted-foreground">
							Last upated {getRelativeTime(institute.accounts[0].lastUpdated)}
						</p>
						<form>
							<UnlinkDialog onSubmit={() => unlink(institute.id)} {institute} />
						</form>
					</div>
				</Card.Header>
				<Separator />
				<Card.CardContent class="pt-2">
					{#each institute.accounts as account}
						<div class="mt-4 flex items-center">
							<AccountsIcon type={account.type} subtype={account.subtype} />
							<h1 class="ml-2">{account.name}</h1>
							<div class="ml-auto">
								<p>
									{account.balance?.toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD'
									}) ?? '-'}
								</p>
							</div>
						</div>
					{/each}
				</Card.CardContent>
			</Card.Root>
		</div>
	{/each}
</div>
