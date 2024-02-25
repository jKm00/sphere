import type { EmailVerificationCode } from '@prisma/client';

export interface EmailVerificationRepository {
	/**
	 * Find a verification code by user
	 * @param userId id of the user
	 */
	findByUser(userId: string): Promise<EmailVerificationCode | null>;

	/**
	 * Finds a verification code by user and code
	 * @param userId id of the user
	 * @param code to find
	 */
	findByUserAndCode(userId: string, code: string): Promise<EmailVerificationCode | null>;

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
