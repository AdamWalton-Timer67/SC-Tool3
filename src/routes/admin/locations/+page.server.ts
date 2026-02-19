import type { PageServerLoad } from './$types';
import { normalizeImageUrl } from '$lib/utils/imageUrl';

export const load: PageServerLoad = async ({ url, locals }) => {
	const supabase = locals.supabase;

	// Get filters from URL params
	const system = url.searchParams.get('system') || 'all';
	const difficulty = url.searchParams.get('difficulty') || 'all';
	const type = url.searchParams.get('type') || 'all';
	const search = url.searchParams.get('search') || '';

	// Build query
	let query = supabase.from('locations').select('*').order('created_at', { ascending: false });

	// Apply filters
	if (system !== 'all') {
		query = query.eq('system', system);
	}
	if (difficulty !== 'all') {
		query = query.eq('difficulty', difficulty);
	}
	if (type !== 'all') {
		query = query.eq('type', type);
	}
	if (search) {
		query = query.or(`name_en.ilike.%${search}%,name_fr.ilike.%${search}%`);
	}

	const { data: locations, error } = await query;

	if (error) {
		console.error('Error loading locations:', error);
		return {
			locations: [],
			filters: { system, difficulty, type, search },
			error: error.message
		};
	}

	// Get unique systems for filter
	const { data: systems } = await supabase.from('locations').select('system').order('system');

	const uniqueSystems = [...new Set(systems?.map((s) => s.system) || [])];

	return {
		locations: (locations || []).map((location: any) => ({
			...location,
			image_url: normalizeImageUrl(location.image_url),
			cheatsheet_image_url: normalizeImageUrl(location.cheatsheet_image_url)
		})),
		systems: uniqueSystems,
		filters: { system, difficulty, type, search }
	};
};
