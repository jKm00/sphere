import { currencies } from '$lib/currency';
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
}

export default new UserService(UserRepositoryImpl);
