<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	import ThemeToggler from '$lib/components/ThemeToggler.svelte';
</script>

<Toaster />

<div class="absolute right-4 top-4 flex items-center gap-4">
	<ThemeToggler />
</div>

<slot />
