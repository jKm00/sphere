import { z } from 'zod';

export const emailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required ' })
		.email({ message: 'Must be a valid email' })
});

export type EmailSchema = typeof emailSchema;

export const verifyEmail = z.object({
	code: z.string().regex(/^\d{8}$/, { message: 'Must be a 8 digit code' })
});

export type VerifyEmail = typeof verifyEmail;
