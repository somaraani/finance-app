<script lang="ts">
	import { Input } from '$lib/client/ui/input/index.js';
	import { Label } from '$lib/client/ui/label/index.js';
	import { Button } from '$lib/client/ui/button/index.js';
	import Spinner from '$lib/client/ui/spinner/spinner.svelte';
	import { trpc } from '$lib/trpc/client';

	export let onConnect: () => void;

	let apiKey = '';

	const mutation = trpc().accounts.connectToInstitution.createMutation();

	async function handleSubmit() {
		await $mutation.mutateAsync({
			connector: 'questrade',
			metadata: {
				apiKey
			}
		});
		onConnect();
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="space-y-4">
		<div class="space-y-2">
			<Label for="apiKey">Questrade API Key</Label>
			<Input id="apiKey" bind:value={apiKey} placeholder="Enter your API key" required />
		</div>
		<div class="w-full">
			{#if $mutation.status === 'pending'}
				<Button type="submit" class="w-full" disabled={true}><Spinner />Submitting...</Button>
			{:else}
				<Button type="submit" class="w-full" disabled={apiKey.trim() === ''}>Submit</Button>
			{/if}
		</div>
	</div>
</form>
