<script lang="ts">
	import * as Dialog from '$lib/client/ui/dialog';
	import * as Card from '$lib/client/ui/card';
	import ManualIcon from 'lucide-svelte/icons/file-up';
	import PlaidIcon from 'lucide-svelte/icons/cloud';
	import Manual from './connectors/manual.svelte';
	import NewIcon from 'lucide-svelte/icons/plus';
	import Button from '$lib/client/ui/button/button.svelte';

	let selectedConnector:
		| { title: any; component: any; description?: string; icon?: typeof ManualIcon }
		| undefined = undefined;

	const connectors = [
		{
			title: 'Manual',
			description:
				'Create a new account manually by inputting the details. You can add transactions and balances by uploading CSV files.',
			icon: ManualIcon,
			component: Manual
		},
		{
			title: 'Plaid',
			description: 'Use Plaid to connect your accounts.',
			icon: PlaidIcon,
			component: Manual
		}
	];
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="link">
			<NewIcon />Add New
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		{#if !selectedConnector}
			<Dialog.Header>
				<Dialog.Title>Add Account</Dialog.Title>
			</Dialog.Header>
			<div class="mt-4 space-y-4 p-2">
				{#each connectors as connector}
					<div
						on:click={() => {
							selectedConnector = connector;
						}}
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								selectedConnector = connector;
							}
						}}
						role="button"
						tabindex="0"
					>
						<Card.Root clickable={true}>
							<Card.Header>
								<Card.Title>
									<svelte:component this={connector.icon} />
									{connector.title}
								</Card.Title>
								<Card.Description>{connector.description}</Card.Description>
							</Card.Header>
						</Card.Root>
					</div>
				{/each}
			</div>
		{:else}
			<Dialog.Header>
				<Card.Title>
					<svelte:component this={selectedConnector.icon} />
					{selectedConnector.title}
				</Card.Title>
			</Dialog.Header>
			<svelte:component this={selectedConnector.component} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
