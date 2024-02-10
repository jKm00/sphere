<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { mode, setMode } from 'mode-watcher';

	$: selectedTheme = themes.find((t) => t.value === $mode) ?? themes[0];

	const themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	] as const;

	$: if (selectedTheme) {
		setMode(selectedTheme.value);
	}
</script>

<div class="flex items-center justify-between">
	<p>Theme</p>
	<Select.Root portal={null} bind:selected={selectedTheme}>
		<Select.Trigger class="w-40">
			<Select.Value placeholder="Select theme" class="text-foreground" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Theme</Select.Label>
				{#each themes as theme}
					<Select.Item value={theme.value} label={theme.label}>
						{theme.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
