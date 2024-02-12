<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import type { DeleteSubscriptionsSchema } from '$lib/schemas/subscription';
	import { Loader2 } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let form: SuperValidated<DeleteSubscriptionsSchema>;
	export let items: string[] = [];

	const { enhance, delayed } = superForm(form, {
		onResult: () => (items = [])
	});
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button disabled={items.length === 0} builders={[builder]} variant="destructive">Delete</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to delete the selected items?</AlertDialog.Title>
			<AlertDialog.Description
				>This action will delete {items.length} item(s) and cannot be undone. Continuing will permanently
				delete all the items you have selected!</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form method="POST" action="?/deleteSubscriptions" use:enhance>
				<input type="hidden" name="ids" value={items} />
				<AlertDialog.Action
					type="submit"
					class="min-w-[80px] border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground"
				>
					{#if $delayed}
						<Loader2 class="animate-spin" />
					{:else}
						Delete
					{/if}
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
