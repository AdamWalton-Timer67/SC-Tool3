import { json } from '@sveltejs/kit';
import { deleteUserMiningLoadout } from '$lib/server/mining-loadouts';

export async function DELETE({ locals, params }: any) {
	const { data } = await locals.supabase.auth.getUser();
	if (!data?.user) return json({ error: 'Unauthorized' }, { status: 401 });
	const deleted = await deleteUserMiningLoadout(data.user.id, params.id);
	if (!deleted) return json({ error: 'Loadout not found' }, { status: 404 });
	return json({ success: true });
}
