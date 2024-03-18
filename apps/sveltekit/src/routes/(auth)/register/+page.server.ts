import { signUpSchema } from '$lib/schemas/register';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';
import { redirect } from 'sveltekit-flash-message/server';
import EmailService from '$lib/server/services/EmailService';
import { getLimiter } from '$lib/server/rateLimiter';

const limiter = getLimiter('register');

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	await limiter.cookieLimiter?.preflight(event);

	return {
		form: await superValidate(signUpSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		// Validate form
		const form = await superValidate(event, signUpSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// TODO: Fix rate limiter
		// Disallow form spam
		// if (await limiter.isLimited(event)) {
		// 	return message(form, 'Too many tries. Please wait before trying again!', {
		// 		status: 429
		// 	});
		// }

		const { email, password } = form.data;

		try {
			// Try to create user
			const user = await AuthService.createUser(email, password);
			// Send verification email
			const verificationCode = await AuthService.generateEmailVerificationCode(
				user.id,
				user.email!
			);
			await EmailService.sendVerificationEmail(user.email!, verificationCode);

			const sessionCookie = await AuthService.createSession(user.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error) {
			console.log(error);
			// Error handling
			if (error instanceof Error) {
				const errorMessage = error.message;
				if (errorMessage === 'Email already in use') {
					return setError(form, 'email', errorMessage);
				}
			}
			return message(form, 'Could not create user. Please try again.', {
				status: 500
			});
		}

		// Redirect to verification page
		redirect(302, '/verify-email');
	}
};
