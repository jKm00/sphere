<script lang="ts">
	import type { SingleSubscriptionDto, SubscriptionsDto } from '$lib/dtos/subscription';
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { MoveDown, MoveUp } from 'lucide-svelte';
	import TableAction from './TableAction.svelte';

	type Header = {
		key: string;
		label: string;
		sort?: 'asc' | 'desc' | null;
		action?: (header: Header) => void;
	};

	export let subscriptions: SubscriptionsDto;
	export let checkedRows: string[] = [];

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

	let viewingSubscription: SingleSubscriptionDto | null = null;
	$: openViewDialog = viewingSubscription !== null;

	$: selectAll = subscriptions.data.length > 0 && checkedRows.length === subscriptions.data.length;

	$: currentPage =
		Number($page.url.searchParams.get('page')) === 0
			? 1
			: Number($page.url.searchParams.get('page'));

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

	function handleViewDetails(event: CustomEvent<SingleSubscriptionDto>) {
		viewingSubscription = event.detail;
	}
</script>

<!-- Table -->
<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-10">
				<input type="checkbox" on:click={handleAllSelect} bind:checked={selectAll} />
			</Table.Head>
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
					<Table.Cell>{subscription.id}</Table.Cell>
					<Table.Cell>{subscription.company}</Table.Cell>
					<Table.Cell>{subscription.amount} {subscription.currency}</Table.Cell>
					<Table.Cell
						>{subscription.period[0].toUpperCase()}{subscription.period.substring(1)}</Table.Cell
					>
					<Table.Cell
						>{subscription.type[0].toUpperCase()}{subscription.type.substring(1)}</Table.Cell
					>
					<Table.Cell><TableAction on:view={handleViewDetails} {subscription} /></Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>

<!-- Table controlls -->
<div class="flex items-center justify-between">
	<p>{checkedRows.length} of {subscriptions.data.length} row(s) selected</p>
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

<!-- Subscription details dialog -->
<Dialog.Root bind:open={openViewDialog} onOpenChange={() => (viewingSubscription = null)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{viewingSubscription?.id}</Dialog.Title>
			<Dialog.Description>Viewing details of {viewingSubscription?.id}</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4">
			<div>
				<h3 class="text-xs text-muted-foreground">Company</h3>
				<p>{viewingSubscription?.company}</p>
			</div>
			<div>
				<h3 class="text-xs text-muted-foreground">Description</h3>
				<p>
					{viewingSubscription?.description === ''
						? 'No descrpition provided'
						: viewingSubscription?.description}
				</p>
			</div>
			<div>
				<h3 class="text-xs text-muted-foreground">Amount</h3>
				<p>
					{viewingSubscription?.amount}
					{viewingSubscription?.currency} / {viewingSubscription?.period[0].toUpperCase()}{viewingSubscription?.period.substring(
						1
					)}
				</p>
			</div>
			<div>
				<h3 class="text-xs text-muted-foreground">Subscription type</h3>
				<p>{viewingSubscription?.type[0].toUpperCase()}{viewingSubscription?.type.substring(1)}</p>
			</div>
			<div>
				<h3 class="text-xs text-muted-foreground">URL</h3>
				{#if viewingSubscription?.url === ''}
					<p>No url provided</p>
				{:else}
					<a href={viewingSubscription?.url} target="_blank" class="text-link underline"
						>{viewingSubscription?.url}</a
					>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
