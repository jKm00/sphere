<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	import ThemeToggler from '$lib/components/ThemeToggler.svelte';
	import { session } from '$lib/session';
</script>

<Toaster />

<div class="absolute right-4 top-4 flex items-center gap-4">
	<ThemeToggler />
	{#if $session.user}
		<p>{$session.user.email}</p>
	{/if}
</div>

<slot />
