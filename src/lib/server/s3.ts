/**
 * AWS S3 Service
 *
 * This file configures AWS S3 for handling image uploads
 * for ingredients and rewards in the admin panel.
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

// Initialize S3 client
const s3Client = new S3Client({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY
	}
});

/**
 * Upload a file to S3
 * @param file - The file to upload
 * @param folder - Optional folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadToS3(file: File, folder: string = 'uploads'): Promise<string> {
	// Generate unique filename
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	const extension = file.name.split('.').pop();
	const key = `${folder}/${timestamp}-${randomString}.${extension}`;

	// Convert File to Buffer
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Upload to S3 with cache headers
	const command = new PutObjectCommand({
		Bucket: env.AWS_S3_BUCKET,
		Key: key,
		Body: buffer,
		ContentType: file.type,
		// ACL removed: bucket doesn't allow ACLs
		// Files are public via bucket policy
		// Cache headers for optimal performance
		CacheControl: 'public, max-age=31536000, immutable', // 1 year cache
		Metadata: {
			'uploaded-at': new Date().toISOString()
		}
	});

	await s3Client.send(command);

	// Return public URL
	// Format: https://{bucket}.s3.{region}.amazonaws.com/{key}
	const url = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
	return url;
}

/**
 * Upload multiple variants of an image to S3 (thumbnail, medium, original)
 * @param file - The file to upload
 * @param folder - Optional folder path within the bucket
 * @returns Object with URLs for each variant
 */
export async function uploadImageVariants(
	file: File,
	folder: string = 'images'
): Promise<{
	thumbnail: string;
	medium: string;
	original: string;
}> {
	// Generate base filename
	const timestamp = Date.now();
	const randomString = Math.random().toString(36).substring(2, 15);
	const extension = 'webp'; // Toujours utiliser WebP pour les variantes

	// Create keys for each variant
	const baseKey = `${folder}/${timestamp}-${randomString}`;
	const keys = {
		thumbnail: `${baseKey}-thumb.${extension}`,
		medium: `${baseKey}-medium.${extension}`,
		original: `${baseKey}.${extension}`
	};

	// Upload all variants (files should already be optimized)
	const variants = ['thumbnail', 'medium', 'original'] as const;
	const urls: Partial<Record<(typeof variants)[number], string>> = {};

	for (const variant of variants) {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const command = new PutObjectCommand({
			Bucket: env.AWS_S3_BUCKET,
			Key: keys[variant],
			Body: buffer,
			ContentType: 'image/webp',
			CacheControl: 'public, max-age=31536000, immutable',
			Metadata: {
				'uploaded-at': new Date().toISOString(),
				variant
			}
		});

		await s3Client.send(command);
		urls[variant] =
			`https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${keys[variant]}`;
	}

	return urls as { thumbnail: string; medium: string; original: string };
}

/**
 * Delete a file from S3
 * @param url - The full URL of the file to delete
 */
export async function deleteFromS3(url: string): Promise<void> {
	// Extract key from URL
	const urlPattern = new RegExp(
		`https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/(.+)`
	);
	const match = url.match(urlPattern);

	if (!match) {
		throw new Error('Invalid S3 URL');
	}

	const key = match[1];

	const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
	const command = new DeleteObjectCommand({
		Bucket: env.AWS_S3_BUCKET,
		Key: key
	});

	await s3Client.send(command);
}
