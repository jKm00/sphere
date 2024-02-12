<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { ArrowUpRightFromSquare, BadgeX, Eye, MoreHorizontal, Pencil } from 'lucide-svelte';
	import type { SingleSubscriptionDto } from '$lib/dtos/subscription';
	import { createEventDispatcher } from 'svelte';

	export let subscription: SingleSubscriptionDto;

	const dispatch = createEventDispatcher<{ view: SingleSubscriptionDto }>();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => dispatch('view', subscription)}>
				<Eye class="mr-2 h-4 w-4" />
				View details
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Pencil class="mr-2 h-4 w-4" />
				Edit details
			</DropdownMenu.Item>
			{#if subscription.url}
				<DropdownMenu.Item href={subscription.url} target="_blank">
					<ArrowUpRightFromSquare class="mr-2 h-4 w-4" />
					Go to subscription
				</DropdownMenu.Item>
			{/if}
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="text-destructive">
				<BadgeX class="mr-2 h-4 w-4" />
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
