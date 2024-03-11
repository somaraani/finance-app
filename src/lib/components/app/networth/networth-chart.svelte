<script lang="ts">
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';
	import type { NetworthData, NetworthEntry } from '$lib/types';

	export let data: NetworthData;

	const x = (row: NetworthEntry) => row.date.getTime();
	const y = [(row: NetworthEntry) => row.value];
</script>

{#if data.history}
	<ChartCard
		data={data.history}
		title="Networth"
		value={data.current}
		delta={data.monthDelta}
		{x}
		{y}
	/>
{/if}
