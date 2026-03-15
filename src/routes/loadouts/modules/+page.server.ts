import { getMiningReferenceData } from '$lib/server/mining-loadouts';
export async function load() {
	const data = await getMiningReferenceData();
	return { modules: data.modules };
}
