import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required ' })
		.email({ message: 'Must be a valid email' }),
	password: z
		.string({ required_error: 'Password is required' })
		.regex(
			new RegExp('^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,}$'),
			'Password must match the requirements.'
		)
});

export type LoginSchema = typeof loginSchema;
