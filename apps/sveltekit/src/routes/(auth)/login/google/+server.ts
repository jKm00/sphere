import { generateCodeVerifier, generateState } from 'arctic';
import type { RequestEvent } from './$types';
import { google } from '$lib/server/auth';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { GOOGLE_OAUTH_STATE_COOKIE, GOOGLE_OAUTH_VERIFIER_COOKIE } from '$lib/server/utils';

export async function GET(event: RequestEvent) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email']
	});

	event.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set(GOOGLE_OAUTH_VERIFIER_COOKIE, codeVerifier, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url);
}
