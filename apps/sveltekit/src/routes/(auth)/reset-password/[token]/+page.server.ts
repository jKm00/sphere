import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { resetPasswordSchema } from '$lib/schemas/password';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	return {
		form: await superValidate(resetPasswordSchema)
	};
};
