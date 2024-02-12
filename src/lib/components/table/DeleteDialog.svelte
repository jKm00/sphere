<script lang="ts">
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import type { DeleteSubscriptionsSchema } from '$lib/schemas/subscription';
	import { Loader2 } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let form: SuperValidated<DeleteSubscriptionsSchema>;
	export let items: string[] = [];
	export let showTrigger = true;
	export let open = false;

	const { enhance, delayed } = superForm(form, {
		onResult: () => (items = [])
	});
</script>

<AlertDialog.Root bind:open>
	{#if showTrigger}
		<AlertDialog.Trigger asChild let:builder>
			<Button disabled={items.length === 0} builders={[builder]} variant="destructive"
				>Delete</Button
			>
		</AlertDialog.Trigger>
	{/if}
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to delete?</AlertDialog.Title>
			<AlertDialog.Description
				>This action will delete {items.length} item(s) and
				<strong class="font-normal underline">cannot be undone</strong>.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => (items = [])}>Cancel</AlertDialog.Cancel>
			<form
				method="POST"
				action="?/deleteSubscriptions&redirectTo=/dashboard:{$page.url.searchParams
					.toString()
					.replace('&', ',')}"
				use:enhance
			>
				<input type="hidden" name="ids" value={items} />
				<AlertDialog.Action
					type="submit"
					class="w-full border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
				>
					{#if $delayed}
						<Loader2 class="animate-spin" />
					{:else}
						Delete anyways
					{/if}
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
