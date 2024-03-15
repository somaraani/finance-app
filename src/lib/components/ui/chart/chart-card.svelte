<script lang="ts">
	import type { ChartData } from '$lib/types';
	import { cn } from '$lib/utils.js';
	import * as Card from '../card';
	import { RangeSelector } from '../range-selector';
	import { default as Chart } from './chart.svelte';

	export let data: any[];
	export let y: ((d: any) => any)[];
	export let title: string;
	export let rangeSelector = true;

	export let x = (d: ChartData) => d.date.getTime();

	$: current = data.length ? data[data.length - 1].value : 0;
	$: formattedValue = current.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	$: delta = data.length ? (data[data.length - 1].value - data[0].value) / data[0].value : 0;
	$: deltaText = `${delta > 0 ? '+' : ''}${delta.toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 0 })} in the last month`;
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>{title}</Card.Title>
		{#if rangeSelector}
			<RangeSelector />
		{/if}
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{formattedValue}</div>
		<p class={cn('mb-4 mt-1 text-xs', delta > 0 ? 'text-green' : 'text-red')}>{deltaText}</p>
		<Chart {data} {x} {y} />
	</Card.Content>
</Card.Root>
