import { emailSchema } from '$lib/schemas/email';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	return {
		form: await superValidate(emailSchema)
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, emailSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Send email

		return redirect(
			302,
			'/forgot-password',
			{
				type: 'info',
				message:
					"We'll email you a password reset link if your entered email is linked to an account."
			},
			event
		);
	}
};
