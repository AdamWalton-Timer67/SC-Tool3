import { getMiningReferenceData } from '$lib/server/mining-loadouts';
export async function load() {
	return await getMiningReferenceData();
}
