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
}

export default new UserService(UserRepositoryImpl);
