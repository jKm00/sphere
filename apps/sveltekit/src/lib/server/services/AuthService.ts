import { APP_URL, PEPPER } from '$env/static/private';
import { alphabet, generateRandomString } from 'oslo/crypto';
import type { UserRepository } from '../repositories/UserRepository';
import UserRepositoryImpl from '../repositories/UserRepositoryImpl';
import { Argon2id } from 'oslo/password';
import { Cookie, Lucia, generateId } from 'lucia';
import { auth, github } from '../auth';
import type { EmailVerificationRepository } from '../repositories/EmailVerificationRepository';
import EmailVerificationRepositoryImpl from '../repositories/EmailVerificationRepositoryImpl';
import { TimeSpan, createDate } from 'oslo';
import dayjs from 'dayjs';
import type { ResetPasswordRepository } from '../repositories/ResetPasswordRepository';
import ResetPasswordRepositoryImpl from '../repositories/ResetPasswordRepositoryImpl';
import { GitHub } from 'arctic';

export class AuthService {
	private auth;
	private userRepo;
	private emailVerificationRepo;
	private resetPasswordRepo;
	private hasher;
	private github;

	constructor(
		auth: Lucia,
		userRepo: UserRepository,
		emailVerificationRepo: EmailVerificationRepository,
		resetPasswordRepo: ResetPasswordRepository,
		hasher: Argon2id,
		github: GitHub
	) {
		this.auth = auth;
		this.userRepo = userRepo;
		this.emailVerificationRepo = emailVerificationRepo;
		this.resetPasswordRepo = resetPasswordRepo;
		this.hasher = hasher;
		this.github = github;
	}

	/**
	 * Returns the user with the given email or null if the email is not in use
	 * @param email to check
	 * @returns user if email is taken, null otherwise
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
		const existingVerification = await this.emailVerificationRepo.findByUser(userId);

		if (existingVerification) {
			const diff = dayjs().diff(existingVerification.updatedAt, 'seconds');

			const waitTime = 30;

			if (diff < waitTime) {
				throw new Error(
					`Please wait ${waitTime - diff} seconds before requesting a new verification code`
				);
			}
		}

		await this.emailVerificationRepo.deleteAll(userId);

		const code = generateRandomString(8, alphabet('0-9'));
		const expiresAt = createDate(new TimeSpan(5, 'm'));
		await this.emailVerificationRepo.save(userId, email, code, expiresAt);

		return code;
	}

	/**
	 * Verifies the email verification code.
	 * @param userId to verify
	 * @param code the check
	 * @returns a session cookie if the code is valie.
	 * @throws Error if the code is invalid or expired
	 */
	public async verifyEmailVerificationCode(userId: string, code: string) {
		const verificationCode = await this.emailVerificationRepo.findByUserAndCode(userId, code);

		if (!verificationCode || verificationCode.code !== code) {
			throw new Error('Invalid verification code');
		}

		if (dayjs(verificationCode.expiresAt).isBefore(dayjs())) {
			throw new Error('Verification code expired');
		}

		await this.userRepo.updateEmailVerified(userId, true);

		await this.auth.invalidateUserSessions(userId);
		const sessionCookie = await this.createSession(userId);

		return sessionCookie;
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
		if (!hashed_password || !salt) {
			throw new Error('Email used with GitHub sign in');
		}

		const validPassword = await this.hasher.verify(hashed_password, password + salt + PEPPER);
		if (!validPassword) {
			throw new Error('Invalid credentials');
		}

		return { user, sessionCookie: await this.createSession(user.id) };
	}

	// TODO: Test
	/**
	 * Signs in with GitHub
	 * @param code to sign in with
	 */
	public async signInWithGitHub(code: string) {
		const tokens = await this.github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser = await githubUserResponse.json();

		const existingUser = await this.userRepo.findUserByGitHubId(githubUser.id);

		let session: Cookie;
		if (existingUser) {
			session = await this.createSession(existingUser.id);
		} else {
			const userId = generateId(15);

			await this.userRepo.save({
				id: userId,
				emailVerified: true,
				prefferedCurrency: 'USD',
				prefferedPeriod: 'month',
				githubId: githubUser.id,
				username: githubUser.login
			});

			session = await this.createSession(userId);
		}

		return session;
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

		if (!hashed_password || !salt) {
			throw new Error('Signed in with GitHub, cannot change password!');
		}

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
	 * Creates a reset password link
	 * @param email of the user to reset the password for
	 * @returns a reset password link
	 * @throws Error if the email is not found
	 */
	public async getResetPasswordLink(email: string) {
		const user = await this.findUser(email);
		if (!user || !user.emailVerified) {
			throw new Error('Email not found');
		}

		const resetPasswordToken = await this.generatePasswordResetToken(user.id);
		const resetPasswordLink = `${APP_URL}/reset-password/${resetPasswordToken}`;

		return resetPasswordLink;
	}

	/**
	 * Generates a reset password token for a specific user
	 * @param userId id of the user to generate the token for
	 * @return the generated token
	 */
	private async generatePasswordResetToken(userId: string) {
		// Invalidate existing tokens
		await this.resetPasswordRepo.deleteTokens(userId);

		// Create new token
		const tokenId = generateId(40);
		await this.resetPasswordRepo.save(tokenId, userId, createDate(new TimeSpan(2, 'h')));

		return tokenId;
	}

	/**
	 * Resets the password of a user
	 * @param token reset password token used to verify the user
	 * @param newPassword password to update to
	 * @throws Error if the token is invalid or expired
	 */
	public async resetPassword(token: string, newPassword: string) {
		// Verify token
		const foundToken = await this.resetPasswordRepo.findByToken(token);
		if (!foundToken) {
			throw new Error('Invalid token');
		}
		if (dayjs(foundToken.expiresAt).isBefore(dayjs())) {
			throw new Error('Token expired');
		}

		// Delete the token
		await this.resetPasswordRepo.deleteTokens(foundToken.userId);

		await this.auth.invalidateSession(foundToken.userId);
		const [hashedPassword, salt] = await this.generateHashedPassword(newPassword);
		await this.userRepo.updatePassword(foundToken.userId, hashedPassword, salt);
	}

	/**
	 * Returns a session cookie for a given user
	 * @param userId to create session for
	 * @returns session cookie
	 */
	public async createSession(userId: string) {
		const session = await this.auth.createSession(userId, {});
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
	ResetPasswordRepositoryImpl,
	new Argon2id(),
	github
);
