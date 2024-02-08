import { signUpSchema } from '$lib/schema';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(signUpSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, signUpSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { email, password } = form.data;

		try {
			await AuthService.createUser(email, password);
		} catch (error) {
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

		return message(form, 'User created successfully!');
		// // Or
		// redirect(302, '/login');
	}
};
