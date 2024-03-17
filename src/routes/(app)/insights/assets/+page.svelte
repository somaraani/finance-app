<script lang="ts">
	import AssetTimeline from '$lib/client/app/assets/asset-timeline.svelte';
	import NetworthChart from '$lib/client/app/assets/networth-chart.svelte';
</script>

<div class="flex flex-col gap-10">
	<NetworthChart />
	<AssetTimeline />
</div>
