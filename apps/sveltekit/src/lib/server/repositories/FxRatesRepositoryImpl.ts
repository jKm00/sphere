import type { FxRate, PrismaClient } from '@prisma/client';
import type { FxRatesRepository } from './FxRatesRepository';
import { db } from '../prisma';
import type { Dayjs } from 'dayjs';

class FxRatesRepositoryImpl implements FxRatesRepository {
	private db: PrismaClient;

	constructor(db: PrismaClient) {
		this.db = db;
	}

	public async saveAll(fxRates: Omit<FxRate, 'id'>[]) {
		await this.db.fxRate.createMany({
			data: fxRates,
			skipDuplicates: true
		});
	}

	public async getFxRate(source: string, target: string, date: Dayjs) {
		return await this.db.fxRate.findFirst({
			where: {
				sourceCurrency: source,
				targetCurrency: target,
				validFrom: {
					lte: date.toDate()
				},
				validTo: {
					gte: date.toDate()
				}
			}
		});
	}
}

export default new FxRatesRepositoryImpl(db);
