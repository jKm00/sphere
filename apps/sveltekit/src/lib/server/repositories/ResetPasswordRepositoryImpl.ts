import type { PrismaClient } from '@prisma/client';
import { db } from '../prisma';
import type { ResetPasswordRepository } from './ResetPasswordRepository';

class ResetPasswordRepositoryImpl implements ResetPasswordRepository {
	private db: PrismaClient;

	constructor(db: PrismaClient) {
		this.db = db;
	}

	public async findByToken(tokenId: string) {
		return await this.db.resetPasswordToken.findUnique({
			where: {
				id: tokenId
			}
		});
	}

	public async save(token: string, userId: string, expiresAt: Date) {
		await this.db.resetPasswordToken.create({
			data: {
				id: token,
				userId,
				expiresAt
			}
		});
	}

	public async deleteTokens(userId: string): Promise<void> {
		await this.db.resetPasswordToken.deleteMany({
			where: {
				userId
			}
		});
	}
}

export default new ResetPasswordRepositoryImpl(db);
