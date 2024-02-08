<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';

	// Get flash returned from register page when
	// new user is successfully registered
	const flash = getFlash(page);

	$: if ($flash) {
		toast.success($flash.message);
	}
</script>

<div class="flex flex-grow items-center justify-center">
	<form class="width grid gap-4">
		<h1 class="mb-4 text-center text-3xl font-bold">Login</h1>
		<div>
			<Input type="email" placeholder="name@example.com" />
		</div>
		<div>
			<Input type="password" placeholder="**********" />
		</div>
		<Button class="grid grid-cols-3" type="submit">
			<Loader2 class="animate-spin" />
			Login
		</Button>
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
