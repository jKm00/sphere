import { z } from 'zod';

export const passwordSchema = z
	.object({
		currentPassword: z.string({ required_error: 'Current password is required' }),
		newPassword: z
			.string({ required_error: 'Password is required' })
			.regex(
				new RegExp('^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,}$'),
				'Password must match the requirements.'
			),
		confirmPassword: z
			.string({ required_error: 'Need to confirm password' })
			.regex(
				new RegExp('^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,}$'),
				'Password must match the requirements.'
			)
	})
	.superRefine(({ confirmPassword, newPassword }, ctx) => {
		if (confirmPassword !== newPassword) {
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

export type PasswordSchema = typeof passwordSchema;
