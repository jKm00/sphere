import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { resetPasswordSchema } from '$lib/schemas/password';
import { fail } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	return {
		form: await superValidate(resetPasswordSchema)
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, resetPasswordSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = event.params.token;
		const { newPassword } = form.data;

		try {
			await AuthService.resetPassword(token, newPassword);
		} catch (err) {
			if (err instanceof Error) {
				return message(form, err.message, { status: 400 });
			} else {
				return message(
					form,
					'Something went wrong. Please try again or get a new password reset link.',
					{ status: 500 }
				);
			}
		}

		redirect(
			302,
			'/login',
			{
				type: 'success',
				message: 'Password successfully reset!'
			},
			event
		);
	}
};
