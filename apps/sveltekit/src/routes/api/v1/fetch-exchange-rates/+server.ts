import { CRON_JOB_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';

export function GET({ url }) {
	const API_KEY = url.searchParams.get('API_KEY');

	if (API_KEY !== CRON_JOB_SECRET) {
		return json('Unauthorized', { status: 401 });
	}

	return json('ok', { status: 200 });
}
