<script lang="ts">
	import {
		crosshairPointColors,
		dailyTickFormat,
		lineColors,
		tooltipTemplate
	} from '$lib/client/ui/chart/helpers';
	import InsightCard from '$lib/client/ui/insights/insight-card.svelte';
	import RangeSelector from '$lib/client/ui/range-selector/range-selector.svelte';
	import { trpc } from '$lib/trpc/client';
	import { rangeText, type Ranges, type AccountHistory } from '$lib/types';
	import type { ArrayType } from '$lib/types/util';
	import { formatMoney } from '$lib/util';
	import {
		VisAxis,
		VisCrosshair,
		VisBulletLegend,
		VisArea,
		VisTooltip,
		VisXYContainer
	} from '@unovis/svelte';

	type NetworthData = (typeof $req)['data'];
	type Row = ArrayType<AccountHistory['history']>;

	let range: Ranges = 'month';
	let data: AccountHistory['history'] = [];

	$: req = trpc().assets.getTimeline.createQuery({ range });
	$: data = $req.data?.history || data;

	$: items =
		$req?.data?.accounts?.map((a, i) => ({
			name: a.name,
			inactive: false,
			color: lineColors(undefined, i)
		})) ?? [];

	$: y = items
		? items?.map((item, i) => (row: Row) => {
				return item.inactive ? undefined : row.value[i];
			})
		: [];

	function toggleItem(item: BulletLegendItemInterface, i: number): void {
		items[i].inactive = !items[i].inactive;
		y = items.map((item, i) => (item.inactive ? 0 : y[i]));
	}

	const x = (row: Row) => new Date(row.date).getTime();
</script>

<InsightCard title={'Asset Breakdown'} loading={$req.isLoading}>
	<RangeSelector slot="filters" bind:range loading={$req.isLoading} />
	<VisXYContainer
		height={300}
		class="vis-xy-container mt-8"
		{data}
		margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
	>
		<VisTooltip />
		<VisArea {x} {y} lineWidth={2} color={lineColors} />
		<VisAxis
			type="x"
			{x}
			tickFormat={dailyTickFormat}
			gridLine={false}
			tickLine={undefined}
			domainLine={false}
		/>
		<VisAxis
			type="y"
			gridLine={true}
			y={() => 0}
			tickValues={[0]}
			tickLine={undefined}
			domainLine={false}
		/>
		<VisCrosshair template={tooltipTemplate} color={crosshairPointColors} />
	</VisXYContainer>
	<div class="mt-8 flex justify-center">
		<VisBulletLegend bulletSize="20px" {items} onLegendItemClick={toggleItem} />
	</div>
</InsightCard>
