import UserService from '$lib/server/services/UserService';
import { fail, type Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { emailSchema } from '$lib/schemas/email';
import { passwordSchema } from '$lib/schemas/password';
import AuthService from '$lib/server/services/AuthService';

export const load: PageServerLoad = async () => {
	return {
		emailForm: await superValidate(emailSchema),
		passwordForm: await superValidate(passwordSchema)
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
	changePassword: async (event) => {
		if (!event.locals.user || !event.locals.session) {
			redirect(302, '/login?redirect=/settings');
		}

		const form = await superValidate(event, passwordSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { currentPassword, newPassword } = form.data;

		try {
			const sessionCookie = await AuthService.changePassword(
				event.locals.user.id,
				event.locals.session.id,
				currentPassword,
				newPassword
			);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (err) {
			if (err instanceof Error) {
				return message(form, err.message, { status: 403 });
			} else {
				redirect(
					302,
					'/settings',
					{
						type: 'error',
						message: 'Failed to change password. Please try again!'
					},
					event
				);
			}
		}

		redirect(
			302,
			'/settings',
			{
				type: 'success',
				message: 'Password changed!'
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
