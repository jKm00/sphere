import type { PrismaClient, User } from '@prisma/client';
import type { UserRepository } from './UserRepository';
import { db } from '../prisma';

class UserRepositoryImpl implements UserRepository {
	private db: PrismaClient;

	constructor(db: PrismaClient) {
		this.db = db;
	}

	public async findUserByEmail(email: string) {
		return await this.db.user.findUnique({
			where: {
				email
			}
		});
	}

	public async save(user: User) {
		return await this.db.user.create({
			data: user
		});
	}
}

export default new UserRepositoryImpl(db);
