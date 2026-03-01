import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url, data }) => {
	const isHomePage = url.pathname === '/';
	const isAuthenticated = Boolean(data.session);

	if (!isHomePage && !isAuthenticated) {
		throw redirect(303, '/?loginRequired=1');
	}

	return {
		session: data.session,
		isAdmin: data.isAdmin
	};
};
