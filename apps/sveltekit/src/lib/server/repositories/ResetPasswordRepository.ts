export interface ResetPasswordRepository {
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
