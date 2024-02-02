<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { auth } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { FirebaseError } from 'firebase/app';
	import { signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';
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
			await loginWithEmail(email, password);

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

	async function loginWithEmail(email: string, password: string) {
		try {
			const { user } = await signInWithEmailAndPassword(auth, email, password);

			session.set({
				loggedIn: true,
				user: {
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					uid: user.uid
				}
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				const errorCode = error.code;

				if (errorCode === 'auth/user-not-found') {
					throw new Error('The user does not exist.');
				} else if (errorCode === 'auth/wrong-password') {
					throw new Error('The password is invalid.');
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
	<a href="/register" class="text-sm">Register</a>
</header>
<div class="flex flex-grow items-center justify-center">
	<form on:submit|preventDefault={handleSubmit} class="width grid gap-2">
		<h1 class="mb-4 text-center text-3xl font-bold">Login</h1>
		<Input bind:value={email} class="w-full" type="email" placeholder="name@example.com" />
		<Input bind:value={password} type="password" placeholder="**********" />
		<Button class="grid grid-cols-3" type="submit">
			<Loader2 class={`animate-spin ${isLoading ? '' : 'opacity-0'}`} />
			Login
		</Button>
		{#if errorMsg}
			<p class="text-center text-sm text-destructive">{errorMsg}</p>
		{/if}
		<p class="mt-4 text-center text-xs">
			Don't have an account? <a href="/register" class="underline">Sign up here</a>
		</p>
	</form>
</div>

<style scoped>
	.width {
		width: min(100%, 20rem);
	}
</style>
