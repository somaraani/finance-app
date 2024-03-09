<script lang="ts">
	import {
		VisXYContainer,
		VisLine,
		VisTooltip,
		VisScatter,
		VisCrosshair,
		VisAxis
	} from '@unovis/svelte';
	import {
		lineColors,
		scatterPointColors,
		scatterPointStrokeColors,
		tooltipTemplate,
		crosshairPointColors,
		crosshairStrokeWidths,
		tickFormat
	} from './helpers.js';

	export let data: any[] = [];
	export let x: (d: any) => number;
	export let y: ((d: any) => number)[];
</script>

<VisXYContainer
	class="vis-xy-container"
	{data}
	height={200}
	margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
>
	<VisTooltip />
	<VisLine {x} {y} lineWidth={1} color={lineColors} />
	<VisScatter
		{x}
		{y}
		color={scatterPointColors}
		size={6}
		strokeColor={scatterPointStrokeColors}
		strokeWidth={crosshairStrokeWidths}
	/>
	<VisAxis type="x" {x} {tickFormat} gridLine={false} tickLine={undefined} domainLine={false} />
	<VisCrosshair template={tooltipTemplate} color={crosshairPointColors} />
</VisXYContainer>

<style>
	:global(.vis-xy-container) {
		--vis-tooltip-padding: '0px';
		--vis-tooltip-background-color: 'transparent';
		--vis-tooltip-border-color: 'transparent';
	}
</style>
