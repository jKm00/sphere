import { dev } from '$app/environment';
import { github } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { generateState } from 'arctic';

export async function GET(event: RequestEvent) {
	const state = generateState();
	const url = await github.createAuthorizationURL(state);

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
}
