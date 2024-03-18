import { emailSchema } from '$lib/schemas/email';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import AuthService from '$lib/server/services/AuthService';
import EmailService from '$lib/server/services/EmailService';
import { getLimiter } from '$lib/server/rateLimiter';

const limiter = getLimiter('reset-password');

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}

	await limiter.cookieLimiter?.preflight(event);

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

		// TODO: Fix rate limiter
		// if (await limiter.isLimited(event)) {
		// 	return message(form, 'Too many requests', { status: 429 });
		// }

		const { email } = form.data;

		try {
			const resetLink = await AuthService.getResetPasswordLink(email);
			await EmailService.sendPasswordResetEmail(email, resetLink);
		} catch (err) {
			console.error(err);
		}

		return redirect(
			302,
			'/reset-password',
			{
				type: 'info',
				message:
					"We'll email you a password reset link if your entered email is linked to an account."
			},
			event
		);
	}
};
