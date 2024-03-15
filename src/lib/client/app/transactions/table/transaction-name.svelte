<script lang="ts">
	export let data: {
		name: string;
		icon?: string | null;
	};
</script>

<div class="max-width flex items-center gap-3">
	<img alt={data.name + ' icon'} width="36px" src={data.icon} />
	{data.name}
</div>

<style>
	.max-width {
		max-width: 30vw;
	}
</style>
