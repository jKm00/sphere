<script lang="ts">
	import ResetPassword from '$lib/components/forms/ResetPassword.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="flex flex-col">
		<ResetPassword form={data.form} />
	</div>
</div>
