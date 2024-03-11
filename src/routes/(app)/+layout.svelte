<script>
	import { Topbar } from '$lib/components/layout';

	export let data;
</script>

<div class="hidden flex-col md:flex">
	<div class="border-b">
		<Topbar user={data.user} />
	</div>
	<div class="flex-1 space-y-4 p-8 pt-6">
		<slot />
	</div>
</div>
