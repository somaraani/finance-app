<script lang="ts">
	import ChartCard from '$lib/components/ui/chart/chart-card.svelte';
	import type { ChartData, NetworthData } from '$lib/types';

	export let data: NetworthData | undefined;
	const y = [(row: ChartData) => row.value];
</script>

{#if data?.history}
	<ChartCard data={data.history} title="Networth" {y} />
{/if}
