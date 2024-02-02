<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Mail } from 'lucide-svelte';
</script>

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
			<Button class="flex justify-between" variant="outline">
				<img src="/icons/google.png" alt="Google icon" class="h-full" />
				Google
				<img src="/icons/google.png" alt="Google icon" class="h-full opacity-0" />
			</Button>
			<Button href="/login" class="flex justify-between" variant="outline">
				<Mail class="h-[80%]" />
				Email
				<Mail class="h-[80%] opacity-0" />
			</Button>
		</div>
	</div>
</main>
