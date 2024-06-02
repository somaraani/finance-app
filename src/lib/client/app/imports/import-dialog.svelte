<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import Button from '$lib/client/ui/button/button.svelte';
	import * as Dialog from '$lib/client/ui/dialog';
	import { Spinner } from '$lib/client/ui/spinner';
	import { trpc } from '$lib/trpc/client';
	import ImportIcon from 'lucide-svelte/icons/file-down';

	let fileInput: HTMLInputElement;
	const browseFiles = () => {
		fileInput.click();
	};

	let open = false;

	const verifyReq = browser ? trpc().imports.balances.createMutation() : undefined;

	const handleFiles = async (e: any) => {
		const files: File[] = Array.from(e.target.files);
		const filePromises = files.map((file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (event) => resolve({ content: event.target?.result, name: file.name });
				reader.onerror = (error) => reject(error);
				reader.readAsText(file as any);
			});
		});
		const fileContents = (await Promise.all(filePromises)) as { content: string; name: string }[];
		await $verifyReq?.mutateAsync({ files: fileContents });
		invalidate('data:now');
		open = false;
	};
</script>

<Dialog.Root {open}>
	<Dialog.Trigger>
		<Button on:click={() => (open = true)} variant="secondary">
			<ImportIcon />Import Data
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Import Files</Dialog.Title>
			<Dialog.Description
				>You can select a directory to import all files in the directory, or select individual files
				to import.
			</Dialog.Description>
		</Dialog.Header>
		<input
			type="file"
			name="files"
			accept=".csv"
			multiple
			bind:this={fileInput}
			on:change={handleFiles}
			style="display: none;"
		/>
		{#if $verifyReq?.status === 'pending'}
			<p class="flex items-center gap-2">
				<Spinner /> Uploading data...
			</p>
		{:else}
			<Button on:click={browseFiles}>Browse Files</Button>
		{/if}
	</Dialog.Content>
</Dialog.Root>
