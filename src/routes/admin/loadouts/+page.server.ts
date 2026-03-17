import { requireAdmin } from '$lib/server/admin';
import { getMiningReferenceData } from '$lib/server/mining-loadouts';

export async function load({ locals }: any) {
	await requireAdmin(locals.supabase);
	return await getMiningReferenceData();
}
