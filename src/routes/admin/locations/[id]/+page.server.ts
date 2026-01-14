import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;

	if (params.id === 'new') {
		return {
			location: null,
			isNew: true
		};
	}

	const { data: location, error: loadError } = await supabase
		.from('locations')
		.select('*')
		.eq('id', params.id)
		.single();

	if (loadError) {
		throw error(404, 'Location not found');
	}

	return {
		location,
		isNew: false
	};
};
