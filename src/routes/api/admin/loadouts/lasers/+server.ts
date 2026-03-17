import { json } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin';
import { updateMiningEntry } from '$lib/server/mining-loadouts';

export async function PUT({ locals, url, request }: any) {
	await requireAdmin(locals.supabase);
	const code = url.searchParams.get('code');
	if (!code) return json({ error: 'Missing code' }, { status: 400 });
	const body = await request.json();
	await updateMiningEntry('mining_lasers', code, body);
	return json({ success: true });
}
