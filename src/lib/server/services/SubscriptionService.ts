import type { Subscription } from '@prisma/client';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import SubscriptionRepositoryImpl from '../repositories/SubscriptionRepositoryImpl';
import { generateId } from 'lucia';

export class SubscriptionService {
	private repo: SubscriptionRepository;

	constructor(repo: SubscriptionRepository) {
		this.repo = repo;
	}

	/**
	 * Adds a subscription to the database
	 * @param userId id of the user who owns the subscription
	 * @param subscription to add
	 * @returns the added subscription
	 */
	public async addSubscription(
		userId: string,
		subscription: Omit<Subscription, 'id' | 'createdAt' | 'userId'>
	) {
		const subscriptionWithId = {
			...subscription,
			id: generateId(15)
		};
		return await this.repo.save(userId, subscriptionWithId);
	}
}

export default new SubscriptionService(SubscriptionRepositoryImpl);
