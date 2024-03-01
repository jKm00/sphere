import AuthService from '$lib/server/services/AuthService';
import { redirect } from 'sveltekit-flash-message/server';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state');

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, { status: 400 });
	}

	try {
		const sessionCookie = await AuthService.signInWithGitHub(code);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	} catch (err) {
		redirect(
			302,
			'/',
			{ type: 'error', message: 'Failed to sign in with GitHub. Please try again.' },
			event
		);
	}

	redirect(302, '/dashboard', { type: 'info', message: 'Welcome back!' }, event);
}
