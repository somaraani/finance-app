<script lang="ts">
	import { Button } from '$lib/client/ui/button';
	import * as Dialog from '$lib/client/ui/dialog';
	import UploadIcon from 'lucide-svelte/icons/arrow-up-from-line';
	import BalanceIcon from 'lucide-svelte/icons/bar-chart-2';
	import TransactionsIcon from 'lucide-svelte/icons/receipt-text';
	import * as ToggleGroup from '$lib/client/ui/toggle-group/index.js';
	import Label from '$lib/client/ui/label/label.svelte';

	export let accountName: string;
	let dataType: 'transactions' | 'balances' = 'transactions';
	let file: FileList;

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			file = input.files[0];
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			console.log('here');
			file = event.dataTransfer.files[0];
			// Handle file upload here
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="ghost">
			<UploadIcon />Upload Data
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header class="mb-4">
			<Dialog.Title>Upload Data</Dialog.Title>
		</Dialog.Header>
		<Label>Data Type</Label>
		<ToggleGroup.Root
			value={dataType}
			loop={true}
			onValueChange={(value) => {
				dataType = value;
			}}
			variant="outline"
			type="single"
			class="justify-start"
		>
			<ToggleGroup.Item value="transactions">
				<TransactionsIcon class="mr-2 text-muted-foreground" />
				Transactions
			</ToggleGroup.Item>
			<ToggleGroup.Item value="balances">
				<BalanceIcon class="mr-2 text-muted-foreground" />
				Balance History
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<div
			class="mt-4 cursor-pointer rounded border-2 border-dashed border-gray-500 p-10 text-center"
			role="form"
			on:dragover={handleDragOver}
			on:drop={handleDrop}
		>
			Drag and drop files here or click to upload
			<input type="file" on:change={handleFileChange} style="display: none" id="fileInput" />
			<label for="fileInput">
				<Button variant="ghost" class="mt-6">
					{#if !file}
						<UploadIcon />Upload files
					{:else}
						{file.name}
					{/if}
				</Button>
			</label>
		</div>
	</Dialog.Content>
</Dialog.Root>
