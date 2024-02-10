<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import type { UserDto } from '$lib/dtos/user';
	import ThemeDropdown from './ThemeDropdown.svelte';
	import { LogOut, Settings, User } from 'lucide-svelte';
	import Separator from './ui/separator/separator.svelte';
	import { version } from '$lib/version';

	export let user: UserDto;
</script>

<Popover.Root portal={null}>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" class="rounded-full p-0">
			<div
				class="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500"
			>
				<User class="w-3" />
			</div>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-80 p-0 pt-4">
		<div class="grid gap-4 text-sm text-muted-foreground">
			<h2 class="px-4">{user.email}</h2>
			<Separator />
			<ThemeDropdown />
			<Button
				variant="ghost"
				class="flex items-center justify-between rounded-none font-normal"
				disabled
			>
				<p>Settings</p>
				<p class="text-xs">Not implemented</p>
				<Settings class="w-4" />
			</Button>
			<Button
				href="/logout"
				variant="ghost"
				class="flex items-center justify-between rounded-none font-normal"
			>
				Log out
				<LogOut class="w-4" />
			</Button>
			<Separator />
			<p class="mb-4 text-center text-xs">Version {version}</p>
		</div>
	</Popover.Content>
</Popover.Root>
