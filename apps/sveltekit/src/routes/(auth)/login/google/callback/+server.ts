import AuthService from '$lib/server/services/AuthService';
import { GOOGLE_OAUTH_STATE_COOKIE, GOOGLE_OAUTH_VERIFIER_COOKIE } from '$lib/server/utils';
import { redirect } from 'sveltekit-flash-message/server';
import type { RequestEvent } from './$types';

export async function GET(event: RequestEvent) {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get(GOOGLE_OAUTH_STATE_COOKIE);
	const storedCodeVerifier = event.cookies.get(GOOGLE_OAUTH_VERIFIER_COOKIE);

	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response(null, { status: 400 });
	}

	try {
		const sessionCookie = await AuthService.signInWithGoogle(code, storedCodeVerifier);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	} catch (err) {
		if (err instanceof Error) {
			redirect(302, '/', { type: 'error', message: err.message }, event);
		} else {
			redirect(
				302,
				'/',
				{
					type: 'error',
					message: 'Failed to sign in with Google. Please try again.'
				},
				event
			);
		}
	}

	redirect(302, '/dashboard', { type: 'info', message: 'Welcome back!' }, event);
}
