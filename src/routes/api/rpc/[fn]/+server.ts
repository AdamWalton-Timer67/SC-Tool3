import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ALLOWED_RPC = new Set([
	'search_locations',
	'search_organizations',
	'get_user_organizations',
	'get_org_member_count',
	'is_org_member',
	'is_org_manager',
	'generate_org_slug',
	'get_org_members_with_user_info',
	'get_org_join_requests_with_user_info',
	'get_org_aggregated_inventory',
	'get_org_ingredient_breakdown'
]);

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const fn = params.fn;
	if (!ALLOWED_RPC.has(fn)) {
		return json({ error: `RPC not allowed: ${fn}` }, { status: 400 });
	}

	try {
		const body = await request.json().catch(() => ({}));
		const { data, error } = await locals.supabase.rpc(fn, body?.params ?? {});
		if (error) {
			return json({ error: error.message || 'RPC call failed.' }, { status: 500 });
		}
		return json({ data: data ?? null });
	} catch (error) {
		console.error('RPC API error:', fn, error);
		return json({ error: (error as Error).message || 'RPC request failed.' }, { status: 500 });
	}
};
