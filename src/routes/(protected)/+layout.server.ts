import { getRequestEvent } from '$app/server';
import { fail, redirect } from '@sveltejs/kit';

export const load = async () => {
	const user = requireLogin();
	return { user };
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/auth/login');
	}

	return locals.user;
}
