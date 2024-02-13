<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import { currencies } from '$lib/currency';
	import { page } from '$app/stores';

	export let currency: string;

	$: selected = currencies.find((c) => c.value === currency) || undefined;

	function handleClick(value: string) {
		if (browser) {
			document.cookie = `currency=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;

			goto(`${$page.url.pathname}${$page.url.search}`, {
				invalidateAll: true
			});
		}
	}
</script>

<div class="flex items-center justify-between px-4">
	<p>Currency</p>
	<Select.Root portal={null} bind:selected>
		<Select.Trigger class="w-40">
			<Select.Value placeholder="Select currency" class="text-foreground" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Currency</Select.Label>
				{#each currencies as currency}
					<Select.Item
						on:click={() => handleClick(currency.value)}
						value={currency.value}
						label={currency.label}
					>
						{currency.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
