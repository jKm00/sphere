import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { deleteSubscriptionsSchema, subscriptionSchema } from '$lib/schemas/subscription';
import SubscriptionService from '$lib/server/services/SubscriptionService';
import { redirect } from 'sveltekit-flash-message/server';
import type { DerivedDto, SingleSubscriptionDto, SubscriptionsDto } from '$lib/dtos/subscription';
import { getRedirectUrl } from '$lib/server/utils';
import UserService from '$lib/server/services/UserService';

// For some reason, ts complains about the event type not being defined.
// This happens only for server files in this route.
//@ts-ignore
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login?redirectTo=/dashboard');
	}

	if (!event.locals.user.emailVerified) {
		redirect(302, '/verify-email?redirectTo=/dashboard');
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
		let subs: {
			data: SingleSubscriptionDto[];
			totalItems: number;
		};
		try {
			subs = await SubscriptionService.getSubscriptions(event.locals.user.id, predicate);
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
			data: subs.data.map((item) => ({
				id: item.id,
				company: item.company,
				description: item.description,
				amount: item.amount,
				currency: item.currency,
				period: item.period,
				type: item.type,
				url: item.url
			})),
			totalItems: subs.totalItems,
			page,
			pageSize
		} as SubscriptionsDto;
	}

	async function fetchDerivedData() {
		let derived: {
			totalSum: number;
			mostExpensiveSub: SingleSubscriptionDto | undefined;
		};
		try {
			derived = await SubscriptionService.getDerivedData(event.locals.user.id);
		} catch (err) {
			return {
				totalSum: 0,
				mostExpensiveSub: undefined
			};
		}

		return derived as DerivedDto;
	}

	const [subscriptionForm, deleteSubscriptionsForm, subscriptions, derived] = await Promise.all([
		superValidate(subscriptionSchema),
		superValidate(deleteSubscriptionsSchema),
		fetchSubscriptions(),
		fetchDerivedData()
	]);

	return {
		subscriptionForm,
		deleteSubscriptionsForm,
		subscriptions,
		derived
	};
};

export const actions = {
	saveSubscription: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirectTo=/dashboard');
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
			redirect(302, '/login?redirectTo=/dashboard');
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
			redirect(302, '/login?redirectTo=/dashboard');
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
				type: 'info',
				message: 'Preffered currency updated!'
			},
			event
		);
	},
	updatePeriod: async (event) => {
		if (!event.locals.user) {
			redirect(302, '/login?redirectTo=/dashboard');
		}

		const form = await event.request.formData();
		const period = form.get('period');

		const redirectTo = getRedirectUrl(event.url.searchParams.get('redirectTo'), '/dashboard');

		try {
			UserService.updatePeriod(event.locals.user.id, `${period}`);
		} catch (error) {
			redirect(
				302,
				redirectTo,
				{
					type: 'error',
					message: 'Failed to update preffered period. Please try again!'
				},
				event
			);
		}

		redirect(
			302,
			redirectTo,
			{
				type: 'info',
				message: 'Preffered period updated!'
			},
			event
		);
	}
};
