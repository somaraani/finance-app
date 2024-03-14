<script lang="ts">
	import { browser } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';
	import { RangeSelector } from '$lib/components/ui/range-selector';
	import {
		rangeText,
		type Ranges,
		type SpendingCategories,
		type SpendingData,
		type ChartData
	} from '$lib/types';
	import { VisSingleContainer, VisDonut, VisTooltip, VisBulletLegend } from '@unovis/svelte';
	import { onMount } from 'svelte';

	let range: Ranges = 'month';
	let loading = false;

	let data: SpendingCategories | undefined;
	let items: { name: string }[] = [];
	let error: string | undefined;
	let totalAmount: number | undefined;

	const value = (d: ChartData) => d.value;

	$: if (browser) getData(range);
	onMount(() => getData(range));

	const getData = async (range: Ranges) => {
		loading = true;
		const result = await fetch('/api/categories?range=' + range);
		const response = await result.json();
		if (response && result.status === 200) {
			data = response as SpendingCategories;
			items = data.map((d) => ({ name: d.label }));
			totalAmount = data.reduce((acc, cur) => acc + cur.value, 0);
		} else {
			error = 'Failed to load data';
		}
		loading = false;
	};
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>Categories</Card.Title>
		<RangeSelector bind:range {loading} />
	</Card.Header>
	<Card.Content class="donut">
		<VisSingleContainer class="donut" {data}>
			<VisDonut
				centralLabel={totalAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
				centralSubLabel={rangeText[range]}
				arcWidth={30}
				showBackground={false}
				padAngle={0.03}
				cornerRadius={5}
				{value}
			/>
			<VisTooltip />
		</VisSingleContainer>
		<div class="mt-5 flex justify-center">
			<VisBulletLegend {items} />
		</div>
	</Card.Content>
</Card.Root>

<!-- TODO: where is the best place to put this? -->
<style>
	:root {
		--vis-donut-central-label-text-color: hsl(var(--foreground));
		--vis-donut-central-sub-label-text-color: hsl(var(--muted-foreground));
		--vis-donut-central-label-font-size: 24px;
		--vis-donut-central-label-font-weight: 700;
		--vis-donut-central-sub-label-font-size: 1em;
		--vis-font-family: inherit;
	}
</style>
