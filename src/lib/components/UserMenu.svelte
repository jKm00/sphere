<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import type { UserDto } from '$lib/dtos/user';
	import ThemeDropdown from './ThemeDropdown.svelte';

	export let user: UserDto;
</script>

<Popover.Root portal={null}>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" class="rounded-full p-0">
			<div class="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500"></div>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-80">
		<div class="grid gap-4 text-sm text-muted-foreground">
			<h2>{user.email}</h2>
			<ThemeDropdown />
			<Button href="/logout">Log out</Button>
		</div>
	</Popover.Content>
</Popover.Root>
