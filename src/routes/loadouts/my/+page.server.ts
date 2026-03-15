import { getMiningReferenceData, getUserMiningLoadouts } from '$lib/server/mining-loadouts';

export async function load({ locals }: any) {
	const ref = await getMiningReferenceData();
	const { data } = await locals.supabase.auth.getUser();
	const loadouts = data?.user ? await getUserMiningLoadouts(data.user.id) : [];
	return {
		lasers: ref.lasers,
		modules: ref.modules,
		stores: ref.stores,
		loadouts,
		userId: data?.user?.id ?? null
	};
}
