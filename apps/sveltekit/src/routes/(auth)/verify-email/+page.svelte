<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import VerifyEmail from '$lib/components/forms/VerifyEmail.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
</script>

<div class="flex flex-grow items-center justify-center">
	<div class="flex flex-col">
		<VerifyEmail form={data.form} />
		<div class="flex items-center justify-between">
			<form method="POST" action="?/resetVerificationCode" use:enhance>
				<button type="submit" class="text-muted-foreground text-sm font-normal underline">
					Resend code
				</button>
			</form>
			<Button
				data-sveltekit-preload-data="off"
				href="/logout"
				variant="ghost"
				class="text-muted-foreground font-normal underline">Logout</Button
			>
		</div>
	</div>
</div>
