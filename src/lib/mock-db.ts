export type MockTableRow = Record<string, any>;

const now = new Date().toISOString();

const locationPyroStation = {
	id: 'loc_pyro_station',
	slug: 'pyro-gateway-station',
	name_en: 'Pyro Gateway Station',
	name_fr: 'Station Passerelle Pyro',
	system: 'pyro',
	type: 'station',
	difficulty: 'medium',
	description_en: 'A contested station often used as a trading waypoint.',
	description_fr: 'Une station contestée souvent utilisée comme point de commerce.',
	image_url: '/images/locations/pyro-gateway-station.jpg',
	created_at: now
};

const locationBloom = {
	id: 'loc_bloom_outpost',
	slug: 'bloom-mining-outpost',
	name_en: 'Bloom Mining Outpost',
	name_fr: 'Avant-poste Minier Bloom',
	system: 'pyro',
	type: 'outpost',
	difficulty: 'hard',
	description_en: 'Remote outpost with dense hostiles and high-value loot.',
	description_fr: 'Avant-poste reculé avec de nombreux hostiles et du butin de valeur.',
	image_url: '/images/locations/bloom-mining-outpost.jpg',
	created_at: now
};

export const mockDb = {
	rewards: [
		{
			id: 'reward_karna',
			name_en: 'Karna Plasma Rifle',
			name_fr: 'Fusil Plasma Karna',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'epic',
			version: '4.0',
			favor_cost: 120,
			description_en: 'Reliable plasma rifle for medium range combat.',
			description_fr: 'Fusil plasma fiable pour le combat à moyenne portée.',
			image_url: '/images/wikelo/karna.webp',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_polaris',
			name_en: 'Polaris',
			name_fr: 'Polaris',
			type_en: 'Ship',
			type_fr: 'Vaisseau',
			category: 'ships',
			rarity: 'legendary',
			version: '4.0',
			favor_cost: 500,
			description_en: 'Capital patrol corvette reward.',
			description_fr: 'Récompense de corvette de patrouille capitale.',
			image_url: '/images/wikelo/polaris.jpeg',
			has_loadout: true,
			gives: 1,
			not_released: false
		}
	],
	ingredients: [
		{
			id: 'ing_jaclium',
			name_en: 'Jaclium',
			name_fr: 'Jaclium',
			category: 'mineral',
			rarity: 'rare',
			image_url: '/images/wikelo/jaclium.webp',
			description_en: 'A volatile mineral used in advanced crafting.',
			description_fr: 'Un minerai volatil utilisé dans l’artisanat avancé.',
			how_to_obtain_en: 'Mine in Pyro asteroid fields.',
			how_to_obtain_fr: 'Miner dans les champs d’astéroïdes de Pyro.',
			location_id: locationPyroStation.id
		},
		{
			id: 'ing_valakkar_fang',
			name_en: 'Irradiated Valakkar Fang',
			name_fr: 'Croc de Valakkar Irradié',
			category: 'creature',
			rarity: 'epic',
			image_url: '/images/wikelo/irradiated_valakkar_fang_adult.png',
			description_en: 'Rare trophy from dangerous fauna.',
			description_fr: 'Trophée rare provenant d’une faune dangereuse.',
			how_to_obtain_en: 'Loot from irradiated Valakkar encounters.',
			how_to_obtain_fr: 'Butin d’affrontements avec des Valakkars irradiés.',
			location_id: locationBloom.id
		}
	],
	reward_ingredients: [
		{ id: 'ri_1', reward_id: 'reward_karna', ingredient_id: 'ing_jaclium', quantity: 4, unit: 'x' },
		{ id: 'ri_2', reward_id: 'reward_polaris', ingredient_id: 'ing_jaclium', quantity: 20, unit: 'x' },
		{ id: 'ri_3', reward_id: 'reward_polaris', ingredient_id: 'ing_valakkar_fang', quantity: 5, unit: 'x' }
	],
	reputation_requirements: [
		{
			id: 'rep_req_1',
			reward_id: 'reward_polaris',
			reputation_name_en: 'Council Standing',
			reputation_name_fr: 'Réputation du Conseil',
			required_level: 3
		}
	],
	locations: [locationPyroStation, locationBloom],
	suggestions: [
		{
			id: 'sug_1',
			item_type: 'ingredient',
			item_id: 'ing_jaclium',
			item_name: 'Jaclium',
			suggestion_type: 'location_update',
			content: 'Spawns more frequently around Pyro Gate in 4.0.1.',
			user_email: 'tester@example.com',
			user_id: null,
			created_at: now
		}
	],
	organizations: [
		{
			id: 'org_stanton_scouts',
			name: 'Stanton Scouts',
			slug: 'stanton-scouts',
			description: 'Casual org for exploration and community missions.',
			image_url: null,
			owner_id: 'local-user-1',
			is_public: true,
			created_at: now
		}
	],
	organization_members: [
		{
			id: 'org_mem_1',
			organization_id: 'org_stanton_scouts',
			user_id: 'local-user-1',
			role: 'owner',
			joined_at: now
		}
	],
	organization_join_requests: [],
	profiles: [
		{ id: 'local-user-1', display_name: 'Local Tester', created_at: now }
	],
	auth_users: [
		{ id: 'local-user-1', email: 'local@test.lan', raw_user_meta_data: { role: 'admin' } }
	],
	user_inventory: [],
	user_reward_ingredients: [],
	user_reward_completions: [],
	user_favorite_rewards: [],
	user_favorite_ingredients: [],
	user_roles: [{ id: 'role_1', user_id: 'local-user-1', role: 'admin' }]
};

export function getTable(tableName: string): MockTableRow[] {
	if (tableName === 'auth.users') return mockDb.auth_users;
	if (tableName === 'locations_with_ingredients') {
		return mockDb.locations.map((location) => ({
			...location,
			ingredients: mockDb.ingredients
				.filter((ingredient) => ingredient.location_id === location.id)
				.map((ingredient) => ({
					id: ingredient.id,
					name_en: ingredient.name_en,
					name_fr: ingredient.name_fr,
					rarity: ingredient.rarity,
					category: ingredient.category,
					image_url: ingredient.image_url
				}))
		}));
	}
	return (mockDb as Record<string, MockTableRow[]>)[tableName] ?? [];
}
