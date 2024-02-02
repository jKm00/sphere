import { browser } from '$app/environment';
import { auth, initizalizeFirebase } from '$lib/firebase.client';
import { onAuthStateChanged } from 'firebase/auth';

export const load = async () => {
	if (browser) {
		try {
			initizalizeFirebase();
		} catch (error) {
			console.log(error);
		}
	}

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
