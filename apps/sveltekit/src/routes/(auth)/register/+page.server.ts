import { signUpSchema } from '$lib/schemas/register';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

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

		const { email, password } = form.data;

		// Try to create user
		try {
			await AuthService.createUser(email, password);
		} catch (error) {
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

		// Login user
		try {
			const sessionCookie = await AuthService.login(email, password);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error) {
			// If login fails, redirect to login page
			// so they can try again
			redirect(
				302,
				'/login?register=success',
				{
					type: 'success',
					message: 'User created successfully!'
				},
				event
			);
		}

		// On login success, redirect to dashboard
		redirect(
			302,
			'/dashboard',
			{
				type: 'success',
				message: 'Welcome to your dashboard!'
			},
			event
		);
	}
};
