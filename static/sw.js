// Service Worker pour mode PWA (Progressive Web App)
// Permet le fonctionnement offline et améliore les performances

const CACHE_NAME = 'wikelo-tools-v1';
const RUNTIME_CACHE = 'wikelo-runtime-v1';

// Assets essentiels à mettre en cache lors de l'installation
const ASSETS_TO_CACHE = [
	'/',
	'/wikelo',
	'/inventory',
	'/favicon-96x96.png',
	'/site.webmanifest'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
	console.log('[SW] Installing Service Worker...');
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[SW] Caching essential assets');
			return cache.addAll(ASSETS_TO_CACHE);
		})
	);
	// Force l'activation immédiate
	self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
	console.log('[SW] Activating Service Worker...');
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
					.map((name) => {
						console.log('[SW] Deleting old cache:', name);
						return caches.delete(name);
					})
			);
		})
	);
	// Prendre le contrôle immédiatement
	return self.clients.claim();
});

// Stratégie de cache: Network First avec fallback sur Cache
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Ignorer les requêtes non-GET
	if (request.method !== 'GET') return;

	// Ignorer les requêtes vers d'autres domaines (API, Supabase, etc.)
	if (url.origin !== self.location.origin) return;

	// Ignorer les requêtes API internes
	if (url.pathname.startsWith('/api/')) return;

	event.respondWith(
		caches.open(RUNTIME_CACHE).then((cache) => {
			return fetch(request)
				.then((response) => {
					// Mettre en cache si succès
					if (response.status === 200) {
						cache.put(request, response.clone());
					}
					return response;
				})
				.catch(() => {
					// Si réseau échoue, utiliser le cache
					return cache.match(request).then((cachedResponse) => {
						if (cachedResponse) {
							return cachedResponse;
						}

						// Fallback vers le cache principal
						return caches.match(request).then((mainCacheResponse) => {
							if (mainCacheResponse) {
								return mainCacheResponse;
							}

							// Si aucune version en cache, retourner une page offline simple
							if (request.destination === 'document') {
								return new Response(
									`
									<!DOCTYPE html>
									<html lang="en">
									<head>
										<meta charset="UTF-8">
										<meta name="viewport" content="width=device-width, initial-scale=1.0">
										<title>Offline - Wikelo Tools</title>
										<style>
											body {
												background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
												color: #22d3ee;
												font-family: system-ui, -apple-system, sans-serif;
												display: flex;
												align-items: center;
												justify-content: center;
												min-height: 100vh;
												margin: 0;
												padding: 20px;
												text-align: center;
											}
											.container {
												max-width: 400px;
											}
											h1 {
												font-size: 2rem;
												margin-bottom: 1rem;
											}
											p {
												color: #94a3b8;
												line-height: 1.6;
											}
											.emoji {
												font-size: 4rem;
												margin-bottom: 1rem;
											}
										</style>
									</head>
									<body>
										<div class="container">
											<div class="emoji">🛰️</div>
											<h1>Mode Hors Ligne</h1>
											<p>Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion internet.</p>
											<p><small>Wikelo Tools - Star Citizen</small></p>
										</div>
									</body>
									</html>
									`,
									{
										headers: { 'Content-Type': 'text/html; charset=utf-8' }
									}
								);
							}

							// Pour les autres ressources, retourner une erreur
							return new Response('Network error', {
								status: 503,
								statusText: 'Service Unavailable'
							});
						});
					});
				});
		})
	);
});

// Message handler pour communiquer avec l'app
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'CACHE_URLS') {
		event.waitUntil(
			caches.open(RUNTIME_CACHE).then((cache) => {
				return cache.addAll(event.data.urls);
			})
		);
	}
});
