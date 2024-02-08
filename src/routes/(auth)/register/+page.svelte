<script lang="ts">
	import RegisterForm from '$lib/components/forms/RegisterForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="width">
		<h1 class="mb-4 text-center text-3xl font-bold">Register</h1>
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
