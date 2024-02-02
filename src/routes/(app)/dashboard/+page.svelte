<script lang="ts">
	import { session } from '$lib/session';
</script>

<h1>Dashboard: {$session.user?.email}</h1>
<a href="/logout">Logout</a>
