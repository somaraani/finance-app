<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/client/ui/button/index.js';
	import { Input } from '$lib/client/ui/input/index.js';
	import { Label } from '$lib/client/ui/label/index.js';
	import * as Select from '$lib/client/ui/select/index.js';
	import Spinner from '$lib/client/ui/spinner/spinner.svelte';
	import { trpc } from '$lib/trpc/client';

	let accountName = '';
	let accountType: any;
	let institution = '';

	const accountTypes = ['Checking', 'Savings', 'Credit Card'];

	let formValid = false;

	$: {
		formValid = accountName.trim() !== '' && !!accountType && institution.trim() !== '';
	}

	const mutation = trpc().accounts.createAccount.createMutation();

	async function handleSubmit() {
		await $mutation.mutate({
			name: accountName,
			type: accountType?.toLowerCase(),
			institutionName: institution
		});
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="grid w-full items-center gap-4">
		<div class="space-y-2">
			<Label for="accountName">Account Name</Label>
			<Input id="accountName" bind:value={accountName} placeholder="Enter account name" required />
		</div>
		<div class="space-y-2">
			<Label for="accountType">Account Type</Label>
			<Select.Root
				onSelectedChange={(v) => {
					v && (accountType = v.value);
				}}
				required
			>
				<Select.Trigger>
					<Select.Value placeholder="Select Type" />
				</Select.Trigger>
				<Select.Content>
					{#each accountTypes as type (type)}
						<Select.Item value={type}>{type}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="space-y-2">
			<Label for="institution">Institution</Label>
			<Input id="institution" bind:value={institution} placeholder="Enter institution" required />
		</div>
	</div>
	<div class="mt-10 w-full">
		{#if $mutation.isPending}
			<Button type="submit" class="w-full" disabled={true}><Spinner />Add Account</Button>
		{:else}
			<Button type="submit" class="w-full" disabled={!formValid}>Add Account</Button>
		{/if}
	</div>
</form>
