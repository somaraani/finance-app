<script>
	import { Toaster } from '$lib/client/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
</script>

<Toaster />
<ModeWatcher />
<slot />
