/**
 * Service de cache d'images avec IndexedDB
 * Évite les appels répétés à S3 en stockant les images localement
 */

const DB_NAME = 'sc-emporium-image-cache';
const STORE_NAME = 'images';
const DB_VERSION = 1;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes

interface CachedImage {
	url: string;
	blob: Blob;
	timestamp: number;
	contentType: string;
}

class ImageCache {
	private db: IDBDatabase | null = null;
	private initPromise: Promise<void> | null = null;
	private memoryCache: Map<string, string> = new Map(); // Cache mémoire pour les URLs blob

	constructor() {
		if (typeof window !== 'undefined') {
			this.initPromise = this.initDB();
		}
	}

	private async initDB(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
					store.createIndex('timestamp', 'timestamp', { unique: false });
				}
			};
		});
	}

	/**
	 * Récupère une image du cache
	 * @param url URL de l'image
	 * @returns URL blob de l'image ou null si non trouvée/expirée
	 */
	async get(url: string): Promise<string | null> {
		// Vérifier le cache mémoire d'abord
		if (this.memoryCache.has(url)) {
			return this.memoryCache.get(url)!;
		}

		await this.initPromise;
		if (!this.db) return null;

		return new Promise((resolve) => {
			const transaction = this.db!.transaction([STORE_NAME], 'readonly');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(url);

			request.onsuccess = () => {
				const cached = request.result as CachedImage | undefined;

				if (!cached) {
					resolve(null);
					return;
				}

				// Vérifier si le cache est expiré
				const now = Date.now();
				if (now - cached.timestamp > CACHE_DURATION) {
					// Cache expiré, le supprimer
					this.delete(url);
					resolve(null);
					return;
				}

				// Créer une URL blob et la mettre en cache mémoire
				const blobUrl = URL.createObjectURL(cached.blob);
				this.memoryCache.set(url, blobUrl);
				resolve(blobUrl);
			};

			request.onerror = () => resolve(null);
		});
	}

	/**
	 * Stocke une image dans le cache
	 * @param url URL de l'image
	 * @param blob Données de l'image
	 */
	async set(url: string, blob: Blob): Promise<void> {
		await this.initPromise;
		if (!this.db) return;

		const cached: CachedImage = {
			url,
			blob,
			timestamp: Date.now(),
			contentType: blob.type
		};

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.put(cached);

			request.onsuccess = () => {
				// Créer une URL blob et la mettre en cache mémoire
				const blobUrl = URL.createObjectURL(blob);
				this.memoryCache.set(url, blobUrl);
				resolve();
			};
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Supprime une image du cache
	 */
	private async delete(url: string): Promise<void> {
		await this.initPromise;
		if (!this.db) return;

		// Révoquer l'URL blob si elle existe
		const blobUrl = this.memoryCache.get(url);
		if (blobUrl) {
			URL.revokeObjectURL(blobUrl);
			this.memoryCache.delete(url);
		}

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.delete(url);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Charge une image depuis l'URL en utilisant le cache
	 * @param url URL de l'image
	 * @returns URL blob de l'image
	 */
	async load(url: string): Promise<string> {
		// Vérifier le cache d'abord
		const cached = await this.get(url);
		if (cached) {
			return cached;
		}

		// Télécharger l'image
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to load image: ${response.statusText}`);
		}

		const blob = await response.blob();

		// Stocker dans le cache
		await this.set(url, blob);

		// Retourner l'URL blob (déjà mise en cache mémoire par set())
		return this.memoryCache.get(url)!;
	}

	/**
	 * Nettoie les entrées expirées du cache
	 */
	async cleanExpired(): Promise<void> {
		await this.initPromise;
		if (!this.db) return;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
			const store = transaction.objectStore(STORE_NAME);
			const index = store.index('timestamp');
			const request = index.openCursor();

			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
				if (cursor) {
					const cached = cursor.value as CachedImage;
					const now = Date.now();
					if (now - cached.timestamp > CACHE_DURATION) {
						cursor.delete();
						// Révoquer l'URL blob
						const blobUrl = this.memoryCache.get(cached.url);
						if (blobUrl) {
							URL.revokeObjectURL(blobUrl);
							this.memoryCache.delete(cached.url);
						}
					}
					cursor.continue();
				} else {
					resolve();
				}
			};

			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Vide complètement le cache
	 */
	async clear(): Promise<void> {
		await this.initPromise;
		if (!this.db) return;

		// Révoquer toutes les URLs blob
		for (const blobUrl of this.memoryCache.values()) {
			URL.revokeObjectURL(blobUrl);
		}
		this.memoryCache.clear();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.clear();

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
}

// Instance singleton
export const imageCache = new ImageCache();

// Nettoyer le cache expiré au démarrage
if (typeof window !== 'undefined') {
	imageCache.cleanExpired().catch(console.error);
}
