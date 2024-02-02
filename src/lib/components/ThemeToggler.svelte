<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { setMode, userPrefersMode } from 'mode-watcher';
	import { Moon, Sun, SunMoon } from 'lucide-svelte';
</script>

<div class="flex">
	<Button
		on:click={() => setMode('light')}
		class={`rounded-e-none ${$userPrefersMode === 'light' ? 'bg-muted' : ''}`}
		variant="outline"
		aria-label="light theme"
	>
		<Sun class="w-4" />
	</Button>
	<Button
		on:click={() => setMode('dark')}
		class={`rounded-none  ${$userPrefersMode === 'dark' ? 'bg-muted' : ''}`}
		variant="outline"
		aria-label="dark theme"
	>
		<Moon class="w-4" />
	</Button>
	<Button
		on:click={() => setMode('system')}
		class={`rounded-s-none  ${$userPrefersMode === 'system' ? 'bg-muted' : ''}`}
		variant="outline"
		aria-label="system preference"
	>
		<SunMoon class="w-4" />
	</Button>
</div>
