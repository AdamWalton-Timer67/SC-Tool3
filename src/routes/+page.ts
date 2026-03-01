import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	return {
		loginRequired: url.searchParams.get('loginRequired') === '1'
	};
};
