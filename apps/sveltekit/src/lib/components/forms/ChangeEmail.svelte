<script lang="ts">
	import type { EmailSchema } from '$lib/schemas/email';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms/client';

	export let form: SuperValidated<EmailSchema>;
	export let email: string = '';

	const { enhance } = superForm(form);

	let emailChanged = false;
</script>

<form method="POST" action="?/updateEmail" use:enhance class="flex flex-col">
	<h3 class="font-bold">Email</h3>
	<p class="text-muted-foreground mb-4 text-xs">Change your email address</p>
	<Input
		type="email"
		name="email"
		class="mb-4"
		bind:value={email}
		on:keydown={() => (emailChanged = true)}
	/>
	<Button type="submit" variant="additive" disabled={!emailChanged} class="self-end px-8"
		>Save</Button
	>
</form>
