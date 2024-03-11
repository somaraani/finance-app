<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { pageAction } from '$lib/util';
	import { toast } from 'svelte-sonner';
	import type { ActionData } from './$types';

	export let data;

	async function unlink(institutionId: string) {
		const result = await pageAction<ActionData>('?/unlinkItem', { institutionId });
		if (!result?.success) {
			toast.error('Failed to unlink account');
		} else {
			toast.success('Successfully unlinked account');
		}
	}
</script>

<h2 class="mb-6 text-3xl font-bold tracking-tight">Linked Accounts</h2>
{#each data.institutions as institute}
	<div>
		<Card.Root>
			<Card.Header>
				{institute.name}
			</Card.Header>
			<Card.CardContent>
				{#each institute.accounts as account}
					<div class="flex">
						<h1>{account.name}</h1>
						<p>{account.balance}</p>
						<div class="ml-auto">
							<form>
								<Button on:click={() => unlink(institute.id)} variant="ghost">Unlink</Button>
							</form>
						</div>
					</div>
				{/each}
			</Card.CardContent>
		</Card.Root>
	</div>
{/each}
