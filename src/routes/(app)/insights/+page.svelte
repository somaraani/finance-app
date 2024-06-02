<script lang="ts">
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import AccountsCard from '$lib/client/app/accounts/accounts-card.svelte';
	import NetworthChart from '$lib/client/app/assets/networth-chart.svelte';
	import SpendingCategories from '$lib/client/app/spending/spending-categories.svelte';
	import SpendingChart from '$lib/client/app/spending/spending-chart.svelte';
	import AssetTimeline from '$lib/client/app/assets/asset-timeline.svelte';

	let items = [
		{ id: 'networth', component: NetworthChart },
		{ id: 'spending', component: SpendingChart },
		{ id: 'assets', component: AssetTimeline },
		{ id: 'categories', component: SpendingCategories },
		{ id: 'accounts', component: AccountsCard }
	];

	type Item = (typeof items)[number];

	let isEditing = false;

	function handleDndConsider(e: CustomEvent<DndEvent<Item>>) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<Item>>) {
		items = e.detail.items;
	}

	function deleteItem(id: string) {
		items = items.filter((item) => item.id !== id);
	}
</script>

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
	<button on:click={() => (isEditing = !isEditing)}>{isEditing ? 'Done' : 'Edit'}</button>
</div>

<div
	class="grid gap-4 md:grid-cols-1 lg:grid-cols-2"
	use:dndzone={{ items, dragDisabled: !isEditing }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as item (item.id)}
		<div>
			<svelte:component this={item.component} />
			{#if isEditing}
				<button class="delete-button" on:click={() => deleteItem(item.id)}>Delete</button>
			{/if}
		</div>
	{/each}
</div>
