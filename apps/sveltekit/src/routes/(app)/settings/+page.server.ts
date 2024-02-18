import UserService from '$lib/server/services/UserService';
import { fail, type Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { emailSchema } from '$lib/schemas/email';

export const load: PageServerLoad = async () => {
	return {
		emailForm: await superValidate(emailSchema)
	};
};

export const actions: Actions = {
	updateEmail: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/settings');
		}

		const form = await superValidate(event, emailSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email } = form.data;

		try {
			await UserService.updateEmail(event.locals.user.id, email);
		} catch (err) {
			redirect(
				302,
				'/settings',
				{
					type: 'error',
					message: 'Failed to update email. Please try again!'
				},
				event
			);
		}

		redirect(
			302,
			'/settings',
			{
				type: 'success',
				message: 'Email updated!'
			},
			event
		);
	},
	deleteAccount: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/settings');
		}

		try {
			await UserService.delete(event.locals.user.id);
		} catch (err) {
			redirect(
				302,
				'/settings',
				{
					type: 'error',
					message: 'Failed to delete account. Please try again!'
				},
				event
			);
		}

		redirect(
			302,
			'/',
			{
				type: 'success',
				message: 'Account deleted!'
			},
			event
		);
	}
};
