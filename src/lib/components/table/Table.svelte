<script lang="ts">
	import type { SubscriptionDto } from '$lib/dtos/subscription';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { MoveDown, MoveUp } from 'lucide-svelte';

	export let data: SubscriptionDto[];

	type Header = {
		key: string;
		label: string;
		sort?: 'asc' | 'desc' | null;
		action?: (header: Header) => void;
	};

	let headers = [
		{
			key: 'id',
			label: 'ID'
		},
		{
			key: 'company',
			label: 'Company',
			sort: null,
			action: (header: Header) => {
				updateSort(header);
			}
		},
		{
			key: 'amount',
			label: 'Amount',
			sort: null,
			action: (header: Header) => {
				updateSort(header);
			}
		},
		{
			key: 'period',
			label: 'Period',
			sort: null,
			action: (header: Header) => {
				updateSort(header);
			}
		},
		{
			key: 'type',
			label: 'Type',
			sort: null,
			action: (header: Header) => {
				updateSort(header);
			}
		}
	] as Header[];

	function updateSort(header: Header) {
		// Use current sort state to calculate new state
		let newSort: 'asc' | 'desc' | null;
		switch (header.sort) {
			case 'asc':
				newSort = 'desc';
				break;
			case 'desc':
				newSort = null;
				break;
			default:
				newSort = 'asc';
				break;
		}

		// Update to new state
		headers.forEach((h) => {
			if (h.sort !== undefined) {
				if (h.key === header.key) {
					h.sort = newSort;
				} else {
					h.sort = null;
				}
			}
		});
		headers = headers;

		// Update url
		updateUrl([
			{ key: 'sort', value: header.sort === null ? null : header.key },
			{ key: 'order', value: header.sort }
		]);
	}

	function updateUrl(pairs: { key: string; value: string | undefined | null }[]) {
		const searchParams = $page.url.searchParams;

		pairs.forEach((pair) => {
			const { key, value } = pair;
			if (!value) {
				searchParams.delete(key);
			} else {
				searchParams.set(key, value);
			}
		});
		goto(`?${searchParams.toString()}`, { invalidateAll: true });
	}
</script>

<Table.Root>
	<Table.Caption>A list of all your subscription</Table.Caption>
	<Table.Header>
		<Table.Row>
			{#each headers as header (header.key)}
				<Table.Head>
					{#if header.action}
						<button
							class="flex items-center gap-1"
							on:click={() => {
								if (header.action) {
									header.action(header);
								}
							}}
						>
							{header.label}
							{#if header.sort === 'asc'}
								<MoveUp class="w-4" />
							{/if}
							{#if header.sort === 'desc'}
								<MoveDown class="w-4" />
							{/if}
						</button>
					{:else}
						{header.label}
					{/if}
				</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as subsription, i (i)}
			<Table.Row>
				<Table.Cell>{subsription.id}</Table.Cell>
				<Table.Cell>{subsription.company}</Table.Cell>
				<Table.Cell>{subsription.amount} {subsription.currency}</Table.Cell>
				<Table.Cell>{subsription.period}</Table.Cell>
				<Table.Cell>{subsription.type}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
