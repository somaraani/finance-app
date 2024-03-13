<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { pageAction } from '$lib/util/pageActions.js';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import type { ActionData } from './$types';

	export let data;

	let exited = false;
	let success = false;
	let error: string | undefined;

	function startPlaidLink() {
		// Plaid object is loaded from the script tag in the head
		const Plaid = (window as any).Plaid;
		if (!Plaid) {
			exited = true;
			error = 'Could not start Plaid Link';
			return;
		}
		const handler = Plaid.create({
			token: data.linkToken,
			onSuccess: handleSuccess,
			onExit: handleError
		});
		handler.open();
	}

	async function handleError(err: any) {
		if (err) {
			error = err.toString();
		}
		exited = true;
	}

	async function handleSuccess(publicToken: string, metadata: any) {
		exited = true;
		success = true;
		const result = await pageAction<ActionData>({ publicToken, metadata });
		if (result?.success) {
			window.location.href = '/';
		} else {
			success = false;
			error = 'Unknown error';
		}
	}
</script>

<AlertDialog.Root bind:open={exited} closeOnEscape={false} closeOnOutsideClick={false}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			{#if success}
				Linking Account
			{:else if !success}
				No Account Linked
			{/if}
		</AlertDialog.Header>
		<AlertDialog.Description>
			{#if error}
				An error occured while connecting your accounts.
				<p class="text-red-500">{error}</p>
			{:else if !success}
				You exited Plaid Link without connecting an account. Would you like to try again?
			{:else}
				<div class="flex gap-3">
					<Spinner />
					Linking accounts, please wait ...
				</div>
			{/if}
		</AlertDialog.Description>
		{#if !success}
			<AlertDialog.Footer>
				<Button variant="ghost" href="/">Back to Dashbord</Button>
				<Button on:click={startPlaidLink}>Try Again</Button>
			</AlertDialog.Footer>
		{/if}
	</AlertDialog.Content>
</AlertDialog.Root>

<svelte:head>
	<script
		src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
		on:load={startPlaidLink}
	></script>
</svelte:head>
