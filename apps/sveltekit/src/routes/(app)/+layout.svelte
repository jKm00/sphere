<script lang="ts">
	import UserMenu from '$lib/components/UserMenu.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: ({ user } = data);
</script>

<header class="flex items-center justify-between p-4">
	<h1 class="text-xl font-bold uppercase"><a href="/dashboard">Sphere</a></h1>
	<UserMenu {user} />
</header>
<main class="width m-auto flex flex-grow flex-col p-4">
	<slot />
</main>

<style>
	.width {
		width: min(100%, 1200px);
	}
</style>
