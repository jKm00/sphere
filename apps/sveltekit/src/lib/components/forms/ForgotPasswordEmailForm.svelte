<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { EmailSchema } from '$lib/schemas/email';
	import { superForm } from 'sveltekit-superforms/client';
	import { Loader2 } from 'lucide-svelte';

	export let form: SuperValidated<EmailSchema>;

	const { errors, delayed, message, enhance } = superForm(form);
</script>

<form method="POST" use:enhance>
	<h1 class="text-3xl font-bold">Forgot password</h1>
	<p class="text-muted-foreground mb-4 text-sm">
		Enter the email of the account you have forgotten the password for:
	</p>
	<div class="mb-4">
		<Input
			type="email"
			name="email"
			placeholder="example@email.com"
			class={$errors.email && 'border-destructive'}
		/>
		{#if $errors.email}
			<p class="text-destructive text-xs">{$errors.email}</p>
		{/if}
	</div>
	<Button type="submit" class="w-full">
		{#if $delayed}
			<Loader2 class="animate-spin" />
		{:else}
			Send email
		{/if}
	</Button>
	{#if $message}
		<p class="text-destructive mt-2 text-center text-xs">
			{$message}
		</p>
	{/if}
</form>
