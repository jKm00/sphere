import type { User } from '@prisma/client';

export interface UserRepository {
	/**
	 * Returns a user by the given email
	 * @param email of the user to return
	 * @return given user or null is no user is found
	 */
	findUserByEmail(email: string): Promise<User | null>;

	/**
	 * Saves the given user to the database
	 * @param user to save
	 */
	save(user: User): Promise<User>;
}
