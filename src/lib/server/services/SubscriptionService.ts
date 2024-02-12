import type { Subscription } from '@prisma/client';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import SubscriptionRepositoryImpl from '../repositories/SubscriptionRepositoryImpl';
import { generateId } from 'lucia';
import { random } from 'oslo/crypto';

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
	public async saveSubscription(
		userId: string,
		id: string | undefined,
		subscription: Omit<Subscription, 'id' | 'createdAt' | 'userId'>
	) {
		// TODO: Check if this is a good way to generate ids.
		// For now I think it is, because to identify a subscription
		// you not only need the subscription id, you also need
		// the user id
		const subId = id ?? Math.floor(random() * 100000).toString();
		const subscriptionWithId = {
			...subscription,
			id: subId
		};
		return await this.repo.save(userId, subscriptionWithId);
	}

	/**
	 * Returns all subscriptions for a given user matching the given predicates
	 * @param userId id of the user
	 * @param predicate sortBy, order, page, and pageSize
	 * @returns and object with a list of all subscriptions matching the predicates
	 * and the total number of subscriptions for the user
	 */
	public async getAllSubscriptions(userId: string, predicate?: Record<string, string>) {
		return {
			data: await this.repo.findAll(userId, predicate),
			totalItems: await this.repo.getCount(userId)
		};
	}

	/**
	 * Deletes the subscriptions with the given ids
	 * @param userId owner of the subscriptions
	 * @param ids an array containing the ids of the subscriptions to delete
	 */
	public async deleteSubscriptions(userId: string, ids: string[]) {
		return await this.repo.deleteAll(userId, ids);
	}
}

export default new SubscriptionService(SubscriptionRepositoryImpl);
