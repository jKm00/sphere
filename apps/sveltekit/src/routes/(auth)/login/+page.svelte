<script lang="ts">
	import LoginForm from '$lib/components/forms/LoginForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="width">
		<h1 class="mb-4 text-center text-3xl font-bold">Login</h1>
		<LoginForm data={data.form} />
		<p class="mb-2 mt-4 text-center text-xs">
			Don't have an account? <a href="/register" class="underline">Sign up here</a>
		</p>
		<a href="/forgot-password" class="block text-center text-xs underline">Forgot password</a>
	</div>
</div>

<style scoped>
	.width {
		width: min(100%, 20rem);
	}
</style>
