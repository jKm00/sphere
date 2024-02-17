import type { FxRate } from '@prisma/client';
import type { Dayjs } from 'dayjs';

export interface FxRatesRepository {
	/**
	 * Saves a list of new fx rate to the database
	 * @param fxRate to save
	 */
	saveAll(fxRates: Omit<FxRate, 'id'>[]): Promise<void>;

	/**
	 * Returns the exchange rate between two currencies at a given date
	 * @param source currency to convert from
	 * @param target currney to convert to
	 * @param date date of when the conversion is made
	 */
	getFxRate(source: string, target: string, date: Dayjs): Promise<FxRate | null>;
}
