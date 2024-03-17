<script lang="ts">
	import SpendingCategories from '$lib/client/app/spending/spending-categories.svelte';
	import SpendingChart from '$lib/client/app/spending/spending-chart.svelte';
</script>

<div class="flex flex-col gap-10">
	<SpendingChart />
	<SpendingCategories />
</div>
