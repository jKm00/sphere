import { z } from 'zod';

export const emailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required ' })
		.email({ message: 'Must be a valid email' })
});

export type EmailSchema = typeof emailSchema;

export const verifyEmail = z.object({
	code: z
		.number({ required_error: 'Code is required' })
		.int()
		.gte(10000000, { message: 'Needs to be 8 digits' })
		.lte(99999999, { message: 'Needs to be 8 digits' })
});

export type VerifyEmail = typeof verifyEmail;
