<script lang="ts">
	import { auth } from '$lib/firebase.client';
	import { sendEmailVerification } from 'firebase/auth';
	import { toast } from 'svelte-sonner';

	async function handleVerification() {
		const user = auth.currentUser;
		if (!user) {
			toast.error('User not found');
		} else {
			await sendEmailVerification(user);
			toast('Verification email sent');
		}
	}
</script>

<p
	class="rounded border border-yellow-400 bg-yellow-50 px-4 py-2 text-center text-sm text-yellow-800"
>
	Your email is not yet verified. <button on:click={handleVerification} class="underline"
		>Click here to verify</button
	>
</p>
