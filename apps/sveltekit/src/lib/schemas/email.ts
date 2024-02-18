import { z } from 'zod';

export const emailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required ' })
		.email({ message: 'Must be a valid email' })
});

export type EmailSchema = typeof emailSchema;
