<script lang="ts">
	import { type SignUpSchema } from '$lib/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	export let data: SuperValidated<SignUpSchema>;

	const { form, errors, enhance, delayed, message } = superForm(data);
</script>

<form method="POST" use:enhance class="grid gap-2">
	<label for="email">
		<span class="font-semibold">Email</span>
		<Input
			id="email"
			type="email"
			name="email"
			aria-invalid={$errors.email ? 'true' : undefined}
			placeholder="name@example.com"
			class={$errors.email ? 'border-destructive' : ''}
		/>
		{#if $errors.email}
			<p class="text-xs text-destructive">{$errors.email[0]}</p>
		{/if}
	</label>
	<label for="password">
		<span class="font-semibold">Password</span>
		<Input
			id="pasword"
			type="password"
			name="password"
			aria-invalid={$errors.password ? 'true' : undefined}
			placeholder="********"
			class={$errors.password ? 'border-destructive' : ''}
		/>
		{#if $errors.password}
			<p class="text-xs text-destructive">{$errors.password[0]}</p>
		{/if}
	</label>
	<label for="passwordConfirm">
		<span class="font-semibold">Confirm password</span>
		<Input
			id="passwordConfirm"
			type="password"
			name="passwordConfirm"
			aria-invalid={$errors.passwordConfirm ? 'true' : undefined}
			placeholder="********"
			class={$errors.passwordConfirm ? 'border-destructive' : ''}
		/>
		{#if $errors.passwordConfirm}
			<p class="text-xs text-destructive">{$errors.passwordConfirm[0]}</p>
		{/if}
	</label>
	<Button type="submit">Create account</Button>
	{#if $message}
		<p class="text-center text-xs text-destructive">{$message}</p>
	{/if}
</form>
