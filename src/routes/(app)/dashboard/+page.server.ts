import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { subscriptionSchema } from '$lib/schemas/subscription';
import SubscriptionService from '$lib/server/services/SubscriptionService';
import { redirect } from 'sveltekit-flash-message/server';
import type { SubscriptionsDto } from '$lib/dtos/subscription';

// For some reason, ts complains about the event type not being defined.
// This happens only for server files in this route.
//@ts-ignore
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login?redirect=/dashboard');
	}

	// Convert search params to predicates
	const predicate: Record<string, string> = {};

	const sortBy = event.url.searchParams.get('sortBy');
	const order = event.url.searchParams.get('order');

	if (sortBy && order) {
		predicate['sortBy'] = sortBy;
		predicate['order'] = order;
	}

	const page = event.url.searchParams.get('page') ?? 1;
	const pageSize = event.url.searchParams.get('pageSize') ?? 10;
	predicate['page'] = page;
	predicate['pageSize'] = pageSize;

	// Get result
	const result = await SubscriptionService.getAllSubscriptions(event.locals.user.id, predicate);

	// Map to DTO
	const subscriptions = {
		data: result.data.map((item) => ({
			id: item.id,
			company: item.company,
			description: item.description,
			amount: item.amount,
			currency: item.currency,
			period: item.period,
			type: item.type,
			url: item.url
		})),
		totalItems: result.totalItems,
		page,
		pageSize
	} as SubscriptionsDto;

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
