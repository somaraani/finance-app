<script>
	import { Topbar } from '$lib/components/layout';

	export let data;
</script>

<div class="hidden h-screen flex-col md:flex">
	<div class="border-b">
		<Topbar user={data.user} />
	</div>
	<div class="flex-1">
		<slot />
	</div>
</div>
