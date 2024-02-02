<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { auth } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { FirebaseError } from 'firebase/app';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { Loader2 } from 'lucide-svelte';

	let email = '';
	let password = '';

	let isLoading = false;
	let errorMsg = '';

	async function handleSubmit() {
		isLoading = true;
		errorMsg = '';

		// TODO: Validate

		try {
			await registerWithEmail(email, password);
			goto('/dashboard');
		} catch (error) {
			if (error instanceof Error) {
				errorMsg = error.message;
			} else {
				errorMsg = 'Something went wrong. Please try again';
			}
		} finally {
			isLoading = false;
		}
	}

	async function registerWithEmail(email: string, password: string) {
		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);
			session.update((cur: any) => {
				return {
					...cur,
					user,
					loggedIn: true,
					loading: false
				};
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				const errorCode = error.code;

				if (errorCode === 'auth/weak-password') {
					throw new Error('The password is too weak.');
				} else if (errorCode === 'auth/email-already-in-use') {
					throw new Error('The email is already in use.');
				} else if (errorCode === 'auth/invalid-email') {
					throw new Error('The email is invalid.');
				} else {
					throw new Error('Something went wrong. Please try again');
				}
			} else {
				throw new Error('Something went wrong. Please try again');
			}
		}
	}
</script>

<header class="flex items-center justify-between">
	<a href="/" class="font-bold">Sphere</a>
	<a href="/login" class="text-sm">Login</a>
</header>
<div class="flex flex-grow items-center justify-center">
	<form on:submit|preventDefault={handleSubmit} class="width grid gap-2">
		<h1 class="mb-4 text-center text-3xl font-bold">Register</h1>
		<Input bind:value={email} class="w-full" type="email" placeholder="name@example.com" />
		<Input bind:value={password} type="password" placeholder="**********" />
		<Button class="grid grid-cols-3" type="submit">
			<Loader2 class={`animate-spin ${isLoading ? '' : 'opacity-0'}`} />
			Create account
		</Button>
		{#if errorMsg}
			<p class="text-center text-sm text-destructive">{errorMsg}</p>
		{/if}
		<p class="mt-4 text-center text-xs">
			Alread have an account? <a href="/login" class="underline">Login here</a>
		</p>
	</form>
</div>

<style scoped>
	.width {
		width: min(100%, 20rem);
	}
</style>
