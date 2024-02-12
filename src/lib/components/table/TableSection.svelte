<script lang="ts">
	import AddSubscription from '$lib/components/forms/AddSubscription.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { DeleteSubscriptionsSchema, SubscriptionSchema } from '$lib/schemas/subscription';
	import Table from '$lib/components/table/Table.svelte';
	import type { SubscriptionsDto } from '$lib/dtos/subscription';
	import DeleteDialog from './DeleteDialog.svelte';

	export let subscriptionForm: SuperValidated<SubscriptionSchema>;
	export let deleteSubscriptionsForm: SuperValidated<DeleteSubscriptionsSchema>;
	export let subscriptions: SubscriptionsDto;

	let checkedRows: string[] = [];
</script>

<section>
	<header class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">Your subscriptions</h2>
		<div>
			<DeleteDialog form={deleteSubscriptionsForm} bind:items={checkedRows} />
			<AddSubscription {subscriptionForm} />
		</div>
	</header>
	<Table {subscriptions} bind:checkedRows />
</section>
