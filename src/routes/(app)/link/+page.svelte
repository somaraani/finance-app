<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	export let data;
	let exited = false;

	function startPlaidLink() {
		const handler = Plaid.create({
			token: data.linkToken,
			onSuccess: handleSuccess,
			onLoad: () => {
				console.log('loaded');
			},
			onExit: (err, metadata) => {
				exited = true;
			},
			onEvent: (eventName, metadata) => {
				console.log('on event', eventName);
			}
		});
		handler.open();
	}

	function handleSuccess(publicToken: string, metadata: any) {
		fetch('./', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ publicToken, metadata })
		});
	}
</script>

<div>
	<Dialog.Root bind:open={exited}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>No Account Linked</Dialog.Title>
			</Dialog.Header>
			<Dialog.Description>
				You exited Plaid Link without connecting an account. Would you like to try again?
			</Dialog.Description>
			<Dialog.Footer>
				<Button variant="ghost" href="/">Back to Dashbord</Button>
				<Button on:click={startPlaidLink}>Try Again</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>

<svelte:head>
	<script
		src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
		on:load={startPlaidLink}
	></script>
</svelte:head>
