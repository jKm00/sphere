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

		// Using flash message to redirect with a message
		// This message is caught in the login page and displayed
		// in a toast
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
};
