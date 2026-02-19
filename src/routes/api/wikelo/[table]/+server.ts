import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ensureMariaWikeloSeedData } from '$lib/server/maria-seed';

const ALLOWED_TABLES = new Set(['rewards', 'ingredients', 'locations', 'reward_ingredients', 'reputation_requirements']);

export const GET: RequestHandler = async ({ params, locals }) => {
	const table = params.table;
	if (!ALLOWED_TABLES.has(table)) {
		return json({ error: 'Unsupported table' }, { status: 400 });
	}

	try {
		await ensureMariaWikeloSeedData();
		let query = locals.supabase.from(table).select('*');
		if (table === 'rewards' || table === 'ingredients' || table === 'locations') {
			query = query.order('name_en', { ascending: true });
		}

		const { data, error } = await query;
		if (error) {
			const message = typeof error?.message === 'string' ? error.message : JSON.stringify(error);
			return json({ error: message, table }, { status: 500 });
		}
		return json({ data: data ?? [] });
	} catch (error) {
		console.error('Error loading wikelo table:', table, error);
		const message = error instanceof Error ? error.message : JSON.stringify(error);
		return json({ error: message || 'Failed to load data', table }, { status: 500 });
	}
};
