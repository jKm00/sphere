import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { loginSchema } from '$lib/schemas/login';
import { fail } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	return {
		form: await superValidate(loginSchema)
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, loginSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { email, password } = form.data;

		let emailVerified = false;
		try {
			const { user, sessionCookie } = await AuthService.login(email, password);
			emailVerified = user.emailVerified;
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === 'Email not found') {
					return setError(form, 'email', error.message);
				}
				if (error.message === 'Invalid credentials') {
					return message(form, error.message, { status: 401 });
				}
			}
			return message(form, 'Could not log in. Please try again.', {
				status: 500
			});
		}

		const redirectUrl = event.url.searchParams.get('redirectTo') || '/dashboard';

		if (!emailVerified) {
			return redirect(302, `/verify-email?redirectTo=${redirectUrl}`);
		}

		redirect(
			302,
			redirectUrl,
			{
				type: 'info',
				message: 'Welcome back!'
			},
			event
		);
	}
};
