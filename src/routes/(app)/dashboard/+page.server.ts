import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { subscriptionSchema } from '$lib/schemas/subscription';
import SubscriptionService from '$lib/server/services/SubscriptionService';
import { redirect } from 'sveltekit-flash-message/server';
import type { SubscriptionDto } from '$lib/dtos/subscription';

// For some reason, ts complains about the event type not being defined.
// This happens only for server files in this route.
//@ts-ignore
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login?redirect=/dashboard');
	}

	// TODO: Fetch from database with filters from url
	console.log(event.url);
	const subscriptions = [
		{
			id: '1',
			company: 'Netflix',
			description: 'Streaming service',
			amount: 10,
			currency: 'USD',
			period: 'Monthly',
			type: 'Streaming',
			url: 'https://www.netflix.com'
		},
		{
			id: '2',
			company: 'Spotify',
			description: 'Music streaming service',
			amount: 79,
			currency: 'NOK',
			period: 'Monthly',
			type: 'Music',
			url: 'https://www.spotify.com'
		}
	] as SubscriptionDto[];

	return {
		subscriptionForm: await superValidate(subscriptionSchema),
		subscriptions
	};
};

export const actions = {
	addSubscription: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/dashboard');
		}

		const form = await superValidate(event, subscriptionSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { company, description, amount, currency, period, type, url } = form.data;

		try {
			SubscriptionService.addSubscription(event.locals.user.id, {
				company,
				description: description ?? '',
				amount,
				currency,
				period,
				type,
				url: url ?? ''
			});
		} catch (e) {
			return message(form, 'Failed to add subscription', {
				status: 500
			});
		}

		redirect(
			302,
			'/dashboard',
			{
				type: 'success',
				message: 'Successfully added subscription!'
			},
			event
		);
	}
};
