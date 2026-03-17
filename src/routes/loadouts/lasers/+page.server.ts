import { getMiningReferenceData } from '$lib/server/mining-loadouts';

export async function load() {
	const data = await getMiningReferenceData();
	return { lasers: data.lasers, stores: data.stores };
}
