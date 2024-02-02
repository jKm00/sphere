import { auth } from '$lib/firebase.client';
import { redirect } from '@sveltejs/kit';
import { signOut } from 'firebase/auth';

export const load = async () => {
	await signOut(auth);
	redirect(301, '/login');
};
