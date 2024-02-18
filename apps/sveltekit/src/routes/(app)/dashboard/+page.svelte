<script lang="ts">
	import { page } from '$app/stores';
	import TableSection from '$lib/components/table/TableSection.svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import type { PageData } from './$types';
	import KeyCardSection from '$lib/components/keycards/KeyCardSection.svelte';

	export let data: PageData;

	// Display flash message returned from redirects
	const flash = getFlash(page);
	$: if ($flash) {
		if ($flash.type === 'success') {
			toast($flash.message);
		} else {
			toast.error($flash.message);
		}

		$flash = undefined;
	}
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
