<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { auth } from '$lib/firebase.client';
	import { authSchema } from '$lib/schemas';
	import { session } from '$lib/session';
	import { FirebaseError } from 'firebase/app';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { Loader2 } from 'lucide-svelte';

	let email = '';
	let password = '';

	let isLoading = false;
	let emailError = '';
	let passwordError = '';
	let errorMsg = '';

	async function handleSubmit() {
		isLoading = true;
		emailError = '';
		passwordError = '';
		errorMsg = '';

		const result = authSchema.safeParse({ email, password });

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				if (issue.path[0] === 'email') {
					emailError = issue.message;
				} else if (issue.path[0] === 'password') {
					passwordError = issue.message;
				}
			});
			isLoading = false;
			return;
		}

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
					uid: user.uid,
					emailVerified: user.emailVerified
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
	<form on:submit|preventDefault={handleSubmit} class="width grid gap-4">
		<h1 class="mb-4 text-center text-3xl font-bold">Login</h1>
		<div>
			<Input
				bind:value={email}
				class={emailError ? 'border-destructive' : ''}
				type="email"
				placeholder="name@example.com"
			/>
			{#if emailError}
				<p class="text-xs text-destructive">{emailError}</p>
			{/if}
		</div>
		<div>
			<Input
				bind:value={password}
				class={passwordError ? 'border-destructive' : ''}
				type="password"
				placeholder="**********"
			/>
			{#if passwordError}
				<p class="text-xs text-destructive">{passwordError}</p>
			{/if}
		</div>
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
