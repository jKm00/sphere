<script lang="ts">
	import { page } from '$app/stores';
	import TableSection from '$lib/components/table/TableSection.svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import type { PageData } from './$types';

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

<!-- Section: Key numbers -->
<TableSection
	subscriptionForm={data.subscriptionForm}
	deleteSubscriptionsForm={data.deleteSubscriptionsForm}
	subscriptions={data.subscriptions}
/>
