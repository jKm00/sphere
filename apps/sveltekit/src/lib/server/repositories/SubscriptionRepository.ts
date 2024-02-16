import type { Subscription } from '@prisma/client';

export interface SubscriptionRepository {
	/**
	 * Saves a subscription to the database.
	 * @param userId id of the user who owns the subscription
	 * @param subscription to save
	 * @returns the saved subscription
	 */
	save(
		userId: string,
		subscription: Omit<Subscription, 'createdAt' | 'userId'>
	): Promise<Subscription>;

	/**
	 * Returns all subscriptions for the given user matching the predicates
	 * @param userId to find subscriptions for
	 * @param sortBy which column to sort by
	 * @param order in which to sort by ('asc' or 'desc')
	 * @returns a list of all subscriptions
	 */
	findAll(userId: string, predicate?: Record<string, string>): Promise<Subscription[]>;

	/**
	 * Returns the number of subscriptions for the given user
	 * @param userId to count subscriptions
	 */
	getCount(userId: string): Promise<number>;

	/**
	 * Deletes the subscriptions with the given ids.
	 * The subscriptions must belong to the given user
	 * @param userId owner of the subscriptions
	 * @param ids of the subscriptions to delete
	 */
	deleteAll(userId: string, ids: string[]): Promise<void>;
}
