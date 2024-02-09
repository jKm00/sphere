<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	// Display flash message returned when logged in
	const flash = getFlash(page);
	$: if ($flash) {
		if ($flash.type === 'success') {
			toast($flash.message);
		} else {
			toast.error($flash.message);
		}

		$flash = undefined;
	}
</script>

<main class="width m-auto p-4">
	<h1>Dashboard</h1>
	<Button href="/logout">Log out</Button>
</main>

<style>
	.width {
		width: min(100%, 800px);
	}
</style>
