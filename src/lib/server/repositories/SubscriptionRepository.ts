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
}
