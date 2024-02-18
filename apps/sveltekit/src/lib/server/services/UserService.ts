import { currencies } from '$lib/currency';
import { periods } from '$lib/period';
import type { UserRepository } from '../repositories/UserRepository';
import UserRepositoryImpl from '../repositories/UserRepositoryImpl';

export class UserService {
	private repo: UserRepository;

	constructor(repo: UserRepository) {
		this.repo = repo;
	}

	/**
	 * Returns a user by the given id
	 * @param id of user
	 * @returns user found or null if no user is found
	 */
	public async getUser(id: string) {
		return await this.repo.findUserById(id);
	}

	/**
	 * Updates the preffered currency of a user
	 * @param id of the user
	 * @param currency to update to
	 */
	public async updateCurrency(id: string, currency: string | null) {
		const user = await this.repo.findUserById(id);

		if (!user) {
			throw new Error('User not found');
		}

		let prefferedCurrency = currencies.find((c) => c.value === currency)?.value ?? 'EUR';

		await this.repo.save({
			...user,
			prefferedCurrency
		});
	}

	/**
	 * Updates the preffered period of a user
	 * @param id of the user
	 * @param period tp update to
	 */
	public async updatePeriod(id: string, period: string | null) {
		const user = await this.repo.findUserById(id);

		if (!user) {
			throw new Error('User not found');
		}

		let prefferedPeriod = periods.find((p) => p.value === period)?.value ?? 'month';

		await this.repo.save({
			...user,
			prefferedPeriod
		});
	}

	/**
	 * Deletes a user by the given id
	 * @param id of user
	 */
	public async delete(id: string) {
		await this.repo.delete(id);
	}

	/**
	 * Updates the email of a user
	 * @param id of the user
	 * @param email to change to
	 */
	public async updateEmail(id: string, email: string) {
		const user = await this.repo.findUserById(id);

		if (!user) {
			throw new Error('User not found');
		}

		await this.repo.save({
			...user,
			email
		});
	}
}

export default new UserService(UserRepositoryImpl);
