<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
</script>

<form>
	<Input type="number" name="code" placeholder="Enter code" />
</form>

<Button data-sveltekit-preload-data="off" href="/logout">Logout</Button>
