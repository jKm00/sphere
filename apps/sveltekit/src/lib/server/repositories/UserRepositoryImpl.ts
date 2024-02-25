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

	public async findUserById(id: string) {
		return await this.db.user.findUnique({
			where: {
				id
			}
		});
	}

	public async save(user: Omit<User, 'createdAt'>) {
		return await this.db.user.upsert({
			create: {
				...user
			},
			update: {
				...user
			},
			where: {
				id: user.id
			}
		});
	}

	public async updateEmailVerified(userId: string, verified: boolean) {
		await this.db.user.update({
			data: {
				emailVerified: verified
			},
			where: {
				id: userId
			}
		});
	}

	public async delete(id: string) {
		await this.db.user.delete({
			where: {
				id
			}
		});
	}
}

export default new UserRepositoryImpl(db);
