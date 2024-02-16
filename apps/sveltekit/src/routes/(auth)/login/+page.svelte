<script lang="ts">
	import { page } from '$app/stores';
	import LoginForm from '$lib/components/forms/LoginForm.svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import type { PageData } from './$types';

	export let data: PageData;

	// Get flash returned from register page when
	// new user is successfully registered
	const flash = getFlash(page);

	$: if ($flash) {
		toast.success($flash.message);

		// Clear flash
		$flash = undefined;
	}
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="width">
		<h1 class="mb-4 text-center text-3xl font-bold">Login</h1>
		<LoginForm data={data.form} />
		<p class="mt-4 text-center text-xs">
			Don't have an account? <a href="/register" class="underline">Sign up here</a>
		</p>
	</div>
</div>

<style scoped>
	.width {
		width: min(100%, 20rem);
	}
</style>
