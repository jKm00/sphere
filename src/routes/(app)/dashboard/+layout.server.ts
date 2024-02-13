import { currencies } from '$lib/currency';
import type { UserDto } from '$lib/dtos/user';
import UserService from '$lib/server/services/UserService';
import type { PageServerLoad } from './$types';

// For some reason, ts complains about the event type not being defined.
// This happens only for server files in this route.
//@ts-ignore
export const load: PageServerLoad = async (event) => {
	async function fetchUser() {
		let user: UserDto | null = null;
		if (event.locals.user) {
			const foundUser = await UserService.getUser(event.locals.user?.id);

			if (foundUser) {
				user = {
					id: foundUser.id,
					email: foundUser.email
				};
			}
		}
		return user;
	}

	function getPrefferedCurrency() {
		let currency = event.cookies.get('currency');

		if (!currency) {
			currency = currencies[0].value;
		}

		return currency;
	}

	const [user] = await Promise.all([fetchUser()]);

	return {
		user,
		currency: getPrefferedCurrency()
	};
};
