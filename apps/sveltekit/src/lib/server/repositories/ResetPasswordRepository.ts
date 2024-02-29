import type { ResetPasswordToken } from '@prisma/client';

export interface ResetPasswordRepository {
	/**
	 * Returns a token by its id
	 * @param tokenId to find
	 * @returns the reset password token object if found, null otherwise
	 */
	findByToken(tokenId: string): Promise<ResetPasswordToken | null>;

	/**
	 * Saves a reset password token to the db
	 * @param token to save
	 * @param userId to save it for
	 * @param expiresAt when the token expires
	 */
	save(token: string, userId: string, expiresAt: Date): Promise<void>;

	/**
	 * Deletes all tokens for the specified user
	 * @param userId to delete tokens for
	 */
	deleteTokens(userId: string): Promise<void>;
}
