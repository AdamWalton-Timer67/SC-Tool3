import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ALLOWED_TABLES = new Set([
	'rewards',
	'ingredients',
	'locations',
	'reward_ingredients',
	'reputation_requirements',
	'user_inventory',
	'user_reward_ingredients',
	'user_reward_completions',
	'user_favorite_rewards',
	'user_favorite_ingredients',
	'organizations',
	'organization_members',
	'organization_join_requests',
	'suggestions'
]);

type Filter = { type: 'eq'; field: string; value: any };

function applyFilters(builder: any, filters: Filter[] = []) {
	let query = builder;
	for (const filter of filters) {
		if (filter?.type === 'eq') {
			query = query.eq(filter.field, filter.value);
		}
	}
	return query;
}

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const table = params.table;
	if (!ALLOWED_TABLES.has(table)) {
		return json({ error: `Table not allowed: ${table}` }, { status: 400 });
	}

	try {
		const body = await request.json();
		const action = String(body?.action ?? 'select');
		const filters = Array.isArray(body?.filters) ? (body.filters as Filter[]) : [];
		const ordering = body?.ordering as { field?: string; ascending?: boolean } | undefined;
		const limit = body?.limit as number | null | undefined;
		const payload = body?.payload;
		const select = String(body?.select ?? '*');
		const onConflict = body?.onConflict as string | undefined;

		let query = locals.supabase.from(table);

		switch (action) {
			case 'insert': {
				query = query.insert(payload).select(select);
				break;
			}
			case 'upsert': {
				query = query.upsert(payload, onConflict ? { onConflict } : undefined).select(select);
				break;
			}
			case 'update': {
				query = query.update(payload).select(select);
				query = applyFilters(query, filters);
				break;
			}
			case 'delete': {
				query = query.delete().select(select);
				query = applyFilters(query, filters);
				break;
			}
			case 'select':
			default: {
				query = query.select(select);
				query = applyFilters(query, filters);
				if (ordering?.field) {
					query = query.order(ordering.field, { ascending: ordering.ascending ?? true });
				}
				if (typeof limit === 'number') {
					query = query.limit(limit);
				}
				break;
			}
		}

		const { data, error } = await query;
		if (error) {
			return json({ error: error.message || 'Database operation failed.' }, { status: 500 });
		}

		return json({ data: data ?? [] });
	} catch (error) {
		console.error('Database API error:', table, error);
		return json({ error: (error as Error).message || 'Database request failed.' }, { status: 500 });
	}
};
