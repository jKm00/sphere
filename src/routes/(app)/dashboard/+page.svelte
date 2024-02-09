<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	// Display flash message returned when logged in
	const flash = getFlash(page);
	$: if ($flash) {
		toast($flash.message);

		$flash = undefined;
	}
</script>

<main class="width m-auto p-4">
	<h1>Dashboard</h1>
</main>

<style>
	.width {
		width: min(100%, 800px);
	}
</style>
