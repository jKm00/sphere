import { PEPPER } from '$env/static/private';
import { alphabet, generateRandomString } from 'oslo/crypto';
import type { UserRepository } from '../repositories/UserRepository';
import UserRepositoryImpl from '../repositories/UserRepositoryImpl';
import { Argon2id } from 'oslo/password';
import { Lucia, generateId } from 'lucia';
import type { User } from '@prisma/client';
import { auth } from '../auth';
import type { RequestEvent } from '@sveltejs/kit';

export class AuthService {
	private auth;
	private repo;
	private hasher;

	constructor(auth: Lucia, repo: UserRepository, hasher: Argon2id) {
		this.auth = auth;
		this.repo = repo;
		this.hasher = hasher;
	}

	/**
	 * Returns the user with the given email or null if the email is not in use
	 * @param email to check
	 * @returns true if email is taken, false otherwise
	 */
	public async findUser(email: string) {
		return await this.repo.findUserByEmail(email);
	}

	/**
	 * Creates a new user
	 * @param email of the user
	 * @param password of the user
	 * @throws Error if the email is already in use, or if the user cannot be created
	 */
	public async createUser(email: string, password: string) {
		const user = await this.findUser(email);
		if (user) {
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

	/**
	 * Returns a session cookie if the email and password are valid
	 * @param email of the user
	 * @param password of the user
	 * @returns a session cookie
	 * @throws Error if the email is not found or if the password is invalid
	 */
	public async login(email: string, password: string) {
		const user = await this.findUser(email);
		if (!user) {
			throw new Error('Email not found');
		}

		const { hashed_password, salt } = user;
		const validPassword = await this.hasher.verify(hashed_password, password + salt + PEPPER);
		if (!validPassword) {
			throw new Error('Invalid credentials');
		}

		return await this.createSession(user);
	}

	/**
	 * Returns a session cookie for a given user
	 * @param user to create session for
	 * @returns session cookie
	 */
	private async createSession(user: User) {
		const session = await this.auth.createSession(user.id, {});
		const sessionCookie = this.auth.createSessionCookie(session.id);
		return sessionCookie;
	}

	/**
	 * Refreshes the session cookie
	 * @param sessionId id of the session to refresh
	 * @returns a new session cookie
	 */
	public refreshSession(sessionId: string) {
		return this.auth.createSessionCookie(sessionId);
	}

	/**
	 * Returns a blank session cookie
	 * @returns a blank session
	 */
	public createBlankSessionCookie() {
		return this.auth.createBlankSessionCookie();
	}

	/**
	 * Returns the name of the cookie used for sessions
	 * @returns name of cookie
	 */
	public getSessionCookieName() {
		return this.auth.sessionCookieName;
	}

	/**
	 * Checks if the session is valid
	 * @param sessionId of the session to validate
	 * @returns a session and user if the session is valid
	 */
	public async validateSession(sessionId: string) {
		const { session, user } = await this.auth.validateSession(sessionId);
		return { session, user };
	}

	/**
	 * Logs out a user
	 * @param sessionId id of the session to invalidate
	 * @returns a blank session cookie used to overwrite the current session cookie
	 */
	public async logout(sessionId: string) {
		await this.auth.invalidateSession(sessionId);
		return this.createBlankSessionCookie();
	}
}

export default new AuthService(auth, UserRepositoryImpl, new Argon2id());
