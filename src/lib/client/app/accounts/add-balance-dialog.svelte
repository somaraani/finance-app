<script lang="ts">
	import * as Dialog from '$lib/client/ui/dialog';
	import { Button } from '$lib/client/ui/button';
	import Spinner from '$lib/client/ui/spinner/spinner.svelte';
	import { Input } from '$lib/client/ui/input/index.js';
	import { Label } from '$lib/client/ui/label/index.js';
	import PlusIcon from 'lucide-svelte/icons/list-plus';

	export let accountName: string;
	export let onSubmit: (balance: number, date: Date) => void;

	let loading = false;
	let dialogOpen = false;

	let balance = '0';
	let date = new Date().toISOString().split('T')[0]; // Default to today's date

	async function handleSubmit() {
		loading = true;
		// our date picker doesnt have a time, so default to right nows time
		const selectedDate = new Date(date);
		const now = new Date();
		selectedDate.setHours(
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
			now.getMilliseconds()
		);
		const parsedBalance = parseFloat(balance.replace(',', '').trim());
		await onSubmit(parsedBalance, selectedDate);
		loading = false;
		dialogOpen = false;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<Dialog.Root bind:open={dialogOpen} closeOnEscape={!loading} closeOnOutsideClick={!loading}>
	<Button on:click={() => (dialogOpen = true)} variant="ghost" size="icon"
		><PlusIcon class="text-green-500" size={27} /></Button
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update {accountName} balance</Dialog.Title>
			<Dialog.Description>Enter the amount to add to the balance.</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col space-y-1.5">
				<Label for="balance">Balance</Label>
				<Input
					bind:value={balance}
					placeholder="Account Balance"
					required
					on:keypress={handleKeyPress}
				/>
			</div>
			<div class="flex flex-col space-y-1.5">
				<Label for="date">Transaction Date</Label>
				<Input
					type="date"
					id="date"
					bind:value={date}
					placeholder="Date"
					required
					on:keypress={handleKeyPress}
				/>
			</div>
		</div>

		<Dialog.Footer>
			{#if loading}
				<Button type="submit" variant="secondary" disabled>
					<Spinner />
					Add Balance
				</Button>
			{:else}
				<Button type="submit" variant="default" on:click={handleSubmit}>Add Balance</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
