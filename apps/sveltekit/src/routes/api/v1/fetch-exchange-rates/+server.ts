import { CRON_JOB_SECRET, EXCHANGE_RATE_API_KEY } from '$env/static/private';
import { currencies } from '$lib/currency.js';
import FxRatesRepositoryImpl from '$lib/server/repositories/FxRatesRepositoryImpl.js';
import type { FxRate } from '@prisma/client';
import { json } from '@sveltejs/kit';
import dayjs from 'dayjs';

export async function GET({ url }) {
	const API_KEY = url.searchParams.get('API_KEY');

	if (API_KEY !== CRON_JOB_SECRET) {
		return json('Unauthorized', { status: 401 });
	}

	let alreadySaved = new Set<string>();
	let toSave: Omit<FxRate, 'id'>[] = [];
	for (let i = 0; i < currencies.length; i++) {
		try {
			const res = await fetch(
				`https://api.freecurrencyapi.com/v1/latest?apikey=${EXCHANGE_RATE_API_KEY}&base_currency=${
					currencies[i].value
				}&currencies=${currencies
					.filter((c) => c !== currencies[i])
					.map((f) => f.value)
					.join(',')}`
			);
			const data = (await res.json()) as { data: { [key: string]: number } };

			for (const [currency, rate] of Object.entries(data.data)) {
				const fxRate = {
					sourceCurrency: currencies[i].value,
					targetCurrency: currency,
					exchangeRate: rate,
					validFrom: dayjs().startOf('day').toDate(),
					validTo: dayjs().endOf('day').toDate()
				};

				const inverseFxRate = {
					sourceCurrency: currency,
					targetCurrency: currencies[i].value,
					exchangeRate: 1 / rate,
					validFrom: dayjs().startOf('day').toDate(),
					validTo: dayjs().endOf('day').toDate()
				};

				if (!alreadySaved.has(`${fxRate.sourceCurrency}-${fxRate.targetCurrency}`)) {
					toSave.push(fxRate);
					alreadySaved.add(`${fxRate.sourceCurrency}-${fxRate.targetCurrency}`);
				}
				if (!alreadySaved.has(`${inverseFxRate.sourceCurrency}-${inverseFxRate.targetCurrency}`)) {
					toSave.push(inverseFxRate);
					alreadySaved.add(`${inverseFxRate.sourceCurrency}-${inverseFxRate.targetCurrency}`);
				}
			}
		} catch (err) {
			console.error(err);
			return json('Internal Server Error', { status: 500 });
		}
	}

	FxRatesRepositoryImpl.saveAll(toSave);

	return json('ok', { status: 200 });
}
