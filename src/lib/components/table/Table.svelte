<script lang="ts">
	import type { SingleSubscriptionDto, SubscriptionsDto } from '$lib/dtos/subscription';
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { MoveDown, MoveUp } from 'lucide-svelte';
	import TableAction from './TableAction.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type Header = {
		key: string;
		label: string;
		showOnMobile: boolean;
		width?: string;
		sort?: 'asc' | 'desc' | null;
		action?: (header: Header) => void;
	};

	export let checkedRows: string[] = [];
	export let subscriptions: SubscriptionsDto;

	let showMobileVersion = false;

	let headers = [
		{
			key: 'id',
			label: 'ID',
			showOnMobile: false,
			width: 'w-24'
		},
		{
			key: 'company',
			label: 'Company',
			showOnMobile: true,
			sort: null,
			action: (header: Header) => {
				updateSort(header);
			}
		},
		{
			key: 'amount',
			label: 'Amount',
			showOnMobile: true,
			sort: null,
			action: (header: Header) => {
				updateSort(header);
			}
		},
		{
			key: 'period',
			label: 'Period',
			showOnMobile: false,
			sort: null,
			action: (header: Header) => {
				updateSort(header);
			}
		},
		{
			key: 'type',
			label: 'Type',
			sort: null,
			showOnMobile: false,
			action: (header: Header) => {
				updateSort(header);
			}
		}
	] as Header[];

	$: selectAll = subscriptions.data.length > 0 && checkedRows.length === subscriptions.data.length;

	$: currentPage =
		Number($page.url.searchParams.get('page')) === 0
			? 1
			: Number($page.url.searchParams.get('page'));

	onMount(() => {
		handleResize();
	});

	/**
	 * Updates the sort state based on the header clicked
	 * @param header to sort by
	 */
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
			case null:
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
			{ key: 'sortBy', value: header.sort === null ? null : header.key },
			{ key: 'order', value: header.sort }
		]);
	}

	/**
	 * Updates the page displayed in the table
	 * @param newPage number of the page to update to
	 */
	function updatePage(newPage: number) {
		if (newPage < 1) {
			newPage = 1;
		} else if (newPage > Math.ceil(subscriptions.totalItems / subscriptions.pageSize)) {
			newPage = Math.ceil(subscriptions.totalItems / subscriptions.pageSize);
		}
		checkedRows = [];
		updateUrl([{ key: 'page', value: `${newPage}` }]);
	}

	/**
	 * Updates the url with new key value pairs. This will retrigger the load function.
	 * - Keys in the url that are not included in the list will not be modified
	 * - Keys that have a value of null or undefined will be removed
	 * @param pairs a list of new key value pairs
	 */
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

	/**
	 * Selects all rows in the table.
	 * If all rows are already selected, it will deselect all rows.
	 * @param event
	 */
	function handleAllSelect() {
		selectAll = !selectAll;

		if (selectAll) {
			checkedRows = subscriptions.data.map((d) => d.id);
		} else {
			checkedRows = [];
		}
	}

	function handleResize() {
		if (browser) {
			showMobileVersion = window.innerWidth < 768;
		}
	}
</script>

<svelte:window on:resize={handleResize} />

<!-- Table -->
<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-10">
				<input type="checkbox" on:click={handleAllSelect} bind:checked={selectAll} />
			</Table.Head>
			{#each headers as header (header.key)}
				{#if !showMobileVersion || header.showOnMobile}
					<Table.Head class={header.width ? header.width : ''}>
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
								{#if header.sort === 'desc'}
									<MoveUp class="w-4" />
								{/if}
								{#if header.sort === 'asc'}
									<MoveDown class="w-4" />
								{/if}
							</button>
						{:else}
							{header.label}
						{/if}
					</Table.Head>
				{/if}
			{/each}
			<Table.Head class="w-10"></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if subscriptions.data.length === 0}
			<td colspan={100} class="py-10 text-center text-muted-foreground">No items...</td>
		{:else}
			{#each subscriptions.data as subscription, i (i)}
				<Table.Row>
					<Table.Cell>
						<input type="checkbox" value={subscription.id} bind:group={checkedRows} />
					</Table.Cell>
					{#if !showMobileVersion}
						<Table.Cell>{subscription.id}</Table.Cell>
					{/if}
					<Table.Cell>{subscription.company}</Table.Cell>
					<Table.Cell>{subscription.amount} {subscription.currency}</Table.Cell>
					{#if !showMobileVersion}
						<Table.Cell
							>{subscription.period[0].toUpperCase()}{subscription.period.substring(1)}</Table.Cell
						>
					{/if}
					{#if !showMobileVersion}
						<Table.Cell
							>{subscription.type[0].toUpperCase()}{subscription.type.substring(1)}</Table.Cell
						>
					{/if}
					<Table.Cell><TableAction {subscription} on:view on:edit on:delete /></Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>

<!-- Table controlls -->
<div class="flex items-center justify-between">
	<p class="text-sm">{checkedRows.length} of {subscriptions.data.length} row(s) selected</p>
	<Pagination.Root
		count={subscriptions.totalItems}
		perPage={subscriptions.pageSize}
		page={currentPage}
		let:pages
		let:currentPage
		class="mx-0 w-auto"
	>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton on:click={() => updatePage(currentPage ? currentPage - 1 : 0)} />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis on:click={() => updatePage(page.value)} />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link
							on:click={() => updatePage(page.value)}
							{page}
							isActive={currentPage == page.value}
						>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton on:click={() => updatePage(currentPage ? currentPage + 1 : 0)} />
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
</div>
