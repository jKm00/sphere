<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
</script>

<header class="flex items-center justify-between">
	<a href="/" class="font-bold">Sphere</a>
	<a href="/login" class="text-sm">Login</a>
</header>
<div class="flex flex-grow items-center justify-center">
	<form class="width grid gap-4">
		<h1 class="mb-4 text-center text-3xl font-bold">Register</h1>
		<div>
			<Input type="email" placeholder="name@example.com" />
		</div>
		<div>
			<Input type="password" placeholder="**********" />
		</div>
		<Button class="grid grid-cols-3" type="submit">
			<Loader2 class="animate-spin" />
			Create account
		</Button>
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
