<script lang="ts">
	import * as Card from '$lib/client/ui/card';
	import type { ChartData, SpendingData } from '$lib/types';
	import { cn } from '$lib/client/ui/utils.js.js';

	import {
		crosshairPointColors,
		lineColors,
		spendingTooltipTemplate
	} from '$lib/client/ui/chart/helpers';
	import { VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/svelte';
	import { formatMoney } from '$lib/util';

	export let data: SpendingData | undefined;

	const date = new Date().getDate();
	const y = [(row: ChartData) => row.current, (row) => row.last];
	const x = (row) => row.index;

	console.log(data[date]);

	const delta = (data[date - 1].current - data[date - 1].last) / data[date - 1].last;
	const deltaPercent = delta.toLocaleString('en-US', {
		style: 'percent',
		maximumFractionDigits: 0
	});
	const deltaText = `${delta > 0 ? '+' : ''}${deltaPercent} ${delta > 0 ? 'more' : 'less'} than last month`;
	const current = data[date - 1].current;
</script>

<Card.Root>
	<Card.Header class="mb-2 flex flex-row items-center justify-between space-y-0 pb-4 pt-9">
		<Card.Title>Monthly Spending</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{formatMoney(current)}</div>
		<p class={cn('mb-4 mt-1 text-xs', delta < 0 ? 'text-green' : 'text-red')}>{deltaText}</p>

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
				tickLine={undefined}
				tickValues={[new Date().getDate() - 1]}
				tickFormat={(d) => 'today'}
				gridLine={true}
				domainLine={false}
			/>
			<VisAxis type="y" {y} gridLine={false} tickLine={undefined} domainLine={false} />
			<VisCrosshair template={spendingTooltipTemplate} color={crosshairPointColors} />
		</VisXYContainer>
	</Card.Content>
</Card.Root>

<style>
	:root {
		--vis-axis-grid-color: hsl(var(--muted-foreground));
	}
</style>
