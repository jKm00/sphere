import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { getAuthUser } = await parent();

	const user = await getAuthUser();

	if (!user) {
		redirect(301, '/login');
	}
};
