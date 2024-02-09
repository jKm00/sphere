import { z } from 'zod';

// Email, password and passwordConfirm are required
export const signUpSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Must be a valid email' }),
		password: z
			.string({ required_error: 'Password is required' })
			.regex(
				new RegExp('^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,}$'),
				'Password must match the requirements.'
			),
		passwordConfirm: z
			.string({ required_error: 'Need to confirm password' })
			.regex(
				new RegExp('^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,}$'),
				'Password must match the requirements.'
			)
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords and confirm password must match',
				path: ['passwordConfirm']
			}),
				ctx.addIssue({
					code: 'custom',
					message: 'Passwords and confirm password must match',
					path: ['password']
				});
		}
	});

export type SignUpSchema = typeof signUpSchema;
