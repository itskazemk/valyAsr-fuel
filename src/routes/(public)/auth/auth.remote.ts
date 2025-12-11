import { command, getRequestEvent } from '$app/server';
import { logout } from '$lib/server/auth';

export const logoutRemoteFn = command(async () => {
	const event = getRequestEvent();

	await logout(event);

	return { redirect: '/' };
});
