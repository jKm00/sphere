<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import type { UserDto } from '$lib/dtos/user';
	import ThemeDropdown from './themes/ThemeDropdown.svelte';
	import { LogOut, Settings, User } from 'lucide-svelte';
	import Separator from './ui/separator/separator.svelte';
	import { version } from '$lib/version';
	import CurrencyDropdown from './CurrencyDropdown.svelte';
	import PeriodDropdown from './PeriodDropdown.svelte';
	import { goto } from '$app/navigation';

	export let user: UserDto;

	let open = false;

	function handleNavigate(path: string) {
		open = false;
		goto(path);
	}
</script>

<Popover.Root portal={null} bind:open>
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
		<div class="text-muted-foreground grid gap-2 text-sm">
			<h2 class="px-4">{user.email}</h2>
			<Separator class="my-2" />
			<ThemeDropdown />
			<CurrencyDropdown currency={user.prefferedCurrency} />
			<PeriodDropdown period={user.prefferedPeriod} />
			<Button
				on:click={() => handleNavigate('/settings')}
				variant="ghost"
				class="flex items-center justify-between rounded-none font-normal"
			>
				<p>Settings</p>
				<Settings class="w-4" />
			</Button>
			<Button
				data-sveltekit-preload-data="off"
				on:click={() => handleNavigate('/logout')}
				variant="ghost"
				class="flex items-center justify-between rounded-none font-normal"
			>
				Log out
				<LogOut class="w-4" />
			</Button>
			<Separator class="my-2" />
			<p class="mb-4 text-center text-xs">Version {version}</p>
		</div>
	</Popover.Content>
</Popover.Root>
