import type { PrismaClient, Subscription } from '@prisma/client';
import type { SubscriptionRepository } from './SubscriptionRepository';
import { db } from '../prisma';

class SubscriptionRepositoryImpl implements SubscriptionRepository {
	private db;

	constructor(db: PrismaClient) {
		this.db = db;
	}

	public async save(userId: string, subscription: Omit<Subscription, 'createdAt' | 'userID'>) {
		return await this.db.subscription.create({
			data: {
				...subscription,
				userId
			}
		});
	}
}

export default new SubscriptionRepositoryImpl(db);
