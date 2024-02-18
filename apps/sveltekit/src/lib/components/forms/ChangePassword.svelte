<script lang="ts">
	import type { PasswordSchema } from '$lib/schemas/password';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionResult } from '@sveltejs/kit';

	export let form: SuperValidated<PasswordSchema>;

	const { errors, message, enhance } = superForm(form, {
		onResult: handleFormResult
	});

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	$: disabled =
		!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword;

	function handleFormResult({ result }: { result: ActionResult }) {
		if (result.type !== 'failure') {
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		}
	}
</script>

<form method="POST" action="?/changePassword" use:enhance class="flex flex-col">
	<h3 class="font-semibold">Password</h3>
	<p class="text-muted-foreground mb-4 text-xs">Change your password</p>
	<div class="mb-4">
		<label for="currnetPassword" class="text-xs">Current password</label>
		<Input
			bind:value={currentPassword}
			id="currentPassword"
			name="currentPassword"
			type="password"
			class={$errors.currentPassword && 'border-destructive'}
		/>
		{#if $errors.currentPassword}
			<p class="text-destructive text-xs">{$errors.currentPassword}</p>
		{/if}
	</div>
	<div class="mb-4">
		<label for="newPassword" class="text-xs">New password</label>
		<Input
			bind:value={newPassword}
			id="newPassword"
			name="newPassword"
			type="password"
			class={$errors.newPassword && 'border-destructive'}
		/>
		{#if $errors.newPassword}
			<p class="text-destructive text-xs">{$errors.newPassword}</p>
		{/if}
	</div>
	<div class="mb-4">
		<label for="confirmPassword" class="text-xs">Confirm password</label>
		<Input
			bind:value={confirmPassword}
			id="confirmPassword"
			name="confirmPassword"
			type="password"
			class={$errors.confirmPassword && 'border-destructive'}
		/>
		{#if $errors.confirmPassword}
			<p class="text-destructive text-xs">{$errors.confirmPassword}</p>
		{/if}
	</div>
	{#if $message}
		<p class="text-destructive text-sm">{$message}</p>
	{/if}
	<Button type="submit" variant="additive" {disabled} class="self-end px-8">Save</Button>
</form>
