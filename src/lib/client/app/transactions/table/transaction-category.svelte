<script lang="ts">
	import Badge from '$lib/client/ui/badge/badge.svelte';

	export let category: string;
	export let subcategory: string;
</script>

<div class="flex items-center gap-3">
	<Badge variant="secondary">{category}</Badge>
	<Badge variant="secondary">{subcategory}</Badge>
</div>
