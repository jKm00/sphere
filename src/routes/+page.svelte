<script lang="ts">
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Mail } from 'lucide-svelte';
</script>

<div class="absolute right-4 top-4 flex items-center gap-4">
	<ThemeSwitch />
</div>

<main class="flex h-screen items-center justify-center">
	<div class="grid gap-8 text-center">
		<div>
			<h1 class="mb-2 text-6xl font-bold uppercase">Sphere</h1>
			<p class="text-sm">Keep track of all your subscriptions</p>
		</div>
		<div class="flex items-center justify-center gap-4">
			<span class="h-[1px] flex-grow rounded bg-primary"></span>
			<h2>Login</h2>
			<span class="h-[1px] flex-grow bg-primary"></span>
		</div>
		<div class="grid gap-2">
			<Button
				class="flex justify-between px-3 opacity-50"
				variant="outline"
				title="GitHub sign in: Not implemented"
			>
				<img src="/icons/github.png" alt="GitHub icon" class="h-8" />
				GitHub
				<img src="/icons/github.png" alt="GitHub icon" class="h-8 opacity-0" />
			</Button>
			<Button href="/login" class="flex justify-between" variant="outline">
				<Mail class="h-full" />
				Email
				<Mail class="h-[80%] opacity-0" />
			</Button>
		</div>
	</div>
</main>
