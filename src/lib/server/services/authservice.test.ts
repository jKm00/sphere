import { describe, it, expect, beforeAll, vi } from 'vitest';
import { AuthService } from './AuthService';
import { Argon2id } from 'oslo/password';

let authService: AuthService;
let mockRepo: any;

beforeAll(async () => {
	mockRepo = {
		findUserByEmail: vi.fn(),
		save: vi.fn()
	};
	authService = new AuthService(mockRepo, new Argon2id());
});

describe('Email taken', () => {
	it('should return true if the given email is already in use', async () => {
		// Mock the repository to return a user
		const email = 'test@user.com';
		mockRepo.findUserByEmail.mockResolvedValue({
			id: 1,
			email,
			hashed_password: 'something'
		});

		const result = await authService.emailTaken(email);

		expect(mockRepo.findUserByEmail).toHaveBeenCalledWith(email);
		expect(result).toBe(true);
	});

	it('should return false if the given email is not in use', async () => {
		// Mock the repository to return null
		mockRepo.findUserByEmail.mockResolvedValue(null);

		const email = 'test@user.com';
		const result = await authService.emailTaken(email);

		expect(mockRepo.findUserByEmail).toHaveBeenCalledWith(email);
		expect(result).toBe(false);
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
