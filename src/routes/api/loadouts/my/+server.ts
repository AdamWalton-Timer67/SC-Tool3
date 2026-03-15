import { json } from '@sveltejs/kit';
import { createUserMiningLoadout, getUserMiningLoadouts } from '$lib/server/mining-loadouts';

export async function GET({ locals }: any) {
	const { data } = await locals.supabase.auth.getUser();
	if (!data?.user) return json([]);
	return json(await getUserMiningLoadouts(data.user.id));
}

export async function POST({ locals, request }: any) {
	const { data } = await locals.supabase.auth.getUser();
	if (!data?.user) return json({ error: 'Unauthorized' }, { status: 401 });
	const body = await request.json();
	const id = `ml_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
	await createUserMiningLoadout({
		id,
		user_id: data.user.id,
		name: body.name,
		ship: body.ship ?? null,
		laser_code: body.laser_code,
		module_codes: body.module_codes ?? [],
		notes: body.notes ?? null
	});
	return json({ success: true, id });
}
