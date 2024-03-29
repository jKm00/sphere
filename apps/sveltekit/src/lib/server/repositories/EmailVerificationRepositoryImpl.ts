import type { PrismaClient } from '@prisma/client';
import { db } from '../prisma';
import type { EmailVerificationRepository } from './EmailVerificationRepository';

class EmailVerificationRepositoryImpl implements EmailVerificationRepository {
	private db: PrismaClient;

	constructor(db: PrismaClient) {
		this.db = db;
	}

	public async findByUser(userId: string) {
		return await this.db.emailVerificationCode.findFirst({
			where: {
				userId
			}
		});
	}

	public async findByUserAndCode(userId: string, code: string) {
		return await this.db.emailVerificationCode.findFirst({
			where: {
				userId,
				code
			}
		});
	}

	public async save(userId: string, email: string, code: string, expiresAt: Date) {
		return await this.db.emailVerificationCode.create({
			data: {
				userId,
				email,
				code,
				expiresAt
			}
		});
	}

	public async deleteAll(userId: string) {
		await this.db.emailVerificationCode.deleteMany({
			where: {
				userId
			}
		});
	}
}

export default new EmailVerificationRepositoryImpl(db);
