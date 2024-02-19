<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import VerifyEmail from '$lib/components/forms/VerifyEmail.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="flex flex-col">
		<VerifyEmail form={data.form} />
		<Button
			data-sveltekit-preload-data="off"
			href="/logout"
			variant="ghost"
			class="text-muted-foreground font-normal underline">Logout</Button
		>
	</div>
</div>
