import { describe, it, expect, beforeAll, vi } from 'vitest';
import { AuthService } from './AuthService';
import { Argon2id } from 'oslo/password';
import { PEPPER } from '$env/static/private';
import { TimeSpan, createDate } from 'oslo';

let authService: AuthService;
let mockRepo: any;
let mockEmailVerificationRepo: any;
let mockResetPasswordRepo: any;
let mockAuth: any;

beforeAll(async () => {
	mockRepo = {
		findUserByEmail: vi.fn(),
		findUserById: vi.fn(),
		save: vi.fn()
	};
	mockEmailVerificationRepo = {
		save: vi.fn(),
		deleteAll: vi.fn(),
		findByUser: vi.fn()
	};
	mockResetPasswordRepo = {
		deleteTokens: vi.fn()
	};
	mockAuth = {
		createSession: vi.fn(),
		createSessionCookie: vi.fn(),
		createBlankSessionCookie: vi.fn(),
		sessionCookieName: 'auth_session',
		validateSession: vi.fn(),
		invalidateSession: vi.fn()
	};
	authService = new AuthService(
		mockAuth,
		mockRepo,
		mockEmailVerificationRepo,
		mockResetPasswordRepo,
		new Argon2id()
	);
});

describe('Find user', () => {
	it('should return user if the given email is in use', async () => {
		// Mock the repository to return a user
		const email = 'test@user.com';
		mockRepo.findUserByEmail.mockResolvedValue({
			id: 1,
			email,
			hashed_password: 'something'
		});

		const result = await authService.findUser(email);

		expect(mockRepo.findUserByEmail).toHaveBeenCalledWith(email);
		expect(result).toBeTruthy();
		expect(result!.email).toBe(email);
	});

	it('should return null if the given email is not in use', async () => {
		// Mock the repository to return null
		mockRepo.findUserByEmail.mockResolvedValue(null);

		const email = 'test@user.com';
		const result = await authService.findUser(email);

		expect(mockRepo.findUserByEmail).toHaveBeenCalledWith(email);
		expect(result).toBeFalsy();
	});
});

describe('Create user', () => {
	it('should throw an error if the email is already in use', async () => {
		// Mock the repository to return a user
		const email = 'test@user.com';
		mockRepo.findUserByEmail.mockResolvedValue({
			id: 1,
			email,
			hashed_password: 'something'
		});

		try {
			await authService.createUser(email, 'password');
			expect(true).toBe(false);
		} catch (error) {
			expect(true).toBe(true);
		}
	});

	it('should create a new user', async () => {
		const user = {
			id: 1,
			email: 'test@user.com'
		};
		mockRepo.findUserByEmail.mockResolvedValue(null);
		mockRepo.save.mockResolvedValue(user);

		const result = await authService.createUser(user.email, 'password');

		expect(mockRepo.save).toHaveBeenCalledWith(
			expect.objectContaining({
				id: expect.any(String),
				email: user.email,
				hashed_password: expect.any(String),
				salt: expect.any(String)
			})
		);
		expect(result.email).toBe(user.email);
	});
});

