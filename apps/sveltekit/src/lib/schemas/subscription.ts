import { z } from 'zod';

export const subscriptionSchema = z.object({
	id: z.string().optional(),
	company: z.string({ required_error: 'Company is required' }).min(1, 'Company is required'),
	description: z.string().optional(),
	amount: z
		.number({ required_error: 'Amount is required' })
		.min(0, 'Amount is required')
		.max(99999, 'Too large amount'),
	currency: z.string({ required_error: 'Currency is required' }).min(1, 'Currency is required'),
	period: z.string({ required_error: 'Period is required' }).min(1, 'Period is required'),
	type: z.string({ required_error: 'Type is required' }).min(1, 'Type is required'),
	url: z.string().optional()
});

export type SubscriptionSchema = typeof subscriptionSchema;

export const deleteSubscriptionsSchema = z.object({
	ids: z.string({ required_error: 'Ids are required' }).min(1, 'Ids are required')
});

export type DeleteSubscriptionsSchema = typeof deleteSubscriptionsSchema;
