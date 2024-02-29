<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type { ResetPasswordSchema } from '$lib/schemas/password';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { Button } from '$lib/components/ui/button';
	import { Loader2 } from 'lucide-svelte';

	export let form: SuperValidated<ResetPasswordSchema>;

	const { errors, delayed, message, enhance } = superForm(form);
</script>

<form method="POST" use:enhance class="width">
	<h1 class="text-3xl font-bold">Reset password</h1>
	<p class="text-muted-foreground mb-4 text-sm">Enter a new password to reset it:</p>
	<div class="mb-4">
		<label for="newPassword" class="text-xs">New password</label>
		<Input
			type="password"
			name="newPassword"
			placeholder="********"
			class={$errors.newPassword && 'border-destructive'}
		/>
		{#if $errors.newPassword}
			<p class="text-destructive text-xs">{$errors.newPassword}</p>
		{/if}
	</div>
	<div class="mb-4">
		<label for="confirmPassword" class="text-xs">Confirm password</label>
		<Input
			type="password"
			name="confirmPassword"
			placeholder="********"
			class={$errors.confirmPassword && 'border-destructive'}
		/>
		{#if $errors.confirmPassword}
			<p class="text-destructive text-xs">{$errors.confirmPassword}</p>
		{/if}
	</div>
	<Button type="submit" class="w-full">
		{#if $delayed}
			<Loader2 class="animate-spin" />
		{:else}
			Reset password
		{/if}
	</Button>
	{#if $message}
		<p class="text-destructive mt-2 text-center text-xs">
			{$message}
		</p>
	{/if}
</form>

<style>
	.width {
		width: min(100%, 400px);
	}
</style>
