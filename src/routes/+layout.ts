import { browser } from '$app/environment';
import { auth, initizalizeFirebase } from '$lib/firebase.client';
import { session } from '$lib/session';
import { onAuthStateChanged } from 'firebase/auth';

export const load = async () => {
	if (browser) {
		try {
			initizalizeFirebase();
		} catch (error) {
			console.log(error);
		}
	}

	onAuthStateChanged(auth, (user) => {
		if (user) {
			session.update((cur) => ({
				...cur,
				user,
				loading: false,
				loggedIn: true
			}));
		} else {
			session.update((cur) => ({
				...cur,
				user: null,
				loading: false,
				loggedIn: false
			}));
		}
	});

	function getAuthUser() {
		return new Promise((resolve) => {
			onAuthStateChanged(auth, (user) => resolve(user ? user : null));
		});
	}

	return {
		getAuthUser
	};
};

export const ssr = false;
