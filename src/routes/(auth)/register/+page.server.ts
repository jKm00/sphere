import { signUpSchema } from '$lib/schema';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

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

		// TODO: Check if email already exists
		const emailAlreadyExists = false;
		if (emailAlreadyExists) {
			return setError(form, 'email', 'Email already exists');
		}

		// TODO: Create user
		// https://lucia-auth.com/tutorials/username-and-password/sveltekit
		const somethingWentWrong = false;
		if (somethingWentWrong) {
			return message(form, 'Something went wrong', {
				status: 409
			});
		}

		return message(form, 'User created successfully!');
		// // Or
		// redirect(302, '/login');
	}
};
