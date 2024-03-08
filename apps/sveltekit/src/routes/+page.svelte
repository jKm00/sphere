<script lang="ts">
	import ThemeSwitch from '$lib/components/themes/ThemeSwitch.svelte';
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
			<span class="bg-primary h-[1px] flex-grow rounded"></span>
			<h2>Login</h2>
			<span class="bg-primary h-[1px] flex-grow"></span>
		</div>
		<div class="grid gap-2">
			<Button href="/login/google" class="flex justify-between px-3" variant="outline">
				<img src="/icons/google.png" alt="Google icon" class="h-8" />
				Google
				<img src="/icons/google.png" alt="Google icon" class="h-8 opacity-0" />
			</Button>
			<Button href="/login/github" class="flex justify-between px-3" variant="outline">
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
