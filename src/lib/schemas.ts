import { z } from 'zod';

export const authSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, { message: 'Password must be at least 8 characters long' })
});
