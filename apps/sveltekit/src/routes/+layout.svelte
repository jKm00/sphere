<script lang="ts">
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { toast } from 'svelte-sonner';

	const flash = getFlash(page);

	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast.success($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
			case 'info':
				toast($flash.message);
				break;
		}

		$flash = undefined;
	}
</script>

<ModeWatcher />
<Toaster position="bottom-right" closeButton richColors />

<div class="flex min-h-screen flex-col">
	<slot />
</div>
