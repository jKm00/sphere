import type { User } from '@prisma/client';

export interface UserRepository {
	/**
	 * Returns a user by the given email
	 * @param email of the user to return
	 * @return given user or null if no user is found
	 */
	findUserByEmail(email: string): Promise<User | null>;

	/**
	 * Returns a user by the given id
	 * @param id of the user to return
	 * @return given user or null if no user if found
	 */
	findUserById(id: string): Promise<User | null>;

	/**
	 * Returns a user by the given GitHub id
	 * @param id of the user to return
	 * @return given user or null if no user if found
	 */
	findUserByGitHubId(id: number): Promise<User | null>;

	/**
	 * Saves the given user to the database
	 * @param user to save
	 */
	save(user: {
		id: string;
		emailVerified: boolean;
		prefferedCurrency: string;
		prefferedPeriod: string;
		email?: string | null;
		hashed_password?: string | null;
		salt?: string | null;
		githubId?: number | null;
		username?: string | null;
	}): Promise<User>;

	/**
	 * Updated the email verified status of the user
	 * @param userId to update
	 * @param verified status to set
	 */
	updateEmailVerified(userId: string, verified: boolean): Promise<void>;

	/**
	 * Updates the password of a specific user
	 * @param userId to update
	 * @param password to set
	 * @param salt to set
	 */
	updatePassword(userId: string, password: string, salt: string): Promise<void>;

	/**
	 * Deletes a user
	 * @param id of user to delete
	 */
	delete(id: string): Promise<void>;
}
