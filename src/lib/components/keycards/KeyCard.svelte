<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let value: string;
	export let label: string;
	export let icon: new (...args: any[]) => SvelteComponent;
	export let color: string = 'foreground';
</script>

<div class="flex w-full items-center gap-4 rounded-lg border px-6 py-8 md:max-w-[300px]">
	<svelte:component this={icon} class="h-10 w-10 text-{color}" />
	<div>
		<p class="text-xl font-bold">{value}</p>
		<p class="text-sm text-muted-foreground">{label}</p>
	</div>
</div>

