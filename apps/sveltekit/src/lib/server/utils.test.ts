import { describe, it, expect } from 'vitest';
import { getRedirectUrl } from './utils';

describe('Get redirect url util', () => {
	it('should correctly conver url', () => {
		const redirect = '/dashboard:page=1,pageSize=10';

		const result = getRedirectUrl(redirect, '/dashboard');

		expect(result).toBe('/dashboard?page=1&pageSize=10');
	});

	it('should use fallback if no redirect', () => {
		const fallback = '/dashboard';

		const result = getRedirectUrl(null, fallback);

		expect(result).toBe(fallback);
	});
});
