import type { FxRate, Subscription } from '@prisma/client';
import type { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import SubscriptionRepositoryImpl from '../repositories/SubscriptionRepositoryImpl';
import { random } from 'oslo/crypto';
import type { UserRepository } from '../repositories/UserRepository';
import UserRepositoryImpl from '../repositories/UserRepositoryImpl';
import dayjs from 'dayjs';
import type { FxRatesRepository } from '../repositories/FxRatesRepository';
import FxRatesRepositoryImpl from '../repositories/FxRatesRepositoryImpl';
import type { SingleSubscriptionDto } from '$lib/dtos/subscription';
import { periodConversions } from '../utils';

export class SubscriptionService {
	private subscriptionRepo: SubscriptionRepository;
	private userRepo: UserRepository;
	private fxRatesRepo: FxRatesRepository;

	constructor(
		subscriptionRepo: SubscriptionRepository,
		userRepo: UserRepository,
		fxRatesRepo: FxRatesRepository
	) {
		this.subscriptionRepo = subscriptionRepo;
		this.userRepo = userRepo;
		this.fxRatesRepo = fxRatesRepo;
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
		return await this.subscriptionRepo.save(userId, subscriptionWithId);
	}

	/**
	 * Returns all subscriptions for a given user matching the given predicates
	 * @param userId id of the user
	 * @param predicate sortBy, order, page, and pageSize
	 * @returns and object with a list of all subscriptions matching the predicates
	 * and the total number of subscriptions for the user
	 */
	public async getSubscriptions(userId: string, predicate?: Record<string, string>) {
		const user = await this.userRepo.findUserById(userId);

		if (!user) throw new Error('User not found');

		return {
			data: await this.subscriptionRepo.findAll(userId, predicate),
			totalItems: await this.subscriptionRepo.getCount(userId)
		};
	}

	/**
	 * Returns the total sum of all subscriptions and the most expensive subscription
	 * for a given user
	 * @param userId of the user
	 */
	public async getDerivedData(userId: string) {
		const user = await this.userRepo.findUserById(userId);

		if (!user) throw new Error('User not found');

		const allSubscriptions = await this.subscriptionRepo.findAll(userId);

		let allSubsConverted: SingleSubscriptionDto[] = [];
		for (let i = 0; i < allSubscriptions.length; i++) {
			const currencyConverted = await this.convertToPrefferedCurrency(
				allSubscriptions[i],
				user.prefferedCurrency
			);
			const periodConverted = await this.convertToPrefferedPeriod(
				currencyConverted,
				user.prefferedPeriod
			);
			allSubsConverted.push(periodConverted);
		}

		// Find most expensive subscription
		let mostExpensiveSub: SingleSubscriptionDto | undefined;
		for (let i = 0; i < allSubsConverted.length; i++) {
			if (!mostExpensiveSub || allSubsConverted[i].amount > mostExpensiveSub.amount) {
				mostExpensiveSub = allSubsConverted[i];
			}
		}

		return {
			totalSum: allSubsConverted.map((sub) => sub.amount).reduce((a, b) => a + b, 0),
			mostExpensiveSub
		};
	}

	/**
	 * Converts the amount of a subscription to the preffered currency of the user
	 * @param sub the subscription to convert
	 * @param prefferedCurrency the currency the user prefers
	 * @returns a new subscription with the amount converted and the updated currency
	 */
	private async convertToPrefferedCurrency(sub: Subscription, prefferedCurrency: string) {
		if (sub.currency === prefferedCurrency) return sub;

		let fxRate: FxRate | null;
		let index = 0;
		do {
			fxRate = await this.fxRatesRepo.getFxRate(
				sub.currency,
				prefferedCurrency,
				dayjs().subtract(index, 'day')
			);
			index++;
		} while (!fxRate && index < 5);

		if (!fxRate) {
			console.error(
				'Could not find fx rate for currency conversion',
				sub.currency,
				prefferedCurrency
			);
			return sub;
		}

		return {
			...sub,
			currency: prefferedCurrency,
			amount: sub.amount * fxRate.exchangeRate
		};
	}

	/**
	 * Converts the amount based on the preffered period of the user.
	 * E.g. if subscriptions is given as x amount per month and user
	 * wants to see per year, the amount is multiplied by 12.
	 * Note: The period field of the subscription is also updated.
	 * @param sub the subscription to convert
	 * @param prefferedPeriod the period the user prefers
	 * @returns a new subscription with the amount converted and the updated period
	 */
	private async convertToPrefferedPeriod(sub: Subscription, prefferedPeriod: string) {
		if (sub.period === prefferedPeriod) return sub;

		const convertDetails = periodConversions.find(
			(p) => p.source === sub.period && p.target === prefferedPeriod
		);

		if (!convertDetails) {
			return sub;
		}

		return {
			...sub,
			period: prefferedPeriod,
			amount: sub.amount * convertDetails.conversion
		};
	}

	/**
	 * Deletes the subscriptions with the given ids
	 * @param userId owner of the subscriptions
	 * @param ids an array containing the ids of the subscriptions to delete
	 */
	public async deleteSubscriptions(userId: string, ids: string[]) {
		return await this.subscriptionRepo.deleteAll(userId, ids);
	}
}

export default new SubscriptionService(
	SubscriptionRepositoryImpl,
	UserRepositoryImpl,
	FxRatesRepositoryImpl
);
