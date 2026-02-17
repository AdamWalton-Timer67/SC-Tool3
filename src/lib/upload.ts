import { ImageOptimizer } from './utils/imageOptimizer';

/**
 * Simple upload function to upload images to local NAS storage
 */
export async function uploadImage(file: File): Promise<string> {
	const formData = new FormData();
	formData.append('file', file);

	const response = await fetch('/api/upload-image', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		const error = await response.json();
		console.error('Upload error:', error);
		throw new Error(error.message || 'Upload failed');
	}

	const data = await response.json();
	return data.url;
}

/**
 * Upload optimized images with multiple variants
 * @param file Original image file
 * @returns URLs for thumbnail, medium, and original versions
 */
export async function uploadOptimizedImage(file: File): Promise<{
	thumbnail: string;
	medium: string;
	original: string;
}> {
	// Optimiser l'image seulement si nécessaire
	if (ImageOptimizer.shouldOptimize(file)) {
		// Créer les variantes optimisées
		const variants = await ImageOptimizer.createVariants(file);

		const formData = new FormData();
		formData.append('thumbnail', variants.thumbnail);
		formData.append('medium', variants.medium);
		formData.append('original', variants.original);

		const response = await fetch('/api/upload-optimized-image', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('Optimized upload error:', error);
			throw new Error(error.message || 'Upload failed');
		}

		const data = await response.json();
		return data.urls;
	} else {
		// Si pas besoin d'optimiser, utiliser le même fichier pour toutes les variantes
		const url = await uploadImage(file);
		return {
			thumbnail: url,
			medium: url,
			original: url
		};
	}
}
