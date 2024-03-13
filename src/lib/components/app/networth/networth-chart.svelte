<script lang="ts">
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';
	import type { NetworthData, NetworthEntry } from '$lib/types';

	export let data: NetworthData;

	const x = (row: number[]) => row[0];
	const y = [(row: number[]) => row[1]];
</script>

{#if data.history}
	<ChartCard
		data={[...data.history.entries()]}
		title="Networth"
		value={data.current}
		delta={data.delta}
		{x}
		{y}
	/>
{/if}
