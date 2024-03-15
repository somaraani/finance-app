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
	import { rangeText, type Ranges } from '$lib/types';
	import type { ArrayType } from '$lib/types/util';
	import { formatMoney } from '$lib/util';
	import { VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/svelte';

	type NetworthData = (typeof $req)['data'];
	type Row = ArrayType<NetworthData>;

	let range: Ranges = 'month';
	let data: NetworthData = [];

	$: req = trpc().networth.getData.createQuery({ range });
	$: data = $req.data || data;

	$: current = data?.length ? data[data.length - 1].value : 0;
	$: delta = data?.length ? data[data.length - 1].value - data[0].value : 0;
	$: deltaText = `${delta > 0 ? '+' : '-'}${formatMoney(delta)} since ${rangeText[range]}`;
	$: deltaClass = delta > 0 ? 'text-green-500' : 'text-red-500';

	const y = [(row: Row) => row.value];
	const x = (row: Row) => new Date(row.date).getTime();
</script>

<InsightCard
	title={'Networth'}
	text={deltaText}
	textClass={deltaClass}
	{current}
	loading={$req.isLoading}
>
	<RangeSelector slot="filters" bind:range loading={$req.isLoading} />
	<VisXYContainer
		class="vis-xy-container"
		{data}
		height={200}
		margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
	>
		<VisTooltip />
		<VisLine {x} {y} lineWidth={2} color={lineColors} />
		<VisAxis
			type="x"
			{x}
			tickFormat={dailyTickFormat}
			gridLine={false}
			tickLine={undefined}
			domainLine={false}
		/>
		<VisAxis type="y" {y} gridLine={false} tickLine={undefined} domainLine={false} />
		<VisCrosshair template={tooltipTemplate} color={crosshairPointColors} />
	</VisXYContainer>
</InsightCard>
