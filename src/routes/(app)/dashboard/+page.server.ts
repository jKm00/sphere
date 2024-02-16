import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { deleteSubscriptionsSchema, subscriptionSchema } from '$lib/schemas/subscription';
import SubscriptionService from '$lib/server/services/SubscriptionService';
import { redirect } from 'sveltekit-flash-message/server';
import type { SingleSubscriptionDto, SubscriptionsDto } from '$lib/dtos/subscription';
import { getRedirectUrl } from '$lib/server/utils';
import UserService from '$lib/server/services/UserService';

// For some reason, ts complains about the event type not being defined.
// This happens only for server files in this route.
//@ts-ignore
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login?redirect=/dashboard');
	}

	async function fetchSubscriptions() {
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
		let result: {
			data: SingleSubscriptionDto[];
			totalItems: number;
			totalSum: number;
			mostExpensiveSub: SingleSubscriptionDto | undefined;
		};
		try {
			result = await SubscriptionService.getAllSubscriptions(event.locals.user.id, predicate);
		} catch (err) {
			return {
				data: [],
				totalSum: 0,
				totalItems: 0,
				page,
				pageSize,
				mostExpensiveSub: undefined
			} as SubscriptionsDto;
		}

		// Map to DTO
		return {
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
			totalSum: result.totalSum,
			totalItems: result.totalItems,
			page,
			pageSize,
			mostExpensiveSub: result.mostExpensiveSub
		} as SubscriptionsDto;
	}

	const [subscriptionForm, deleteSubscriptionsForm, subscriptions] = await Promise.all([
		superValidate(subscriptionSchema),
		superValidate(deleteSubscriptionsSchema),
		fetchSubscriptions()
	]);

	return {
		subscriptionForm,
		deleteSubscriptionsForm,
		subscriptions
	};
};

export const actions = {
	saveSubscription: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/dashboard');
		}

		const form = await superValidate(event, subscriptionSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { id, company, description, amount, currency, period, type, url } = form.data;

		try {
			SubscriptionService.saveSubscription(
				event.locals.user.id,
				id === 'undefined' ? undefined : id,
				{
					company,
					description: description ?? '',
					amount,
					currency,
					period,
					type,
					url: url ?? ''
				}
			);
		} catch (e) {
			return message(form, 'Failed to add subscription. Please try again!', {
				status: 500
			});
		}

		const redirectTo = getRedirectUrl(event.url.searchParams.get('redirectTo'), '/dashboard');

		redirect(
			302,
			redirectTo,
			{
				type: 'success',
				message: 'Subscription saved!'
			},
			event
		);
	},
	deleteSubscriptions: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/dashboard');
		}

		const form = await superValidate(event, deleteSubscriptionsSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const redirectTo = getRedirectUrl(event.url.searchParams.get('redirectTo'), '/dashboard');

		const { ids } = form.data;
		const items = ids.split(',');

		try {
			await SubscriptionService.deleteSubscriptions(event.locals.user.id, items);
		} catch (error) {
			redirect(
				302,
				redirectTo,
				{
					type: 'error',
					message: 'Failed to delete subscriptions. Please try again!'
				},
				event
			);
		}

		redirect(
			302,
			redirectTo,
			{
				type: 'success',
				message: 'Subscriptions deleted!'
			},
			event
		);
	},
	updateCurrency: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirect=/dashboard');
		}

		const form = await event.request.formData();
		const currency = form.get('currency');

		const redirectTo = getRedirectUrl(event.url.searchParams.get('redirectTo'), '/dashboard');

		try {
			UserService.updateCurrency(event.locals.user.id, `${currency}`);
		} catch (error) {
			redirect(
				302,
				redirectTo,
				{
					type: 'error',
					message: 'Failed to update preffered currency. Please try again!'
				},
				event
			);
		}

		redirect(
			302,
			redirectTo,
			{
				type: 'success',
				message: 'Preffered currency updated!'
			},
			event
		);
	}
};
