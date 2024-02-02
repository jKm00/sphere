<script lang="ts">
	import { session } from '$lib/session';
	import VerifyEmail from './VerifyEmail.svelte';
</script>

<main class="width m-auto p-4">
	{#if !$session?.user?.emailVerified}
		<VerifyEmail />
	{/if}
	<h1>Dashboard: {$session?.user?.email}</h1>
	<a href="/logout">Logout</a>
</main>

<style>
	.width {
		width: min(100%, 800px);
	}
</style>
