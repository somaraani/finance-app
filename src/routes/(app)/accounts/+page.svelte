<script lang="ts">
	import * as Card from '$lib/client/ui/card';
	import { getRelativeTime, pageAction } from '$lib/util';
	import { toast } from 'svelte-sonner';
	import type { ActionData } from './$types';
	import AccountsIcon from '$lib/client/app/accounts/accounts-icon.svelte';
	import { Separator } from '$lib/client/ui/separator';
	import AddDialog from '$lib/client/app/accounts/add-dialog.svelte';
	import AddBalanceDialog from '$lib/client/app/accounts/add-balance-dialog.svelte';
	import DeleteAccountDialog from '$lib/client/app/accounts/delete-account-dialog.svelte';
	import { invalidate } from '$app/navigation';
	import ImportDialog from '$lib/client/app/imports/import-dialog.svelte';
	import DeleteInstitutionDialog from '$lib/client/app/accounts/delete-institution-dialog.svelte';
	import type { UserInstitute } from '$lib/types/institutions.types';

	export let data;

	async function deleteAccount(accountId: number) {
		const result = await pageAction<ActionData>('?/deleteAccount', { accountId });
		if (!result?.success) {
			toast.error('Failed to delete account', {
				description: result?.error
			});
		}
		invalidate('data:now');
	}

	async function addBalance(accountId: number, balance: number, date: Date) {
		const result = await pageAction<ActionData>('?/addBalance', { accountId, balance, date });
		if (!result?.success) {
			toast.error('Failed to add balance', {
				description: result?.error
			});
		}
		invalidate('data:now');
	}

	async function deleteInstitution(institute: UserInstitute) {
		const result = await pageAction<ActionData>('?/deleteInstitution', {
			institutionId: institute.id
		});
		if (!result?.success) {
			toast.error('Failed to delete institution', {
				description: result?.error
			});
		} else {
			toast.success(`Successfully deleted institution ${institute.name}`);
		}
		invalidate('data:now');
	}
</script>

<div class="mb-6 flex items-center">
	<h2 class="text-3xl font-bold tracking-tight">Linked Accounts</h2>
	<div class="ml-auto flex items-center gap-4">
		<AddDialog />
		<ImportDialog />
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
						<DeleteInstitutionDialog onSubmit={() => deleteInstitution(institute)} {institute} />
					</div>
				</Card.Header>
				<Separator />
				<Card.CardContent class="pt-2">
					{#each institute.accounts as account}
						<div class="mt-4 flex items-center">
							<AccountsIcon type={account.type} />
							<h1 class="ml-2">{account.name}</h1>
							<div class="ml-auto flex items-center">
								<p class="mr-4">
									{account.balance?.toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD'
									}) ?? '-'}
								</p>
								<AddBalanceDialog
									accountName={account.name}
									onSubmit={(balance, date) => addBalance(account.id, balance, date)}
								/>
								<DeleteAccountDialog
									accountName={account.name}
									onSubmit={() => deleteAccount(account.id)}
								/>
							</div>
						</div>
					{/each}
				</Card.CardContent>
			</Card.Root>
		</div>
	{/each}
</div>
