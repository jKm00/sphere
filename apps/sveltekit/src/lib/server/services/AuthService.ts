import { PEPPER } from '$env/static/private';
import { alphabet, generateRandomString } from 'oslo/crypto';
import type { UserRepository } from '../repositories/UserRepository';
import UserRepositoryImpl from '../repositories/UserRepositoryImpl';
import { Argon2id } from 'oslo/password';
import { Lucia, generateId } from 'lucia';
import type { User } from '@prisma/client';
import { auth } from '../auth';
import type { EmailVerificationRepository } from '../repositories/EmailVerificationRepository';
import EmailVerificationRepositoryImpl from '../repositories/EmailVerificationRepositoryImpl';
import { TimeSpan, createDate } from 'oslo';

export class AuthService {
	private auth;
	private userRepo;
	private emailVerificationRepo;
	private hasher;

	constructor(
		auth: Lucia,
		userRepo: UserRepository,
		emailVerificationRepo: EmailVerificationRepository,
		hasher: Argon2id
	) {
		this.auth = auth;
		this.userRepo = userRepo;
		this.emailVerificationRepo = emailVerificationRepo;
		this.hasher = hasher;
	}

	/**
	 * Returns the user with the given email or null if the email is not in use
	 * @param email to check
	 * @returns true if email is taken, false otherwise
	 */
	public async findUser(email: string) {
		return await this.userRepo.findUserByEmail(email);
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

		return await this.userRepo.save({
			id: userId,
			email,
			emailVerified: false,
			prefferedCurrency: 'USD',
			prefferedPeriod: 'month',
			hashed_password: hashedPassword,
			salt
		});
	}

	/**
	 * Generates a verification code for the given email
	 * @param userId of the user to generate the code for
	 * @param email of the user to generate the code for
	 * @returns the generated verification code
	 */
	public async generateEmailVerificationCode(userId: string, email: string) {
		await this.emailVerificationRepo.deleteAll(userId);

		const code = generateRandomString(8, alphabet('0-9'));
		const expiresAt = createDate(new TimeSpan(5, 'm'));
		await this.emailVerificationRepo.save(userId, email, code, expiresAt);

		return code;
	}

	/**
	 * Generates a hashed password with salt and pepper
	 * @param password to be hashed
	 * @returns a tuple where the first element is the hashed password and the second is the salt
	 */
	private async generateHashedPassword(password: string) {
		const salt = generateRandomString(16, alphabet('a-z', '0-9'));
		const hashedPassword = await this.hasher.hash(password + salt + PEPPER);
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

		return { user, sessionCookie: await this.createSession(user) };
	}

	/**
	 * Change the password of a user
	 * @param userId of the user to change the password for
	 * @param sessionId of the session to update
	 * @param currentPassword current password of the user
	 * @param newPassword the password to update to
	 * @returns a session cookie
	 */
	public async changePassword(
		userId: string,
		sessionId: string,
		currentPassword: string,
		newPassword: string
	) {
		const user = await this.userRepo.findUserById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const { hashed_password, salt } = user;
		const validPassword = await this.hasher.verify(
			hashed_password,
			currentPassword + salt + PEPPER
		);

		if (!validPassword) {
			throw new Error('Invalid credentials');
		}

		const [newHashedPassword, newSalt] = await this.generateHashedPassword(newPassword);

		await this.userRepo.save({
			...user,
			hashed_password: newHashedPassword,
			salt: newSalt
		});

		return this.refreshSession(sessionId);
	}

	/**
	 * Returns a session cookie for a given user
	 * @param user to create session for
	 * @returns session cookie
	 */
	public async createSession(user: User) {
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

export default new AuthService(
	auth,
	UserRepositoryImpl,
	EmailVerificationRepositoryImpl,
	new Argon2id()
);
