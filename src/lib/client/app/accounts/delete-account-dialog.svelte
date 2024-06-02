<script lang="ts">
	import * as Dialog from '$lib/client/ui/dialog';
	import { Button } from '$lib/client/ui/button';
	import type { UserInstitute } from '$lib/types/institutions.types';
	import Spinner from '$lib/client/ui/spinner/spinner.svelte';
	import TrashIcon from 'lucide-svelte/icons/trash-2';

	export let accountName: string;
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
	<Button on:click={() => (dialogOpen = true)} variant="ghost" size="icon"
		><TrashIcon class="text-muted-foreground" size={23} /></Button
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete {accountName}?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete all data associated with this
				account.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			{#if loading}
				<Button variant="secondary" disabled>
					<Spinner />
					Delete Account
				</Button>
			{:else}
				<Button on:click={onClick} variant="destructive">Delete Account</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
