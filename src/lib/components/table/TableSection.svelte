<script lang="ts">
	import Subscription from '$lib/components/forms/Subscription.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { DeleteSubscriptionsSchema, SubscriptionSchema } from '$lib/schemas/subscription';
	import Table from '$lib/components/table/Table.svelte';
	import type { SingleSubscriptionDto, SubscriptionsDto } from '$lib/dtos/subscription';
	import DeleteDialog from './DeleteDialog.svelte';
	import DetailsDialog from './DetailsDialog.svelte';

	export let subscriptionForm: SuperValidated<SubscriptionSchema>;
	export let deleteSubscriptionsForm: SuperValidated<DeleteSubscriptionsSchema>;
	export let subscriptions: SubscriptionsDto;

	let viewingSubscription: SingleSubscriptionDto | null = null;

	let mode: 'add' | 'edit';
	let editingSubscription: SingleSubscriptionDto | null = null;
	$: openEditingDrawer = editingSubscription !== null;

	let checkedRows: string[] = [];
	let openDeleteDialog = false;

	function handleEdit(e: CustomEvent<SingleSubscriptionDto>) {
		mode = 'edit';
		editingSubscription = e.detail;
	}

	function handleDelete(e: CustomEvent<string>) {
		checkedRows = [e.detail];
		openDeleteDialog = true;
	}
</script>

<section>
	<header class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">Your subscriptions</h2>
		<div>
			<DeleteDialog
				bind:open={openDeleteDialog}
				bind:items={checkedRows}
				form={deleteSubscriptionsForm}
			/>
			<Subscription
				bind:open={openEditingDrawer}
				bind:editingSubscription
				bind:mode
				{subscriptionForm}
			/>
		</div>
	</header>
	<Table
		bind:checkedRows
		on:view={(e) => (viewingSubscription = e.detail)}
		on:edit={handleEdit}
		on:delete={handleDelete}
		{subscriptions}
	/>
</section>

<DetailsDialog bind:viewingSubscription />
