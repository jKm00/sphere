<script lang="ts">
	import { Button, Hr, Html, Text } from 'svelte-email';

	export let code: string;
</script>

<Html lang="en">
	<Text>
		Your code: {code}
	</Text>
</Html>
