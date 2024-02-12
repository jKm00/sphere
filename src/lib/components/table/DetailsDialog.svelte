<script lang="ts">
	import type { SingleSubscriptionDto } from '$lib/dtos/subscription';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ArrowUpRightFromSquare } from 'lucide-svelte';

	export let viewingSubscription: SingleSubscriptionDto | null = null;
	$: openViewDialog = viewingSubscription !== null;
</script>

<Dialog.Root bind:open={openViewDialog} onOpenChange={() => (viewingSubscription = null)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{viewingSubscription?.id}</Dialog.Title>
			<Dialog.Description>Viewing details of {viewingSubscription?.id}</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4">
			<div>
				<h3 class="text-xs text-muted-foreground">Company</h3>
				<p>{viewingSubscription?.company}</p>
			</div>
			<div>
				<h3 class="text-xs text-muted-foreground">Description</h3>
				<p>
					{viewingSubscription?.description === ''
						? 'No descrpition provided'
						: viewingSubscription?.description}
				</p>
			</div>
			<div>
				<h3 class="text-xs text-muted-foreground">Amount</h3>
				<p>
					{viewingSubscription?.amount}
					{viewingSubscription?.currency} / {viewingSubscription?.period[0].toUpperCase()}{viewingSubscription?.period.substring(
						1
					)}
				</p>
			</div>
			<div>
				<h3 class="text-xs text-muted-foreground">Subscription type</h3>
				<p>{viewingSubscription?.type[0].toUpperCase()}{viewingSubscription?.type.substring(1)}</p>
			</div>
			<div>
				<h3 class="flex items-center text-xs text-muted-foreground">
					URL <ArrowUpRightFromSquare class="ml-2 h-3 w-3" />
				</h3>
				{#if viewingSubscription?.url === ''}
					<p>No url provided</p>
				{:else}
					<a href={viewingSubscription?.url} target="_blank" class="text-link underline"
						>{viewingSubscription?.url}</a
					>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
