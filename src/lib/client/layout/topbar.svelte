<script lang="ts">
	import * as DropdownMenu from '$lib/client/ui/dropdown-menu';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
	import UserIcon from 'lucide-svelte/icons/circle-user-round';
	import RefreshIcon from 'lucide-svelte/icons/refresh-cw';
	import SuccessIcon from 'lucide-svelte/icons/check';
	import ErrorIcon from 'lucide-svelte/icons/circle-alert';
	import { toggleMode } from 'mode-watcher';
	import Moon from 'svelte-radix/Moon.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Button from '../ui/button/button.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import type { User } from '$lib/types/users.types';
	import { trpc } from '$lib/trpc/client';
	import { invalidate } from '$app/navigation';
	import * as Select from '$lib/client/ui/select/index.js';
	import { currencies } from '$lib/types/currencies';
	import type { Selected } from 'bits-ui';

	export let user: User;

	let refreshState: 'idle' | 'loading' | 'success' | 'error' = 'idle';
	let selectedCurrency: Selected<string> = { value: user.currency, label: user.currency }; // Default currency

	async function refreshData() {
		refreshState = 'loading';
		const result = await trpc().createUtils().client.accounts.refresh.mutate();
		if (!result.failures) {
			trpc().createUtils().invalidate();
			invalidate('data:now');
			refreshState = 'success';
		} else {
			refreshState = 'error';
		}
	}

	async function handleCurrencyChange(currency: Selected<string> | undefined) {
		if (!currency) return;
		selectedCurrency = currency;
		// Save the selected currency to the user's preferences
		await trpc().createUtils().client.users.setUserCurrency.mutate({ currency: currency.value });
	}
</script>

<div class="flex h-16 w-full items-center px-4 py-3">
	<DollarSign class="text-primary" />
	<h1 class="text-lg font-semibold">finaance</h1>
	<Separator orientation="vertical" class="m-5" />

	<div class="space-x-4 lg:space-x-6">
		<a href="/" class="text-sm font-medium transition-colors hover:text-primary"> Insights </a>

		<a
			href="/transactions"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Transactions
		</a>
		<a
			href="/accounts"
			class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
		>
			Accounts
		</a>
	</div>

	<div class="ml-auto flex gap-2">
		<Button variant="outline" on:click={refreshData}>
			{#if refreshState === 'idle'}
				<RefreshIcon />
				Refresh data
			{:else if refreshState === 'loading'}
				<RefreshIcon class="animate-spin" />
				Refreshing...
			{:else if refreshState === 'success'}
				<SuccessIcon class="text-green-500" />
				Refreshed data
			{:else if refreshState === 'error'}
				<ErrorIcon class="text-red-500" />
				Error refreshing
			{/if}
		</Button>

		<Select.Root selected={selectedCurrency} onSelectedChange={handleCurrencyChange} required>
			<Select.Trigger>
				<Select.Value />
			</Select.Trigger>
			<Select.Content>
				{#each currencies as currency}
					<Select.Item value={currency.code}>{currency.code}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" builders={[builder]}>
					<UserIcon />
					{user.username}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>{`${user.firstname} ${user.lastname}`}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item href="/signout">Log out</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</div>
