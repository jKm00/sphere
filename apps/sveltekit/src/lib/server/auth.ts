import { GitHub } from 'arctic';
import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { db } from './prisma';
import { GITHUB_CLIENT, GITHUB_SECRET } from '$env/static/private';

const client = db;
const adapter = new PrismaAdapter(client.session, client.user);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			emailVerified: attributes.emailVerified,
			email: attributes.email,
			githubId: attributes.githubId,
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: {
			email: string;
			emailVerified: boolean;
			githubId: string;
			username: string;
		};
	}
}

export const github = new GitHub(GITHUB_CLIENT, GITHUB_SECRET);
