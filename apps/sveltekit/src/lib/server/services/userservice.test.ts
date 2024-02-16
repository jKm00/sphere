import { beforeAll, describe, expect, it, vi } from 'vitest';
import { UserService } from './UserService';
import { currencies } from '$lib/currency';

let userService: UserService;
let mockRepo: any;
const user = {
	id: '1',
	createdAt: new Date(),
	email: 'test@user.com',
	prefferedCurrency: 'EUR',
	prefferedPeriod: 'monthly',
	hashed_password: 'apodjasd',
	salt: 'apsjdpasd'
};

beforeAll(async () => {
	mockRepo = {
		findUserById: vi.fn(),
		save: vi.fn()
	};
	userService = new UserService(mockRepo);
});

describe('Update currency', () => {
	it('should update the currency for the user', async () => {
		mockRepo.findUserById.mockResolvedValue(user);

		const currency = currencies.find((c) => (c.value = 'USD'));

		await userService.updateCurrency(user.id, currency!.value);

		expect(mockRepo.save).toHaveBeenCalledWith({
			...user,
			prefferedCurrency: currency!.value
		});
	});

	it('should set default value if currency is not available', async () => {
		mockRepo.findUserById.mockResolvedValue(user);

		await userService.updateCurrency(user.id, 'JPY');

		expect(mockRepo.save).toHaveBeenCalledWith({
			...user,
			prefferedCurrency: 'EUR'
		});
	});

	it('should set default value if currency is null', async () => {
		mockRepo.findUserById.mockResolvedValue(user);

		await userService.updateCurrency(user.id, null);

		expect(mockRepo.save).toHaveBeenCalledWith({
			...user,
			prefferedCurrency: 'EUR'
		});
	});

	it('should throw error if user is not found', async () => {
		mockRepo.findUserById.mockResolvedValue(null);

		await expect(userService.updateCurrency(user.id, 'USD')).rejects.toThrow('User not found');
	});
});
