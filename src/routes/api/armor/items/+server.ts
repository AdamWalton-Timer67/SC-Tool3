import { json } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const manifestPath = path.resolve('static/armor-manifest.json');
		const raw = await fs.readFile(manifestPath, 'utf8');
		const manifest = JSON.parse(raw);
		return json(manifest);
	} catch (error) {
		console.error('Failed to load armor manifest:', error);
		return json(
			{ version: '0.0.0', updatedAt: new Date().toISOString(), items: [] },
			{ status: 200 }
		);
	}
};
