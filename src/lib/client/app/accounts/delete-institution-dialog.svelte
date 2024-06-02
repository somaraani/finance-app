<script lang="ts">
	import * as Dialog from '$lib/client/ui/dialog';
	import { Button } from '$lib/client/ui/button';
	import type { UserInstitute } from '$lib/types/institutions.types';
	import Spinner from '$lib/client/ui/spinner/spinner.svelte';

	export let institute: UserInstitute;
	export let onSubmit: () => Promise<void>;

	let loading = false;
	let dialogOpen = false;

	async function onClick() {
		loading = true;
		await onSubmit();
		loading = false;
		dialogOpen = false;
	}
</script>

<Dialog.Root bind:open={dialogOpen} closeOnEscape={!loading} closeOnOutsideClick={!loading}>
	<Button on:click={() => (dialogOpen = true)} variant="ghost">Delete</Button>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete {institute.name}</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete all accounts and data associated
				with this institution.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			{#if loading}
				<Button variant="secondary" disabled>
					<Spinner />
					Delete
				</Button>
			{:else}
				<Button on:click={onClick} variant="destructive">Delete</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
