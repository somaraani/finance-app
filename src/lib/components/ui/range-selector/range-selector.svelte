<script lang="ts">
	import { type Ranges, ranges } from '$lib/types';
	import { Button } from '../button';
	import * as DropdownMenu from '../dropdown-menu';
	import Spinner from '../spinner/spinner.svelte';

	export let range: Ranges = 'month';
	export let loading: boolean = false;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button disabled={loading} variant="outline" builders={[builder]}>
			{#if loading}
				<Spinner />
			{/if}
			{ranges[range]}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>Date Range</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup bind:value={range}>
			{#each Object.entries(ranges) as [key, value] (key)}
				<DropdownMenu.RadioItem value={key}>{value}</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
