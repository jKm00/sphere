<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import { currencies } from '$lib/currency';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let currency: string;

	let form: HTMLFormElement;
	let hiddenInput: HTMLInputElement;

	$: selected = currencies.find((c) => c.value === currency) || undefined;

	function handleClick(currency: { value: string; label: string; symbol: string }) {
		hiddenInput.value = currency.value;
		form.requestSubmit();
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
				<form bind:this={form} method="POST" action="/dashboard/?/updateCurrency" use:enhance>
					<input bind:this={hiddenInput} type="hidden" name="currency" />
					{#each currencies as currency}
						<Select.Item
							value={currency.value}
							label={currency.label}
							on:click={() => handleClick(currency)}
						>
							<!-- <button type="submit" class="bg-red-400"> -->
							{currency.label}
							<!-- </button> -->
						</Select.Item>
					{/each}
				</form>
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
