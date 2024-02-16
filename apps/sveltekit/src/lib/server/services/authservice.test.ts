import { describe, it, expect, beforeAll, vi } from 'vitest';
import { AuthService } from './AuthService';
import { Argon2id } from 'oslo/password';
import { PEPPER } from '$env/static/private';

let authService: AuthService;
let mockRepo: any;
let mockAuth: any;

beforeAll(async () => {
	mockRepo = {
		findUserByEmail: vi.fn(),
		save: vi.fn()
	};
	mockAuth = {
		createSession: vi.fn(),
		createSessionCookie: vi.fn(),
		createBlankSessionCookie: vi.fn(),
		sessionCookieName: 'auth_session',
		validateSession: vi.fn(),
		invalidateSession: vi.fn()
	};
	authService = new AuthService(mockAuth, mockRepo, new Argon2id());
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
			const session = await authService.login(email, password);
			expect(mockAuth.createSession).toHaveBeenCalledWith('1', {});
			expect(mockAuth.createSessionCookie).toHaveBeenCalledWith('session_1');
			expect(session).toBe('cookie');
		} catch (error) {
			expect(true).toBe(false);
		}
	});
});
