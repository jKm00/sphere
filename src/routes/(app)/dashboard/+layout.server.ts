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
					email: foundUser.email,
					prefferedCurrency: foundUser.prefferedCurrency,
					prefferedPeriod: foundUser.prefferedPeriod
				};
			}
		}
		return user;
	}

	const [user] = await Promise.all([fetchUser()]);

	return {
		user
	};
};
