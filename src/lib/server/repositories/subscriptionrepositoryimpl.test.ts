import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { SubscriptionRepository } from './SubscriptionRepository';
import { SubscriptionRepositoryImpl } from './SubscriptionRepositoryImpl';

let repo: SubscriptionRepository;
let mockDb: any;

beforeAll(() => {
	mockDb = {
		subscription: {
			findMany: vi.fn()
		}
	};
	repo = new SubscriptionRepositoryImpl(mockDb);
});

describe('Find all', () => {
	it('should return 10 first subscriptions if no predicate is given', async () => {
		const userId = 'userId';

		await repo.findAll(userId);

		expect(mockDb.subscription.findMany).toHaveBeenCalledWith({
			where: {
				userId
			},
			orderBy: [{}],
			skip: 0,
			take: 10
		});
	});

	it('should sort by given column', async () => {
		const userId = 'userId';
		const predicate = {
			sortBy: 'company',
			order: 'asc'
		};

		await repo.findAll(userId, predicate);

		expect(mockDb.subscription.findMany).toHaveBeenCalledWith({
			where: {
				userId
			},
			orderBy: [{ company: 'asc' }],
			skip: 0,
			take: 10
		});
	});

	it('should return correct page', async () => {
		const userId = 'userId';
		const predicate = {
			page: '2',
			pageSize: '20'
		};

		await repo.findAll(userId, predicate);

		expect(mockDb.subscription.findMany).toHaveBeenCalledWith({
			where: {
				userId
			},
			orderBy: [{}],
			skip: 20,
			take: 20
		});
	});

	it('should return first page if page and page size are invalid numbers', async () => {
		const userId = 'userId';
		const predicate = {
			page: 'invalid',
			pageSize: 'invalid'
		};

		await repo.findAll(userId, predicate);

		expect(mockDb.subscription.findMany).toHaveBeenCalledWith({
			where: {
				userId
			},
			orderBy: [{}],
			skip: 0,
			take: 10
		});
	});

	it('should return correct subscriptions with full predicate', async () => {
		const userId = 'userId';
		const predicate = {
			sortBy: 'amount',
			order: 'desc',
			page: '5',
			pageSize: '5'
		};

		await repo.findAll(userId, predicate);

		expect(mockDb.subscription.findMany).toHaveBeenCalledWith({
			where: {
				userId
			},
			orderBy: [{ amount: 'desc' }],
			skip: 20,
			take: 5
		});
	});
});
