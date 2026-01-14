import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	// Just return the slug, we'll load data client-side using the store
	return {
		slug: params.slug
	};
};
