<script lang="ts">
	import type { LoginSchema } from '$lib/schemas/login';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Loader2 } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data: SuperValidated<LoginSchema>;

	const { errors, enhance, delayed, message } = superForm(data);

	$: redirect = $page.url.searchParams.get('redirect') || '/';
</script>

<form method="POST" action="?redirect={redirect}" use:enhance class="grid gap-2">
	<label for="email">
		<span class="text-xs">Email</span>
		<Input
			id="email"
			type="email"
			name="email"
			aria-invalid={$errors.email ? 'true' : undefined}
			placeholder="name@example.com"
			class={$errors.email ? 'border-destructive' : ''}
		/>
		{#if $errors.email}
			<p class="text-xs text-destructive">{$errors.email}</p>
		{/if}
	</label>
	<label for="password">
		<span class="text-xs">Password</span>
		<Input
			id="password"
			type="password"
			name="password"
			aria-invalid={$errors.password ? 'true' : undefined}
			placeholder="********"
			class={$errors.password ? 'border-destructive' : ''}
		/>
		{#if $errors.password}
			<p class="text-xs text-destructive">{$errors.password}</p>
		{/if}
	</label>
	<Button type="submit">
		{#if $delayed}
			<Loader2 class="animate-spin" />
		{:else}
			Login
		{/if}
	</Button>
	{#if $message}
		<p class="text-center text-xs {$page.status === 200 ? 'text-green-400' : 'text-destructive'}">
			{$message}
		</p>
	{/if}
</form>
