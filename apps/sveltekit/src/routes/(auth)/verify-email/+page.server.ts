import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { verifyEmail } from '$lib/schemas/email';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
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
	}
};
