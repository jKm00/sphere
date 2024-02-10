<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import AddSubscription from '$lib/components/forms/AddSubscription.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SubscriptionSchema } from '$lib/schemas/subscription';
	import Table from '$lib/components/table/Table.svelte';
	import type { SubscriptionDto } from '$lib/dtos/subscription';

	export let subscriptionForm: SuperValidated<SubscriptionSchema>;
	export let data: SubscriptionDto[];
</script>

<section>
	<header class="flex items-center justify-between">
		<h2 class="text-xl font-bold">Your subscriptions</h2>
		<div>
			<Button variant="destructive" disabled>Delete</Button>
			<AddSubscription {subscriptionForm} />
		</div>
	</header>
	<Table {data} />
</section>
