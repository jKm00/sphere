<script lang="ts">
	import UserMenu from '$lib/components/UserMenu.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ user, currency } = data);
</script>

<header class="flex items-center justify-between p-4">
	<h1 class="text-xl font-bold uppercase"><a href="/dashboard">Sphere</a></h1>
	<UserMenu {user} {currency} />
</header>
<main class="width m-auto p-4">
	<slot />
</main>

<style>
	.width {
		max-width: 1200px;
	}
</style>
