<script lang="ts">
	import * as Card from '$lib/client/ui/card';
	import { RangeSelector } from '$lib/client/ui/range-selector';
	import { trpc } from '$lib/trpc/client';
	import { rangeText, type ChartData, type Ranges } from '$lib/types';
	import { VisBulletLegend, VisDonut, VisSingleContainer, VisTooltip } from '@unovis/svelte';

	type Item = typeof $req.data;

	let range: Ranges = 'month';
	let data: Item = [];

	$: req = trpc().spending.getCategories.createQuery({ range });

	$: data = $req.data ? $req.data : data;
	$: items = data?.map((d) => ({ name: d.label })) ?? [];
	$: totalAmount = data?.reduce((acc, cur) => acc + cur.value, 0);

	const value = (d: ChartData<number>) => d.value;
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>Categories</Card.Title>
		<RangeSelector bind:range loading={$req.isLoading} />
	</Card.Header>
	<Card.Content>
		<VisSingleContainer {data}>
			<VisDonut
				centralLabel={totalAmount?.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD'
				})}
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
