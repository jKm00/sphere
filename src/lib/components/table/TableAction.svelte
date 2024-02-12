<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { MoreHorizontal } from 'lucide-svelte';
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
			<DropdownMenu.Item on:click={() => dispatch('view', subscription)}
				>View details</DropdownMenu.Item
			>
			<DropdownMenu.Item>Edit details</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="text-destructive">Delete</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
