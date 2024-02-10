import type { UserDto } from '$lib/dtos/user';
import UserService from '$lib/server/services/UserService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
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

	return {
		user
	};
};
