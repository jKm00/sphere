<script lang="ts">
	import ForgotPasswordEmailForm from '$lib/components/forms/ForgotPasswordEmailForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="flex flex-col">
		<ForgotPasswordEmailForm form={data.form} />
	</div>
</div>
