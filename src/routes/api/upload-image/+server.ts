import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadToLocalStorage } from '$lib/server/local-storage';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Upload to local NAS storage
		const url = await uploadToLocalStorage(file, 'images');

		return json({
			url: url,
			name: file.name,
			size: file.size
		});
	} catch (error) {
		console.error('Upload error:', error);
		return json(
			{
				error: 'Upload failed: ' + (error as Error).message
			},
			{ status: 500 }
		);
	}
};
