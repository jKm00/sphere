import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { verifyEmail } from '$lib/schemas/email';
import { fail } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/login');
	}

	if (user.emailVerified) {
		redirect(302, '/dashboard');
	}

	return {
		form: await superValidate(event, verifyEmail)
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, verifyEmail);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!event.locals.session) {
			redirect(302, '/login');
		}

		const { user } = await AuthService.validateSession(event.locals.session.id);

		if (!user) {
			redirect(302, '/login');
		}

		const { code } = form.data;

		try {
			const sessionCookie = await AuthService.verifyEmailVerificationCode(user.id, `${code}`);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (err) {
			if (err instanceof Error) {
				return message(form, err.message, { status: 400 });
			} else {
				return message(form, 'Could not verify email. Please try again.', { status: 400 });
			}
		}

		const redirectUrl = event.url.searchParams.get('redirectTo') || '/dashboard';

		redirect(302, redirectUrl, { type: 'info', message: 'Welcome to your dashboard!' }, event);
	}
};
