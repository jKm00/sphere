import { beforeAll, describe, vi, it, expect } from 'vitest';
import { SubscriptionService } from './SubscriptionService';

let subscriptionSerivce: SubscriptionService;
let mockSubscriptionRepo: any;
let mockUserRepo: any;
let mockFxRatesRepo: any;

beforeAll(async () => {
	mockSubscriptionRepo = {
		save: vi.fn(),
		findAll: vi.fn(),
		getCount: vi.fn(),
		deleteAll: vi.fn()
	};
	mockUserRepo = {
		findUserById: vi.fn()
	};
	mockFxRatesRepo = {
		getFxRates: vi.fn()
	};
	subscriptionSerivce = new SubscriptionService(
		mockSubscriptionRepo,
		mockUserRepo,
		mockFxRatesRepo
	);
});

describe('Get subscriptions', () => {
	it('should throw error if user is not found', async () => {
		mockUserRepo.findUserById.mockResolvedValue(null);

		try {
			await subscriptionSerivce.getSubscriptions('userId');
			expect(true).toBe(false);
		} catch (err) {
			if (err instanceof Error) {
				expect(err.message).toBe('User not found');
			} else {
				expect(true).toBe(false);
			}
		}
	});

	// This might be a redundent test, keeping it for now
	it('should return a list of subscriptions and the total number of subscriptions', async () => {
		mockUserRepo.findUserById.mockResolvedValue({ id: 'userId' });
		mockSubscriptionRepo.findAll.mockResolvedValue([{}, {}]);
		mockSubscriptionRepo.getCount.mockResolvedValue(2);

		const result = await subscriptionSerivce.getSubscriptions('userId');

		expect(result.data).toHaveLength(2);
		expect(result.totalItems).toBe(2);
	});
});
