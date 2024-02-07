<script lang="ts">
	import RegisterForm from '$lib/components/forms/RegisterForm.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
</script>

<header class="flex items-center justify-between">
	<a href="/" class="font-bold">Sphere</a>
	<a href="/login" class="text-sm">Login</a>
</header>
<div class="flex flex-grow items-center justify-center">
	<div class="width">
		<RegisterForm data={data.form} />
		<p class="mt-4 text-center text-xs">
			Alread have an account? <a href="/login" class="underline">Login here</a>
		</p>
	</div>
</div>

<style scoped>
	.width {
		width: min(100%, 20rem);
	}
</style>
