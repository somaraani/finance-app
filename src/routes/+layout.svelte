<script>
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<Toaster />
<ModeWatcher />
<slot />
