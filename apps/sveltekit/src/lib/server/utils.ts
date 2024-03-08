export function getRedirectUrl(param: string | null, fallback: string) {
	return param ? param.replace(':', '?').replace(',', '&') : fallback;
}

export const periodConversions = [
	{
		source: 'day',
		target: 'week',
		conversion: 7
	},
	{
		source: 'day',
		target: 'month',
		conversion: 30
	},
	{
		source: 'day',
		target: 'year',
		conversion: 365
	},
	{
		source: 'week',
		target: 'day',
		conversion: 1 / 7
	},
	{
		source: 'week',
		target: 'month',
		conversion: 4
	},
	{
		source: 'week',
		target: 'year',
		conversion: 52
	},
	{
		source: 'month',
		target: 'day',
		conversion: 1 / 30
	},
	{
		source: 'month',
		target: 'week',
		conversion: 1 / 4
	},
	{
		source: 'month',
		target: 'year',
		conversion: 12
	},
	{
		source: 'year',
		target: 'day',
		conversion: 1 / 365
	},
	{
		source: 'year',
		target: 'week',
		conversion: 1 / 52
	},
	{
		source: 'year',
		target: 'month',
		conversion: 1 / 12
	}
];

export const GOOGLE_OAUTH_STATE_COOKIE = 'google_oauth_state';
export const GOOGLE_OAUTH_VERIFIER_COOKIE = 'google_oauth_code_verifier';
export const GITHUB_OAUTH_STATE_COOKIE = 'github_oauth_state';
