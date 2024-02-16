<script lang="ts">
	import { ChevronsDown, ChevronsUp, Coins, Hash, SignalHigh } from 'lucide-svelte';
	import KeyCard from './KeyCard.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { SingleSubscriptionDto } from '$lib/dtos/subscription';

	export let prefferedCurrency: string;
	export let prefferedPeriod: string;
	export let totalSum: number;
	export let numberOfSubs: number;
	export let mostExpensiveSub: SingleSubscriptionDto | undefined;

	let wrappers: HTMLDivElement[] = [];
	let maxHeight: number;
	let expanded = false;

	$: keyCards = [
		{
			icon: Coins,
			color: 'rgb(52 211 153)',
			value: `${totalSum} ${prefferedCurrency}`,
			label: `Total cost each ${prefferedPeriod}`
		},
		{
			icon: Hash,
			color: 'rgb(192 132 252)',
			value: numberOfSubs === 0 ? '-' : `${numberOfSubs}`,
			label: 'Number of subscriptions'
		},
		{
			icon: SignalHigh,
			color: 'rgb(251 146 60)',
			value: `${mostExpensiveSub?.company || '-'}`,
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
		{#each keyCards as card, index}
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
