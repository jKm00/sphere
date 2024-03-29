<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SubscriptionSchema } from '$lib/schemas/subscription';
	import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import { Loader2 } from 'lucide-svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import type { SingleSubscriptionDto } from '$lib/dtos/subscription';
	import { currencies } from '$lib/currency';
	import { periods } from '$lib/period';
	import type { Selected } from 'bits-ui';

	export let subscriptionForm: SuperValidated<SubscriptionSchema>;
	export let mode: 'add' | 'edit' = 'add';
	export let open = false;

	export let editingSubscription: SingleSubscriptionDto | null = null;

	$: company = editingSubscription?.company ?? '';
	$: description = editingSubscription?.description ?? '';
	$: amount = editingSubscription?.amount ?? '';
	$: url = editingSubscription?.url ?? '';

	let selectedCurrency: Selected<string> | undefined;
	let selectedPeriod: Selected<string> | undefined;
	let selectedType: Selected<string> | undefined;

	$: if (open && editingSubscription) {
		const foundCurrency = currencies.find((c) => c.value === editingSubscription!.currency);
		selectedCurrency = { value: foundCurrency?.value ?? '', label: foundCurrency?.label ?? '' };

		const foundPeriod = periods.find((p) => p.value === editingSubscription!.period);
		selectedPeriod = { value: foundPeriod?.value ?? '', label: foundPeriod?.label ?? '' };

		const foundType = types.find((t) => t.value === editingSubscription!.type);
		selectedType = { value: foundType?.value ?? '', label: foundType?.label ?? '' };
	}

	const { errors, enhance, delayed, message } = superForm(subscriptionForm, {
		onResult: handleFormResult
	});

	const types = [
		{ value: 'streaming', label: 'Streaming' },
		{ value: 'music', label: 'Music' },
		{ value: 'gaming', label: 'Gaming' },
		{ value: 'hosting', label: 'Hosting' },
		{ value: 'storage', label: 'Storage' },
		{ value: 'other', label: 'Other' }
	];

	function handleFormResult({ result }: { result: ActionResult }) {
		if (result.type !== 'failure') {
			close();
		}
	}

	function close() {
		editingSubscription = null;
		open = false;
		selectedCurrency = undefined;
		selectedPeriod = undefined;
		selectedType = undefined;
		mode = 'add';
	}
</script>

<Sheet.Root bind:open onOpenChange={close}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]}>Add new</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="flex flex-col">
		<Sheet.Header>
			<Sheet.Title>{mode === 'add' ? 'Add new' : 'Edit'} subscription</Sheet.Title>
			<Sheet.Description
				>Fill in the form to save {mode === 'add' ? 'a new' : 'save the'} subscription</Sheet.Description
			>
		</Sheet.Header>
		<form
			method="POST"
			action="?/saveSubscription&redirectTo=/dashboard:{$page.url.searchParams
				.toString()
				.replace('&', ',')}"
			use:enhance
			class="mt-4 grid flex-grow content-start gap-4 overflow-y-auto px-1"
		>
			<input type="hidden" name="id" value={editingSubscription?.id} />
			<div>
				<label for="company" class="text-xs">Company</label>
				<Input
					id="company"
					type="text"
					name="company"
					bind:value={company}
					aria-invalid={$errors.company ? 'true' : undefined}
					placeholder="E.g. Netflix, Disneyplus, ..."
					class={$errors.company ? 'border-destructive' : ''}
				/>
				{#if $errors.company}
					<p class="text-destructive text-xs">{$errors.company}</p>
				{/if}
			</div>
			<div>
				<label for="description" class="text-xs">
					Description <span>(Optional)</span>
				</label>
				<Textarea
					id="description"
					name="description"
					bind:value={description}
					placeholder="Type any additional information here"
				/>
			</div>
			<div class="grid grid-cols-3 gap-2">
				<div>
					<label for="amount" class="text-xs">Amount</label>
					<Input
						id="amount"
						type="number"
						name="amount"
						bind:value={amount}
						inputmode="decimal"
						pattern="\d*"
						aria-invalid={$errors.amount ? 'true' : undefined}
						placeholder="49"
						class={$errors.amount ? 'border-destructive' : ''}
					/>
					{#if $errors.amount}
						<p class="text-destructive text-xs">{$errors.amount}</p>
					{/if}
				</div>
				<div>
					<label for="currency" class="text-xs">Currency</label>
					<Select.Root selected={selectedCurrency} onSelectedChange={(e) => (selectedCurrency = e)}>
						<Select.Trigger class={$errors.currency ? 'border-destructive' : ''}>
							<Select.Value placeholder="Currency" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each currencies as currency}
									<Select.Item value={currency.value} label={currency.label} class="pl-2">
										{currency.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
					<input type="hidden" name="currency" value={selectedCurrency?.value ?? ''} />
					{#if $errors.currency}
						<p class="text-destructive text-xs">{$errors.currency}</p>
					{/if}
				</div>
				<div>
					<label for="period" class="text-xs">Period</label>
					<Select.Root selected={selectedPeriod} onSelectedChange={(e) => (selectedPeriod = e)}>
						<Select.Trigger class={$errors.period ? 'border-destructive' : ''}>
							<Select.Value placeholder="Period" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each periods as period}
									<Select.Item value={period.value} label={period.label} class="pl-2">
										{period.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
					<input type="hidden" name="period" value={selectedPeriod?.value ?? ''} />
					{#if $errors.period}
						<p class="text-destructive text-xs">{$errors.period}</p>
					{/if}
				</div>
			</div>
			<div>
				<label for="type" class="text-xs">Type</label>
				<Select.Root selected={selectedType} onSelectedChange={(e) => (selectedType = e)}>
					<Select.Trigger class={$errors.type ? 'border-destructive' : ''}>
						<Select.Value placeholder="Type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each types as type}
								<Select.Item value={type.value} label={type.label}>
									{type.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<input type="hidden" name="type" value={selectedType?.value ?? ''} />
				{#if $errors.type}
					<p class="text-destructive text-xs">{$errors.type}</p>
				{/if}
			</div>
			<div>
				<label for="url" class="text-xs">URL <span>(Optional)</span></label>
				<Input
					id="url"
					type="url"
					inputmode="url"
					name="url"
					bind:value={url}
					placeholder="website.com/mysubscriptions"
				/>
			</div>
			<Button type="submit">
				{#if $delayed}
					<Loader2 class="animate-spin" />
				{:else}
					{mode === 'add' ? 'Add' : 'Save'}
				{/if}
			</Button>
			{#if $message}
				<p
					class="text-center text-xs {$page.status === 200 ? 'text-green-400' : 'text-destructive'}"
				>
					{$message}
				</p>
			{/if}
		</form>
	</Sheet.Content>
</Sheet.Root>
