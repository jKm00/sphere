import UserService from '$lib/server/services/UserService';
import { type Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const actions: Actions = {
	deleteAccount: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/settings');
		}

		try {
			await UserService.delete(event.locals.user.id);
		} catch (err) {
			console.error(err);
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
