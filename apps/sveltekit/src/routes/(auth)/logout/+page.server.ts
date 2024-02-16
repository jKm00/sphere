import type { PageServerLoad } from './$types';
import AuthService from '$lib/server/services/AuthService';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/');
	}

	if (!event.locals.session) {
		redirect(
			302,
			'/',
			{
				type: 'error',
				message: 'Failed to log out. Please try again.'
			},
			event
		);
	}
	const blankSession = await AuthService.logout(event.locals.session.id);
	event.cookies.set(blankSession.name, blankSession.value, {
		path: '.',
		...blankSession.attributes
	});

	redirect(302, '/');
};
