<script lang="ts">
	import { periods } from '$lib/period';
	import * as Select from '$lib/components/ui/select';
	import { enhance } from '$app/forms';

	export let period: string;

	let form: HTMLFormElement;
	let hiddenInput: HTMLInputElement;

	$: selected = periods.find((p) => p.value === period) || undefined;

	function handleClick(period: { value: string; label: string }) {
		hiddenInput.value = period.value;
		form.requestSubmit();
	}
</script>

<div class="flex items-center justify-between px-4">
	<p>Period</p>
	<Select.Root portal={null} bind:selected>
		<Select.Trigger class="w-40">
			<Select.Value placeholder="Select period" class="text-foreground" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Period</Select.Label>
				<form bind:this={form} method="POST" action="/dashboard/?/updatePeriod" use:enhance>
					<input bind:this={hiddenInput} type="hidden" name="period" />
					{#each periods as period}
						<Select.Item
							value={period.value}
							label={period.label}
							on:click={() => handleClick(period)}
						>
							{period.label}
						</Select.Item>
					{/each}
				</form>
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
