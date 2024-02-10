import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { message, superValidate } from 'sveltekit-superforms/server';
import { subscriptionSchema } from '$lib/schemas/subscription';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user && !dev) {
		redirect(302, '/login?redirect=/dashboard');
	}

	return {
		subscriptionForm: await superValidate(subscriptionSchema)
	};
};

export const actions = {
	addSubscription: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/dashboard');
		}

		const form = await superValidate(event, subscriptionSchema);
		console.log(form.data);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		return message(form, 'Subscription added');
	}
};
