<script lang="ts">
	import {
		crosshairPointColors,
		lineColors,
		spendingTooltipTemplate
	} from '$lib/client/ui/chart/helpers';
	import InsightCard from '$lib/client/ui/insights/insight-card.svelte';
	import { trpc } from '$lib/trpc/client';
	import type { ArrayType } from '$lib/types/util';
	import { VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/svelte';

	const req = trpc().spending.getTimeline.createQuery();
	type Row = ArrayType<(typeof $req)['data']>;

	const y = [(row: Row) => row.current, (row: Row) => row.last];
	const x = (row: Row) => row.index;

	let current: number, deltaText: string, deltaClass: string;

	$: if ($req.data) {
		const date = new Date().getDate();
		const last = $req.data[date - 1].last || 0;

		current = $req.data[date - 1].current || 0;

		const delta = (current - last) / last;
		const deltaPercent = delta.toLocaleString('en-US', {
			style: 'percent',
			maximumFractionDigits: 0
		});

		deltaText = `${delta > 0 ? '+' : ''}${deltaPercent} ${delta > 0 ? 'more' : 'less'} than last month`;
		deltaClass = delta < 0 ? 'text-green-500' : 'text-red-500';
	}
</script>

<InsightCard
	title={'Monthly Spending'}
	text={deltaText}
	textClass={deltaClass}
	{current}
	loading={$req.isLoading}
>
	{#if $req.data}
		<VisXYContainer
			class="vis-xy-container grow"
			data={$req.data}
			margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
		>
			<VisTooltip />
			<VisLine {x} {y} lineWidth={2} color={lineColors} />
			<VisAxis
				type="x"
				{x}
				tickLine={undefined}
				tickValues={[new Date().getDate() - 1]}
				tickFormat={() => 'today'}
				gridLine={true}
				domainLine={false}
			/>
			<VisAxis type="y" {y} gridLine={false} tickLine={undefined} domainLine={false} />
			<VisCrosshair {x} {y} template={spendingTooltipTemplate} color={crosshairPointColors} />
		</VisXYContainer>
	{/if}
</InsightCard>
