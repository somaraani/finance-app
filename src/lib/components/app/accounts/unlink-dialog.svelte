<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import type { UserInstitute } from '$lib/types/institutions.types';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

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
	<Button on:click={() => (dialogOpen = true)} variant="ghost">Unlink</Button>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Unlink {institute.name}?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete all data associated with this
				account.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			{#if loading}
				<Button variant="secondary" disabled>
					<Spinner />
					Unlink
				</Button>
			{:else}
				<Button on:click={onClick} variant="destructive">Unlink</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
