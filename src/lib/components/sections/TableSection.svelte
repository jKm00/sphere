<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import AddSubscription from '$lib/components/forms/AddSubscription.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SubscriptionSchema } from '$lib/schemas/subscription';
	import Table from '$lib/components/table/Table.svelte';
	import type { SubscriptionsDto } from '$lib/dtos/subscription';

	export let subscriptionForm: SuperValidated<SubscriptionSchema>;
	export let subscriptions: SubscriptionsDto;

	let checkedRows: string[] = [];
</script>

<section>
	<header class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">Your subscriptions</h2>
		<div>
			<Button variant="destructive" disabled={checkedRows.length === 0}>Delete</Button>
			<AddSubscription {subscriptionForm} />
		</div>
	</header>
	<Table {subscriptions} bind:checkedRows />
</section>
