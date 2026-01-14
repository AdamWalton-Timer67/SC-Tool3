/**
 * Service d'optimisation d'images
 * Redimensionne et convertit les images en WebP pour réduire la taille
 */

export interface ImageOptimizationOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number; // 0-1
	format?: 'webp' | 'jpeg' | 'png';
}

export class ImageOptimizer {
	/**
	 * Optimise une image (redimensionnement + conversion)
	 * @param file Fichier image original
	 * @param options Options d'optimisation
	 * @returns Fichier optimisé
	 */
	static async optimize(file: File, options: ImageOptimizationOptions = {}): Promise<File> {
		const { maxWidth = 1200, maxHeight = 1200, quality = 0.85, format = 'webp' } = options;

		return new Promise((resolve, reject) => {
			const img = new Image();
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				reject(new Error('Canvas context not available'));
				return;
			}

			img.onload = () => {
				// Calculer les nouvelles dimensions en gardant le ratio
				let { width, height } = img;

				if (width > maxWidth || height > maxHeight) {
					const ratio = Math.min(maxWidth / width, maxHeight / height);
					width = Math.floor(width * ratio);
					height = Math.floor(height * ratio);
				}

				canvas.width = width;
				canvas.height = height;

				// Dessiner l'image redimensionnée
				ctx.drawImage(img, 0, 0, width, height);

				// Convertir en blob
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error('Failed to create blob'));
							return;
						}

						// Créer un nouveau fichier avec l'extension appropriée
						const extension = format === 'webp' ? 'webp' : format === 'jpeg' ? 'jpg' : 'png';
						const originalName = file.name.replace(/\.[^/.]+$/, '');
						const optimizedFile = new File([blob], `${originalName}.${extension}`, {
							type: `image/${format}`
						});

						resolve(optimizedFile);
					},
					`image/${format}`,
					quality
				);
			};

			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = URL.createObjectURL(file);
		});
	}

	/**
	 * Crée plusieurs versions d'une image (thumbnail, medium, original)
	 */
	static async createVariants(file: File): Promise<{
		thumbnail: File;
		medium: File;
		original: File;
	}> {
		const [thumbnail, medium, original] = await Promise.all([
			this.optimize(file, { maxWidth: 200, maxHeight: 200, quality: 0.8 }),
			this.optimize(file, { maxWidth: 600, maxHeight: 600, quality: 0.85 }),
			this.optimize(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.9 })
		]);

		return { thumbnail, medium, original };
	}

	/**
	 * Vérifie si l'optimisation réduirait la taille du fichier
	 */
	static shouldOptimize(file: File): boolean {
		// Ne pas optimiser les fichiers déjà petits
		if (file.size < 50 * 1024) return false; // < 50KB

		// Ne pas optimiser si déjà en WebP et de taille raisonnable
		if (file.type === 'image/webp' && file.size < 500 * 1024) return false; // < 500KB

		return true;
	}
}
