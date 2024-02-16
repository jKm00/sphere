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
	 * Saves the given user to the database
	 * @param user to save
	 */
	save(user: Omit<User, 'createdAt'>): Promise<User>;
}
