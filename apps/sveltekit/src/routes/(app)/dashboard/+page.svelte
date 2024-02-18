<script lang="ts">
	import TableSection from '$lib/components/table/TableSection.svelte';
	import type { PageData } from './$types';
	import KeyCardSection from '$lib/components/keycards/KeyCardSection.svelte';

	export let data: PageData;
</script>

<KeyCardSection
	prefferedCurrency={data.user.prefferedCurrency}
	prefferedPeriod={data.user.prefferedPeriod}
	totalSum={data.derived.totalSum}
	numberOfSubs={data.subscriptions.totalItems}
	mostExpensiveSub={data.derived.mostExpensiveSub}
/>
<TableSection
	subscriptionForm={data.subscriptionForm}
	deleteSubscriptionsForm={data.deleteSubscriptionsForm}
	subscriptions={data.subscriptions}
/>
