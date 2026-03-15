import { json } from '@sveltejs/kit';
import { getMiningReferenceData } from '$lib/server/mining-loadouts';

export async function GET() {
	return json(await getMiningReferenceData());
}
