<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { VerifyEmail } from '$lib/schemas/email';
	import { superForm } from 'sveltekit-superforms/client';
	import { Loader2 } from 'lucide-svelte';

	export let form: SuperValidated<VerifyEmail>;

	const { errors, delayed, message, enhance } = superForm(form);

	$: redirect = $page.url.searchParams.get('redirectTo') || '/';
</script>

<form method="POST" action="?/verifyCode&redirectTo={redirect}" use:enhance>
	<h1 class="text-center text-3xl font-bold">Please verify your email</h1>
	<p class="text-muted-foreground mb-4 text-center text-sm">
		A code has been sent to your email. Please enter it below:
	</p>
	<div class="mb-4">
		<Input
			type="number"
			name="code"
			placeholder="Enter code"
			class={$errors.code && 'border-destructive'}
		/>
		{#if $errors.code}
			<p class="text-destructive text-xs">{$errors.code}</p>
		{/if}
	</div>
	<Button type="submit" class="w-full">
		{#if $delayed}
			<Loader2 class="animate-spin" />
		{:else}
			Verify
		{/if}
	</Button>
	{#if $message}
		<p class="text-destructive mt-2 text-center text-xs">{$message}</p>
	{/if}
</form>
