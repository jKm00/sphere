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

	public async findUserByGitHubId(id: number) {
		return await this.db.user.findUnique({
			where: {
				githubId: id
			}
		});
	}

	public async save(user: {
		id: string;
		emailVerified: boolean;
		prefferedCurrency: string;
		prefferedPeriod: string;
		email?: string | null;
		hashed_password?: string | null;
		salt?: string | null;
		githubId?: number | null;
		username?: string | null;
	}) {
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

	public async updatePassword(userId: string, password: string, salt: string) {
		await this.db.user.update({
			data: {
				hashed_password: password,
				salt
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
