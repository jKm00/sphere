<script lang="ts">
	import { ChevronsDown, ChevronsUp, Coins, Hash, SignalHigh } from 'lucide-svelte';
	import KeyCard from './KeyCard.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let wrappers: HTMLDivElement[] = [];
	let maxHeight: number;
	let expanded = false;

	const KEY_CARDS = [
		{
			icon: Coins,
			color: 'emerald-400',
			value: '1190 NOK',
			label: 'Total cost each month'
		},
		{
			icon: Hash,
			color: 'purple-400',
			value: '1',
			label: 'Number of subscriptions'
		},
		{
			icon: SignalHigh,
			color: 'orange-400',
			value: 'Disney+',
			label: 'Most expensive subscription'
		}
	];

	onMount(() => {
		calculateMaxHeight();
	});

	/**
	 * Calculate the maximum height of the KeyCardSection
	 */
	function calculateMaxHeight() {
		let height = 0;
		wrappers.forEach((wrapper) => {
			if (wrapper.offsetHeight > height) {
				height = wrapper.offsetHeight;
			}
		});
		maxHeight = height;
		expanded = false;
	}

	/**
	 * Expands the KeyCardSection (mobile only)
	 */
	function expand() {
		if (!expanded) {
			const GAP = 16;
			let height = GAP * (wrappers.length - 1);
			wrappers.forEach((wrapper) => {
				height += wrapper.offsetHeight;
			});
			maxHeight = height;
			expanded = true;
		} else {
			calculateMaxHeight();
		}
	}
</script>

<svelte:window on:resize={calculateMaxHeight} />

<div class="mb-8">
	<div class="flex flex-col gap-4 overflow-hidden md:flex-row" style="height: {maxHeight}px">
		{#each KEY_CARDS as card, index}
			<div bind:this={wrappers[index]}>
				<KeyCard {...card} />
			</div>
		{/each}
	</div>
	<Button
		on:click={expand}
		class="mt-2 flex w-full gap-2 text-sm font-normal text-muted-foreground md:hidden"
		variant="ghost"
	>
		{#if expanded}
			<ChevronsUp class="h-4 w-4" />
			Show less
			<ChevronsUp class="h-4 w-4" />
		{:else}
			<ChevronsDown class="h-4 w-4" />
			Show more
			<ChevronsDown class="h-4 w-4" />
		{/if}
	</Button>
</div>

<style>
</style>
