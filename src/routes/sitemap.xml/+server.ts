import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	const baseUrl = 'https://star-citizen-wikelo-tools.space';
	// Petite image optimisée pour le sitemap (96x96px pour performance)
	const sitemapIcon = `${baseUrl}/favicon-96x96.png`;

	// Load all rewards data
	const rewardCategories = ['armor', 'weapons', 'ships', 'vehicles', 'utilities', 'currencies'];

	const ingredientCategories = ['common', 'organic', 'weapons', 'armor', 'special'];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let allRewards: any[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let allIngredients: any[] = [];

	// Load rewards
	for (const category of rewardCategories) {
		try {
			const response = await fetch(`/data/rewards/${category}.json`);
			if (response.ok) {
				const data = await response.json();
				if (data.rewards) {
					allRewards = [...allRewards, ...data.rewards];
				}
			}
		} catch (e) {
			console.error(`Error loading ${category}:`, e);
		}
	}

	// Load ingredients
	for (const category of ingredientCategories) {
		try {
			const response = await fetch(`/data/ingredients/${category}.json`);
			if (response.ok) {
				const data = await response.json();
				if (data.ingredients) {
					allIngredients = [...allIngredients, ...data.ingredients];
				}
			}
		} catch (e) {
			console.error(`Error loading ${category}:`, e);
		}
	}

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

	<!-- Main Pages -->
	<url>
		<loc>${baseUrl}/</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
		<image:image>
			<image:loc>${sitemapIcon}</image:loc>
			<image:title>Wikelo Tools - Star Citizen</image:title>
			<image:caption>Free Wikelo Emporium tracker</image:caption>
		</image:image>
	</url>

	<url>
		<loc>${baseUrl}/wikelo</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
		<image:image>
			<image:loc>${sitemapIcon}</image:loc>
			<image:title>Wikelo Tracker</image:title>
			<image:caption>Track 60+ rewards</image:caption>
		</image:image>
	</url>

	<url>
		<loc>${baseUrl}/inventory</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>

	<!-- Reward Items -->
	${allRewards
		.map(
			(reward) => `
	<url>
		<loc>${baseUrl}/wikelo#${reward.id}</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.9</priority>
		${
			reward.image
				? `<image:image>
			<image:loc>${baseUrl}${reward.image}</image:loc>
			<image:title>${reward.name?.en || reward.id}</image:title>
			<image:caption>${reward.description?.en || ''}</image:caption>
		</image:image>`
				: ''
		}
	</url>`
		)
		.join('')}

	<!-- Ingredient Items -->
	${allIngredients
		.map(
			(ingredient) => `
	<url>
		<loc>${baseUrl}/wikelo#${ingredient.id}</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
		${
			ingredient.image
				? `<image:image>
			<image:loc>${baseUrl}${ingredient.image}</image:loc>
			<image:title>${ingredient.name?.en || ingredient.id}</image:title>
			<image:caption>${ingredient.description?.en || ''}</image:caption>
		</image:image>`
				: ''
		}
	</url>`
		)
		.join('')}

</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
