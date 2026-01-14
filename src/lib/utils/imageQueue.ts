/**
 * Gestionnaire de file d'attente pour le chargement séquentiel des images
 * Charge les images dans l'ordre d'apparition dans le DOM
 */

type ImageLoadTask = {
	src: string;
	priority: number;
	callback: (success: boolean) => void;
};

class ImageLoadQueue {
	private queue: ImageLoadTask[] = [];
	private loading = false;
	private maxConcurrent = 3; // Nombre d'images à charger en parallèle
	private currentLoading = 0;

	/**
	 * Ajoute une image à la file d'attente
	 * @param src URL de l'image
	 * @param priority Priorité (plus petit = plus prioritaire)
	 * @returns Promise qui se résout quand l'image est chargée
	 */
	add(src: string, priority: number = 0): Promise<boolean> {
		return new Promise((resolve) => {
			this.queue.push({
				src,
				priority,
				callback: resolve
			});

			// Trier par priorité (ordre d'apparition dans le DOM)
			this.queue.sort((a, b) => a.priority - b.priority);

			this.processQueue();
		});
	}

	private async processQueue() {
		if (this.currentLoading >= this.maxConcurrent || this.queue.length === 0) {
			return;
		}

		const task = this.queue.shift();
		if (!task) return;

		this.currentLoading++;

		try {
			const success = await this.loadImage(task.src);
			task.callback(success);
		} catch {
			task.callback(false);
		} finally {
			this.currentLoading--;
			this.processQueue(); // Charger la prochaine image
		}
	}

	private loadImage(src: string): Promise<boolean> {
		return new Promise((resolve) => {
			const img = new Image();

			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);

			img.src = src;
		});
	}

	/**
	 * Change le nombre d'images chargées en parallèle
	 */
	setMaxConcurrent(max: number) {
		this.maxConcurrent = max;
	}

	/**
	 * Vide la file d'attente
	 */
	clear() {
		this.queue = [];
		this.currentLoading = 0;
	}
}

// Instance singleton
export const imageQueue = new ImageLoadQueue();
