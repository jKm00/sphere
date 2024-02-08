import { PEPPER } from '$env/static/private';
import { alphabet, generateRandomString } from 'oslo/crypto';
import type { UserRepository } from '../repositories/UserRepository';
import UserRepositoryImpl from '../repositories/UserRepositoryImpl';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

export class AuthService {
	private repo;
	private hasher;

	constructor(repo: UserRepository, hasher: Argon2id) {
		this.repo = repo;
		this.hasher = hasher;
	}

	/**
	 * Returns true if the given email is already in use
	 * @param email to check
	 * @returns true if email is taken, false otherwise
	 */
	public async emailTaken(email: string) {
		const user = await this.repo.findUserByEmail(email);
		return user !== null;
	}

	/**
	 * Creates a new user
	 * @param email of the user
	 * @param password of the user
	 * @throws Error if the email is already in use, or if the user cannot be created
	 */
	public async createUser(email: string, password: string) {
		if (await this.emailTaken(email)) {
			throw new Error('Email already in use');
		}

		const userId = generateId(15);
		const [hashedPassword, salt] = await this.generateHashedPassword(password);

		return await this.repo.save({
			id: userId,
			email,
			hashed_password: hashedPassword,
			salt
		});
	}

	/**
	 * Generates a hashed password with salt and pepper
	 * @param password to be hashed
	 * @returns a tuple where the first element is the hashed password and the second is the salt
	 */
	private async generateHashedPassword(password: string) {
		const salt = generateRandomString(16, alphabet('a-z', '0-9'));
		const pepper = PEPPER;
		const hashedPassword = await this.hasher.hash(password + salt + pepper);
		return [hashedPassword, salt];
	}
}

export default new AuthService(UserRepositoryImpl, new Argon2id());
