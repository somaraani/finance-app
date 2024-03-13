<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Card from '../card';
	import { default as Chart } from './chart.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ChartData } from '$lib/types';

	export let data: ChartData[];
	export let y: ((d: any) => any)[];
	export let title: string;

	const ranges = {
		month: '1 Month',
		halfYear: '6 Months',
		year: '1 Year',
		all: 'All time'
	};

	let range: keyof typeof ranges = 'month';

	$: current = data.length ? data[data.length - 1].value : 0;
	$: formattedValue = current.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	$: delta = data.length ? (data[data.length - 1].value - data[0].value) / data[0].value : 0;
	$: deltaText = `${delta > 0 ? '+' : ''}${delta.toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 0 })} in the last month`;

	const x = (d: ChartData) => d.date.getTime();
</script>

<Card.Root class="pb-6">
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>{title}</Card.Title>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" builders={[builder]}>{ranges[range]}</Button>
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
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{formattedValue}</div>
		<p class={cn('mt-1 text-xs', delta > 0 ? 'text-green' : 'text-red')}>{deltaText}</p>
	</Card.Content>
	<Chart {data} {x} {y} />
</Card.Root>
