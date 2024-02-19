import type { EmailVerificationCode } from '@prisma/client';

export interface EmailVerificationRepository {
	/**
	 * Saves a new email verification code
	 * @param userId of the user that can use the code
	 * @param email of the user that can use the code
	 * @param code the verification code
	 * @param expiresAt when the code expires
	 */
	save(
		userId: string,
		email: string,
		code: string,
		expiresAt: Date
	): Promise<EmailVerificationCode>;

	/**
	 * Deletes all verification codes for the given user
	 * @param userId of the user
	 */
	deleteAll(userId: string): Promise<void>;
}
