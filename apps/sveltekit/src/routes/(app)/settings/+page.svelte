<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;

	let emailChanged = false;
	let email = data.user.email;

	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	$: disablePassword =
		!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword;
</script>

<div class="width self-start">
	<h1 class="border-muted mb-8 border-b pb-2 text-2xl font-bold">Account settings</h1>

	<section class="mb-10 grid gap-4">
		<h2 class="border-muted border-b text-lg font-bold">Credentials</h2>
		<div class="flex flex-col">
			<h3 class="font-semibold">Email</h3>
			<p class="text-muted-foreground mb-4 text-xs">Change your email address</p>
			<Input
				type="email"
				class="mb-4"
				bind:value={email}
				on:keydown={() => (emailChanged = true)}
			/>
			<Button variant="additive" disabled={!emailChanged} class="self-end px-8">Save</Button>
		</div>
		<div class="flex flex-col">
			<h3 class="font-semibold">Password</h3>
			<p class="text-muted-foreground mb-4 text-xs">Change your password</p>
			<label for="current" class="text-xs">Current password</label>
			<Input id="current" bind:value={currentPassword} type="password" class="mb-4" />
			<label for="new" class="text-xs">New password</label>
			<Input id="new" bind:value={newPassword} type="password" class="mb-4" />
			<label for="confirm" class="text-xs">Confirm new password</label>
			<Input id="confirm" bind:value={confirmPassword} type="password" class="mb-4" />
			<Button variant="additive" disabled={disablePassword} class="self-end px-8">Save</Button>
		</div>
	</section>

	<section class="grid gap-4">
		<h2 class="text-destructive border-muted border-b text-lg font-bold">Danger zone</h2>
		<div class="flex flex-col justify-between">
			<h3 class="font-semibold">Delete account</h3>
			<p class="text-muted-foreground mb-4 text-xs">This action cannot be undone!</p>
			<AlertDialog.Root>
				<AlertDialog.Trigger asChild let:builder>
					<Button builders={[builder]} variant="destructive">Delete account</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Are you sure you want to delete your account?</AlertDialog.Title>
						<AlertDialog.Description>
							All your data will be permanently deleted. This action cannot be undone!
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<form method="POST" action="?/deleteAccount" use:enhance>
							<AlertDialog.Action
								type="submit"
								class="border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground w-full border"
								>Delete anyways</AlertDialog.Action
							>
						</form>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</section>
</div>

<style>
	.width {
		width: min(100%, 500px);
	}
</style>
