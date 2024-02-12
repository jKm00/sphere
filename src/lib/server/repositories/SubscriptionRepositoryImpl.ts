import type { PrismaClient, Subscription } from '@prisma/client';
import type { SubscriptionRepository } from './SubscriptionRepository';
import { db } from '../prisma';

export class SubscriptionRepositoryImpl implements SubscriptionRepository {
	private db;

	constructor(db: PrismaClient) {
		this.db = db;
	}

	public async save(userId: string, subscription: Omit<Subscription, 'createdAt' | 'userID'>) {
		return await this.db.subscription.upsert({
			create: {
				...subscription,
				userId
			},
			update: {
				company: subscription.company,
				description: subscription.description,
				amount: subscription.amount,
				currency: subscription.currency,
				period: subscription.period,
				type: subscription.type,
				url: subscription.url
			},
			where: {
				userId: userId,
				id: subscription.id
			}
		});
	}

	public async findAll(userId: string, predicate?: Record<string, string>) {
		const orderBy = {} as Record<string, string>;
		if (predicate && predicate['sortBy'] && predicate['order']) {
			orderBy[predicate['sortBy']] = predicate['order'];
		}

		let take = 10;
		if (predicate && predicate['pageSize']) {
			const pageSize = Number(predicate['pageSize']);
			if (!isNaN(pageSize)) {
				take = pageSize;
			}
		}

		let skip = 0;
		if (predicate && predicate['page']) {
			const page = Number(predicate['page']);
			if (!isNaN(page)) {
				skip = (page - 1) * take;
			}
		}

		return await this.db.subscription.findMany({
			where: {
				userId
			},
			orderBy: [orderBy],
			skip,
			take
		});
	}

	public async getCount(userId: string) {
		return await this.db.subscription.count({
			where: {
				userId
			}
		});
	}

	public async deleteAll(userId: string, ids: string[]) {
		await this.db.subscription.deleteMany({
			where: {
				userId,
				id: {
					in: ids
				}
			}
		});
	}
}

export default new SubscriptionRepositoryImpl(db);
