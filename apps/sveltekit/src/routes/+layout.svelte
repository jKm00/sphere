<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<Toaster position="top-center" closeButton richColors />

<div class="flex min-h-screen flex-col">
	<slot />
</div>
