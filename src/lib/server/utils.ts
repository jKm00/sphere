export function getRedirectUrl(param: string | null, fallback: string) {
	return param ? param.replace(':', '?').replace(',', '&') : fallback;
}