describe('Login', () => {
	it('should throw error if email is not registered', async () => {
		mockRepo.findUserByEmail.mockResolvedValue(null);

		const email = 'test@user.com';
		const password = 'password';
		try {
			await authService.login(email, password);
			expect(true).toBe(false);
		} catch (error) {
			if (error instanceof Error) {
				expect(error.message).toBe('Email not found');
			} else {
				expect(true).toBe(false);
			}
		}
	});

	it('should throw error if password is invalid', async () => {
		const email = 'test@user.com';
		const salt = 'salt';
		mockRepo.findUserByEmail.mockResolvedValue({
			id: '1',
			email,
			hashed_password: await new Argon2id().hash('amoresecurepassword' + salt + 'pepper'),
			salt
		});

		try {
			await authService.login(email, 'wrongpassword');
			expect(true).toBe(false);
		} catch (error) {
			if (error instanceof Error) {
				expect(error.message).toBe('Invalid credentials');
			} else {
				expect(true).toBe(false);
			}
		}
	});

	it('should return a session cookie on successful login', async () => {
		const email = 'test@user.com';
		const password = 'password';
		const salt = 'salt';
		mockRepo.findUserByEmail.mockResolvedValue({
			id: '1',
			email,
			hashed_password: await new Argon2id().hash(password + salt + PEPPER),
			salt
		});
		mockAuth.createSession.mockResolvedValue({ id: 'session_1' });
		mockAuth.createSessionCookie.mockReturnValue('cookie');

		try {
			const result = await authService.login(email, password);
			expect(mockAuth.createSession).toHaveBeenCalledWith('1', {});
			expect(mockAuth.createSessionCookie).toHaveBeenCalledWith('session_1');
			expect(result.sessionCookie).toBe('cookie');
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});

describe('Generate email verification code', () => {
	it('should generate a code and save it to the database', async () => {
		const userId = '1';
		const email = 'test@user.com';

		mockEmailVerificationRepo.findByUser.mockResolvedValue(null);

		const code = await authService.generateEmailVerificationCode(userId, email);

		expect(mockEmailVerificationRepo.deleteAll).toHaveBeenCalledWith(userId);
		expect(mockEmailVerificationRepo.save).toHaveBeenCalledWith(
			userId,
			email,
			code,
			expect.any(Date)
		);
		expect(code).toHaveLength(8);
	});

	it('should throw error if a code was generated within the last 30 seconds', async () => {
		const userId = '1';
		const email = 'test@user.com';
		const updatedAt = new Date();

		mockEmailVerificationRepo.findByUser.mockResolvedValue({ updatedAt });

		try {
			await authService.generateEmailVerificationCode(userId, email);
			expect(true).toBe(false);
		} catch (err) {
			expect(true).toBe(true);
		}
	});

	it('should generate code if the previous code was generated more than 30 seconds ago', async () => {
		const userId = '1';
		const email = 'test@user.com';
		const updatedAt = createDate(new TimeSpan(-31, 's'));
		mockEmailVerificationRepo.findByUser.mockResolvedValue({ updatedAt });

		let code = '';
		try {
			code = await authService.generateEmailVerificationCode(userId, email);
		} catch (err) {
			expect(true).toBe(false);
		}

		expect(mockEmailVerificationRepo.deleteAll).toHaveBeenCalledWith(userId);
		expect(mockEmailVerificationRepo.save).toHaveBeenCalledWith(
			userId,
			email,
			code,
			expect.any(Date)
		);
		expect(code).toHaveLength(8);
	});
});

describe('Change password', () => {
	it('should throw error if user is not found', async () => {
		mockRepo.findUserById.mockResolvedValue(null);

		const userId = 'user_1';
		const sessionId = 'session_1';
		const currentPassword = 'old_password';
		const newPassword = 'new_password';

		try {
			await authService.changePassword(userId, sessionId, currentPassword, newPassword);
			expect(true).toBe(false);
		} catch (err) {
			if (err instanceof Error) {
				expect(err.message).toBe('User not found');
			} else {
				expect(true).toBe(false);
			}
		}
	});

	it('should throw error if old password is invalid', async () => {
		const currentPassword = 'current_password';
		const salt = 'salt';
		const user = {
			id: 'user_1',
			email: 'test@user.com',
			hashed_password: await new Argon2id().hash(currentPassword + salt + PEPPER),
			salt
		};
		mockRepo.findUserById.mockResolvedValue(user);

		try {
			await authService.changePassword(user.id, 'session_1', 'wrong_password', 'new_password');
			expect(true).toBe(false);
		} catch (err) {
			if (err instanceof Error) {
				expect(err.message).toBe('Invalid credentials');
			} else {
				expect(true).toBe(false);
			}
		}
	});

	it('should change the password and refresh token', async () => {
		const currentPassword = 'current_password';
		const salt = 'salt';
		const sessionId = 'session_1';
		const user = {
			id: 'user_1',
			email: 'test@user.com',
			hashed_password: await new Argon2id().hash(currentPassword + salt + PEPPER),
			salt
		};
		mockRepo.findUserById.mockResolvedValue(user);

		try {
			await authService.changePassword(user.id, sessionId, currentPassword, 'new_password');
			expect(mockRepo.save).toHaveBeenCalledWith(
				expect.objectContaining({
					id: user.id,
					email: user.email,
					hashed_password: expect.any(String),
					salt: expect.any(String)
				})
			);
			expect(mockAuth.createSessionCookie).toHaveBeenCalledWith(sessionId);
		} catch (err) {
			expect(true).toBe(false);
		}
	});
});
