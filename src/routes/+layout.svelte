<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	import ThemeToggler from '$lib/components/ThemeToggler.svelte';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<Toaster position="top-right" closeButton richColors />

<slot />
