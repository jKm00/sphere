import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { SECRET_KEY } from '$env/static/private';

export const getLimiter = (id: string) => {
	// From: https://github.com/ciscoheat/sveltekit-rate-limiter
	return new RateLimiter({
		IP: [10, 'h'],
		IPUA: [5, 'm'],
		cookie: {
			name: id,
			secret: SECRET_KEY,
			rate: [2, 'm'],
			preflight: true
		}
	});
};
