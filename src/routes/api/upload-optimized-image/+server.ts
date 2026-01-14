import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadImageVariants } from '$lib/server/s3';

/**
 * Upload optimized images with multiple variants
 * Client should send pre-optimized thumbnail, medium, and original versions
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const thumbnail = formData.get('thumbnail') as File;
		const medium = formData.get('medium') as File;
		const original = formData.get('original') as File;

		if (!thumbnail || !medium || !original) {
			return json(
				{ error: 'Missing required image variants (thumbnail, medium, original)' },
				{ status: 400 }
			);
		}

		// Upload all variants to S3
		const urls = await Promise.all([
			uploadImageVariants(thumbnail, 'images/thumbnails'),
			uploadImageVariants(medium, 'images/medium'),
			uploadImageVariants(original, 'images/original')
		]);

		return json({
			urls: {
				thumbnail: urls[0].original,
				medium: urls[1].original,
				original: urls[2].original
			},
			sizes: {
				thumbnail: thumbnail.size,
				medium: medium.size,
				original: original.size
			}
		});
	} catch (error) {
		console.error('Optimized upload error:', error);
		return json(
			{
				error: 'Upload failed: ' + (error as Error).message
			},
			{ status: 500 }
		);
	}
};
