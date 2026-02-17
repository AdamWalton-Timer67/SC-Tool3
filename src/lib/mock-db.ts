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
			id: 'reward_polaris',
			name_en: '',
			name_fr: '',
			type_en: '',
			type_fr: '',
			category: '',
			rarity: '',
			version: '',
			favor_cost: 0,
			description_en: '',
			description_fr: '',
			image_url: '/images/wikelo/polaris.jpeg',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_xdl_mark_i_monocular_rangefinder',
			name_en: 'XDL "Mark I" Monocular Rangefinder',
			name_fr: 'XDL "Mark I" Monocular Rangefinder',
			type_en: 'Utility',
			type_fr: 'Utilitaire',
			category: 'utility',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/xdl_mark_1_monocular_rangefinder.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_boomtube_clanguard_rocket_launcher',
			name_en: 'Boomtube "Clanguard" Rocket Launcher',
			name_fr: 'Boomtube "Clanguard" Rocket Launcher',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_parallax_fun_kopion_skull_energy_assault_rifle',
			name_en: 'Parallax "Fun Kopion Skull" Energy Assault Rifle',
			name_fr: 'Parallax "Fun Kopion Skull" Energy Assault Rifle',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/parallax_fun_kopion_skull.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_parallax_fun_military_skull_energy_assault_rifle',
			name_en: 'Parallax "Fun Military Skull" Energy Assault Rifle',
			name_fr: 'Parallax "Fun Military Skull" Energy Assault Rifle',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/parallax_fun_military_skull.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_parallax_fun_kopion_tooth_energy_assault_rifle',
			name_en: 'Parallax "Fun Kopion Tooth" Energy Assault Rifle',
			name_fr: 'Parallax "Fun Kopion Tooth" Energy Assault Rifle',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/parallax_fun_kopion_tooth.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_parallax_fun_military_tooth_energy_assault_rifle',
			name_en: 'Parallax "Fun Military Tooth" Energy Assault Rifle',
			name_fr: 'Parallax "Fun Military Tooth" Energy Assault Rifle',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/parallax_fun_military_tooth.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_prism_irradiated_laser_shotgun',
			name_en: 'Prism "Irradiated" Laser Shotgun',
			name_fr: 'Prism "Irradiated" Laser Shotgun',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/prism_irradiated_laser_shotgun.webp',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_zenith_snow_camo_laser_sniper_rifle',
			name_en: 'Zenith "Snow Camo" Laser Sniper Rifle',
			name_fr: 'Zenith "Snow Camo" Laser Sniper Rifle',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_fresnel_deepwater_energy_lmg',
			name_en: 'Fresnel "Deepwater" Energy LMG',
			name_fr: 'Fresnel "Deepwater" Energy LMG',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_fresnel_yormandi_lmg',
			name_en: 'Fresnel "Yormandi" LMG',
			name_fr: 'Fresnel "Yormandi" LMG',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/yormandi.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_quartz_cobalt_camo_energy_smg',
			name_en: 'Quartz "Cobalt Camo" Energy SMG',
			name_fr: 'Quartz "Cobalt Camo" Energy SMG',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/quartz_cobalt_camo.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_quartz_jungle_camo_energy_smg',
			name_en: 'Quartz "Jungle Camo" Energy SMG',
			name_fr: 'Quartz "Jungle Camo" Energy SMG',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/quartz_jungle_camo.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_quartz_hunter_camo_energy_smg',
			name_en: 'Quartz "Hunter Camo" Energy SMG',
			name_fr: 'Quartz "Hunter Camo" Energy SMG',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/quartz_hunter_camo.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_karna_ascension_rifle',
			name_en: 'Karna "Ascension" Rifle',
			name_fr: 'Karna "Ascension" Rifle',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/karna_gun_ascension.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_s71_ascension_rifle',
			name_en: 'S71 "Ascension" Rifle',
			name_fr: 'S71 "Ascension" Rifle',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/s71_riffle_ascension.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_coda_ascension_pistol',
			name_en: 'Coda "Ascension" Pistol',
			name_fr: 'Coda "Ascension" Pistol',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/coda_pistol_ascension.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_f55_mark_i_lmg',
			name_en: 'F55 "Mark I" LMG',
			name_fr: 'F55 "Mark I" LMG',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_tripledown_hot_shot_pistol',
			name_en: 'TripleDown "Hot Shot" Pistol',
			name_fr: 'TripleDown "Hot Shot" Pistol',
			type_en: 'Weapon',
			type_fr: 'Arme',
			category: 'weapons',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/tugnsten.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_xanthule_ascension',
			name_en: 'Xanthule Ascension',
			name_fr: 'Xanthule Ascension',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/xanthule_suit.webp',
			has_loadout: false,
			gives: 2,
			not_released: false
		},
		{
			id: 'reward_venture_ascension',
			name_en: 'Venture Ascension',
			name_fr: 'Venture Ascension',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/a_venture.png',
			has_loadout: false,
			gives: 4,
			not_released: false
		},
		{
			id: 'reward_novikov_ascension',
			name_en: 'Novikov "Ascension"',
			name_fr: 'Novikov "Ascension"',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/novikov_ascension_exploration.png',
			has_loadout: false,
			gives: 2,
			not_released: false
		},
		{
			id: 'reward_palatino_mark_1',
			name_en: 'Palatino Mark 1',
			name_fr: 'Palatino Mark 1',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/palatino_armor.png',
			has_loadout: false,
			gives: 5,
			not_released: false
		},
		{
			id: 'reward_geist_snow_camo',
			name_en: 'Geist Snow Camo',
			name_fr: 'Geist Snow Camo',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/geist_snow_camo_armor.png',
			has_loadout: false,
			gives: 5,
			not_released: false
		},
		{
			id: 'reward_corbel_crush',
			name_en: 'Corbel Crush',
			name_fr: 'Corbel Crush',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/corbel_crush_set.png',
			has_loadout: false,
			gives: 5,
			not_released: false
		},
		{
			id: 'reward_testudo_clanguard',
			name_en: 'Testudo Clanguard',
			name_fr: 'Testudo Clanguard',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 5,
			not_released: false
		},
		{
			id: 'reward_dcp_armor_jungle_camo',
			name_en: 'DCP Armor Jungle Camo',
			name_fr: 'DCP Armor Jungle Camo',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/dcp_armor_jungl_camo.png',
			has_loadout: false,
			gives: 4,
			not_released: false
		},
		{
			id: 'reward_dcp_armor_hunter_camo',
			name_en: 'DCP Armor Hunter Camo',
			name_fr: 'DCP Armor Hunter Camo',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/dcp_armor_hunter_camo.png',
			has_loadout: false,
			gives: 4,
			not_released: false
		},
		{
			id: 'reward_dcp_armor_cobalt_camo',
			name_en: 'DCP Armor Cobalt Camo',
			name_fr: 'DCP Armor Cobalt Camo',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/dcp_armor_cobalt_camo.png',
			has_loadout: false,
			gives: 4,
			not_released: false
		},
		{
			id: 'reward_ana_armor_endro',
			name_en: 'Ana Armor Endro',
			name_fr: 'Ana Armor Endro',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/endro_armor.png',
			has_loadout: false,
			gives: 4,
			not_released: false
		},
		{
			id: 'reward_bokto_set',
			name_en: 'Bokto',
			name_fr: 'Bokto',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/bokto.png',
			has_loadout: false,
			gives: 4,
			not_released: false
		},
		{
			id: 'reward_strata_lava',
			name_en: 'Strata Lava',
			name_fr: 'Strata Lava',
			type_en: 'Armor Set',
			type_fr: "Set d'armure",
			category: 'armor',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 4,
			not_released: false
		},
		{
			id: 'reward_atls_ikti',
			name_en: 'ATLS IKTI',
			name_fr: 'ATLS IKTI',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/atls_ikti.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_atls_geo_ikti',
			name_en: 'ATLS GEO IKTI',
			name_fr: 'ATLS GEO IKTI',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/atls_geo_ikti.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_atls_geo_snowland',
			name_en: 'ATLS GEO "Snowland"',
			name_fr: 'ATLS GEO "Snowland"',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/atls.webp',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_atls_geo_orange_line',
			name_en: 'ATLS GEO "Orange Line"',
			name_fr: 'ATLS GEO "Orange Line"',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/atls_orange_line.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_atls_geo_cool_metal',
			name_en: 'ATLS GEO "Cool Metal"',
			name_fr: 'ATLS GEO "Cool Metal"',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/atls.webp',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_nox',
			name_en: 'Nox',
			name_fr: 'Nox',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/nox.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_pulse',
			name_en: 'Pulse',
			name_fr: 'Pulse',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/pulse.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_ursa_medivac',
			name_en: 'Ursa Medivac',
			name_fr: 'Ursa Medivac',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/ursa_medivac.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_l_21_wolf',
			name_en: 'L-21 Wolf',
			name_fr: 'L-21 Wolf',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_golem',
			name_en: 'Golem',
			name_fr: 'Golem',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/golem.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_intrepid',
			name_en: 'Intrepid',
			name_fr: 'Intrepid',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/intrepid.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_fortune',
			name_en: 'Fortune',
			name_fr: 'Fortune',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/fortune.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_c1_spirit',
			name_en: 'C1 Spirit',
			name_fr: 'C1 Spirit',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/c1_spirit.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_zeus_mk_ii_es',
			name_en: 'Zeus Mk II ES',
			name_fr: 'Zeus Mk II ES',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_zeus_mk_ii_cl',
			name_en: 'Zeus Mk II CL',
			name_fr: 'Zeus Mk II CL',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_starlancer_max',
			name_en: 'Starlancer MAX',
			name_fr: 'Starlancer MAX',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/starlancer_max.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_constellation_taurus',
			name_en: 'Constellation Taurus',
			name_fr: 'Constellation Taurus',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/constellation_taurus.jpeg',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_sabre_peregrine',
			name_en: 'Sabre Peregrine',
			name_fr: 'Sabre Peregrine',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/sabre_peregrine.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_sabre_firebird',
			name_en: 'Sabre Firebird',
			name_fr: 'Sabre Firebird',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/sabre_firebird.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_scorpius',
			name_en: 'Scorpius',
			name_fr: 'Scorpius',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/scorpius.jpeg',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_f7c_m_super_hornet_mk_ii',
			name_en: 'F7C-M Super Hornet Mk II',
			name_fr: 'F7C-M Super Hornet Mk II',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_guardian',
			name_en: 'Guardian',
			name_fr: 'Guardian',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/guardian.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_guardian_qi',
			name_en: 'Guardian QI',
			name_fr: 'Guardian QI',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/guardian_qi.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_guardian_mx',
			name_en: 'Guardian MX',
			name_fr: 'Guardian MX',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/guardian_mx.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_f8c_lightning',
			name_en: 'F8C Lightning',
			name_fr: 'F8C Lightning',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/f8c_lightning_stealth.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_terrapin_medic',
			name_en: 'Terrapin Medic',
			name_fr: 'Terrapin Medic',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/terrapin_medic.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_starlancer_tac',
			name_en: 'Starlancer TAC',
			name_fr: 'Starlancer TAC',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/starlancer_tac.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_ares_star_fighter_inferno',
			name_en: 'Ares Star Fighter Inferno',
			name_fr: 'Ares Star Fighter Inferno',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/starlancer_tac.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_ares_star_fighter_ion',
			name_en: 'Ares Star Fighter Ion',
			name_fr: 'Ares Star Fighter Ion',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_prowler_utility',
			name_en: 'Prowler Utility',
			name_fr: 'Prowler Utility',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/prowler_utility.webp',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_a2_hercules_starlifter',
			name_en: 'A2 Hercules Starlifter',
			name_fr: 'A2 Hercules Starlifter',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/a2_hercules.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_asgard',
			name_en: 'Asgard',
			name_fr: 'Asgard',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/a2_hercules.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},
		{
			id: 'reward_meteor',
			name_en: 'Meteor',
			name_fr: 'Meteor',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/rsi_meteor.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		},

		{
			id: 'reward_idris_p',
			name_en: 'Idris-P',
			name_fr: 'Idris-P',
			type_en: 'Ship/Vehicle',
			type_fr: 'Vaisseau/Véhicule',
			category: 'ships',
			rarity: 'rare',
			version: '4.1',
			favor_cost: 0,
			description_en: 'Reward from Wikelo exchange contracts.',
			description_fr: 'Récompense issue des contrats Wikelo.',
			image_url: '/images/wikelo/unavailable.png',
			has_loadout: false,
			gives: 1,
			not_released: false
		}
	],
	ingredients: [
		{
			id: 'ing_wikelo_favor',
			name_en: 'Wikelo Favor',
			name_fr: 'Wikelo Favor',
			category: 'currency',
			rarity: 'rare',
			image_url: '/images/wikelo/wikelo_favor.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_yormandi_eye',
			name_en: 'Yormandi Eye',
			name_fr: 'Yormandi Eye',
			category: 'creature',
			rarity: 'rare',
			image_url: '/images/wikelo/yormandi_eye.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_yormandi_tongue',
			name_en: 'Yormandi Tongue',
			name_fr: 'Yormandi Tongue',
			category: 'creature',
			rarity: 'rare',
			image_url: '/images/wikelo/yormandi_tongue.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_boomtube_rocket_launcher',
			name_en: 'Boomtube Rocket Launcher',
			name_fr: 'Boomtube Rocket Launcher',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_vanduul_plating',
			name_en: 'Vanduul Plating',
			name_fr: 'Vanduul Plating',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_vanduul_metal',
			name_en: 'Vanduul Metal',
			name_fr: 'Vanduul Metal',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_jaclium',
			name_en: 'Jaclium',
			name_fr: 'Jaclium',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/jaclium.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_saldynium',
			name_en: 'Saldynium',
			name_fr: 'Saldynium',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/saldynium.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_carinite',
			name_en: 'Carinite',
			name_fr: 'Carinite',
			category: 'mineral',
			rarity: 'rare',
			image_url: '/images/wikelo/carinite.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_parallax_energy_assault_rifle',
			name_en: 'Parallax Energy Assault Rifle',
			name_fr: 'Parallax Energy Assault Rifle',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/parallax_energy_assault_rifle.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_tundra_kopion_horn',
			name_en: 'Tundra Kopion Horn',
			name_fr: 'Tundra Kopion Horn',
			category: 'creature',
			rarity: 'rare',
			image_url: '/images/wikelo/tundra_kopion_horn.jpeg',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_irradiated_valakkar_fang_juvenile',
			name_en: 'Irradiated Valakkar Fang (Juvenile)',
			name_fr: 'Irradiated Valakkar Fang (Juvenile)',
			category: 'creature',
			rarity: 'rare',
			image_url: '/images/wikelo/irradiated_valakkar_fang_juvenile.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_prism_laser_shotgun',
			name_en: 'Prism Laser Shotgun',
			name_fr: 'Prism Laser Shotgun',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/prism_laser_shotgun.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_irradiated_valakkar_fang_adult',
			name_en: 'Irradiated Valakkar Fang (Adult)',
			name_fr: 'Irradiated Valakkar Fang (Adult)',
			category: 'creature',
			rarity: 'epic',
			image_url: '/images/wikelo/irradiated_valakkar_fang_adult.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_asd_secure_drive',
			name_en: 'ASD Secure Drive',
			name_fr: 'ASD Secure Drive',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/asd_secure_drive.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_zenith_laser_sniper_rifle',
			name_en: 'Zenith Laser Sniper Rifle',
			name_fr: 'Zenith Laser Sniper Rifle',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/zenith_laser_sniper_rifle.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_fresnel_energy_lmg',
			name_en: 'Fresnel Energy LMG',
			name_fr: 'Fresnel Energy LMG',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/fresnel_energy_lmg.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_xtl_1',
			name_en: 'RCMBNT-XTL-1',
			name_fr: 'RCMBNT-XTL-1',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_xtl_2',
			name_en: 'RCMBNT-XTL-2',
			name_fr: 'RCMBNT-XTL-2',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_xtl_3',
			name_en: 'RCMBNT-XTL-3',
			name_fr: 'RCMBNT-XTL-3',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_quartz_energy_smg',
			name_en: 'Quartz Energy SMG',
			name_fr: 'Quartz Energy SMG',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/quartz_base.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_mg_scrip',
			name_en: 'MG Scrip',
			name_fr: 'MG Scrip',
			category: 'currency',
			rarity: 'rare',
			image_url: '/images/wikelo/mg_scrip.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_ace_interceptor_helmet',
			name_en: 'Ace Interceptor Helmet',
			name_fr: 'Ace Interceptor Helmet',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/ace_interceptor_helmet.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_grassland_quasi_grazer_egg',
			name_en: 'Grassland Quasi Grazer Egg',
			name_fr: 'Grassland Quasi Grazer Egg',
			category: 'creature',
			rarity: 'rare',
			image_url: '/images/wikelo/grassland_quasi_grazer_egg.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_council_scrip',
			name_en: 'Council Scrip',
			name_fr: 'Council Scrip',
			category: 'currency',
			rarity: 'rare',
			image_url: '/images/wikelo/council_scrip.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_advocacy_badge_replica',
			name_en: 'Advocacy Badge (Replica)',
			name_fr: 'Advocacy Badge (Replica)',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/advocacy_badge_replica.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_karna_rifle',
			name_en: 'Karna Rifle',
			name_fr: 'Karna Rifle',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/karna.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_irradiated_kopion_horn',
			name_en: 'Irradiated Kopion Horn',
			name_fr: 'Irradiated Kopion Horn',
			category: 'creature',
			rarity: 'rare',
			image_url: '/images/wikelo/irradiated_kopion_horn.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			name_en: 'Irradiated Valakkar Pearl (Grade AAA)',
			name_fr: 'Irradiated Valakkar Pearl (Grade AAA)',
			category: 'creature',
			rarity: 'legendary',
			image_url: '/images/wikelo/irradiated_valakkar_pearl.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_s71_rifle',
			name_en: 'S71 Rifle',
			name_fr: 'S71 Rifle',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/s71_rifle.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_carinite_pure',
			name_en: 'Carinite (Pure)',
			name_fr: 'Carinite (Pure)',
			category: 'mineral',
			rarity: 'legendary',
			image_url: '/images/wikelo/carinite.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_coda_pistol',
			name_en: 'Coda Pistol',
			name_fr: 'Coda Pistol',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/coda_pistol.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_tevarin_war_service_marker_pristine',
			name_en: 'Tevarin War Service Marker (Pristine)',
			name_fr: 'Tevarin War Service Marker (Pristine)',
			category: 'component',
			rarity: 'legendary',
			image_url: '/images/wikelo/tevarin_war_service_marker_pristine.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_f55_lmg',
			name_en: 'F55 LMG',
			name_fr: 'F55 LMG',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/f55_lmg.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_tripledown_hot_shot_pistol',
			name_en: 'tripledown hot shot pistol',
			name_fr: 'tripledown hot shot pistol',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/tugnsten.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_bluemoon_fungus',
			name_en: 'Bluemoon Fungus',
			name_fr: 'Bluemoon Fungus',
			category: 'creature',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_xanthule_suit',
			name_en: 'Xanthule Suit',
			name_fr: 'Xanthule Suit',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/xanthule_suit.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_xanthule_helmet',
			name_en: 'Xanthule Helmet',
			name_fr: 'Xanthule Helmet',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/xanthule_base_helmet.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_novikov_exploration_suit',
			name_en: 'Novikov Exploration Suit',
			name_fr: 'Novikov Exploration Suit',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/novkov_exploration_suit.webp',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_novikov_helmet',
			name_en: 'Novikov Helmet',
			name_fr: 'Novikov Helmet',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/novikov_helmet.jpg',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_venture_arms',
			name_en: 'Venture Arms',
			name_fr: 'Venture Arms',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_venture_core',
			name_en: 'Venture Core',
			name_fr: 'Venture Core',
			category: 'mineral',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_venture_helmet_white',
			name_en: 'Venture Helmet White',
			name_fr: 'Venture Helmet White',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_venture_legs',
			name_en: 'Venture Legs',
			name_fr: 'Venture Legs',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_palatino_helmet',
			name_en: 'Palatino Helmet',
			name_fr: 'Palatino Helmet',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/palatino_helmet.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_palatino_arms',
			name_en: 'Palatino Arms',
			name_fr: 'Palatino Arms',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/palatino_arms.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_palatino_legs',
			name_en: 'Palatino Legs',
			name_fr: 'Palatino Legs',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/palatino_legs.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_palatino_core',
			name_en: 'Palatino Core',
			name_fr: 'Palatino Core',
			category: 'mineral',
			rarity: 'rare',
			image_url: '/images/wikelo/palatino_core.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_palatino_backpack',
			name_en: 'Palatino Backpack',
			name_fr: 'Palatino Backpack',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/palatino_backpack.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_geist_armor_arms_asd_edition',
			name_en: 'Geist Armor Arms ASD Edition',
			name_fr: 'Geist Armor Arms ASD Edition',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_geist_armor_core_asd_edition',
			name_en: 'Geist Armor Core ASD Edition',
			name_fr: 'Geist Armor Core ASD Edition',
			category: 'mineral',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_geist_armor_helmet_asd_edition',
			name_en: 'Geist Armor Helmet ASD Edition',
			name_fr: 'Geist Armor Helmet ASD Edition',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_geist_armor_legs_asd_edition',
			name_en: 'Geist Armor Legs ASD Edition',
			name_fr: 'Geist Armor Legs ASD Edition',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_geist_backpack_asd_edition',
			name_en: 'Geist Backpack ASD Edition',
			name_fr: 'Geist Backpack ASD Edition',
			category: 'equipment',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required material for Wikelo contracts.',
			description_fr: 'Matériau requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions, exploration, and trading.',
			how_to_obtain_fr: 'Collecté via des missions, l’exploration et le commerce.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_wikelo_favor',
			name_en: 'Wikelo Favor',
			name_fr: 'Wikelo Favor',
			category: 'currency',
			rarity: 'rare',
			image_url: '/images/wikelo/wikelo_favor.webp',
			description_en: 'Exchange currency used for Wikelo rewards.',
			description_fr: 'Monnaie d’échange utilisée pour les récompenses Wikelo.',
			how_to_obtain_en: 'Earned through Wikelo contracts and exchanges.',
			how_to_obtain_fr: 'Obtenu via les contrats et échanges Wikelo.',
			location_id: locationPyroStation.id
		},
		{
			id: 'ing_polaris_bit',
			name_en: 'Polaris Bit',
			name_fr: 'Polaris Bit',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/polaris_bit.png',
			description_en: 'Specialized component recovered from Polaris systems.',
			description_fr: 'Composant spécialisé récupéré sur des systèmes Polaris.',
			how_to_obtain_en: 'Recovered from high-tier contracts and exchanges.',
			how_to_obtain_fr: 'Récupéré via des contrats et échanges de haut niveau.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_dchs_05_orbital_positioning_comp_board',
			name_en: 'DCHS-05 Orbital Positioning Comp-Board',
			name_fr: 'DCHS-05 Orbital Positioning Comp-Board',
			category: 'component',
			rarity: 'epic',
			image_url: '/images/wikelo/dchs_05_orbital.png',
			description_en: 'Orbital-grade navigation and targeting component.',
			description_fr: 'Composant de navigation et de ciblage de grade orbital.',
			how_to_obtain_en: 'Found in advanced salvage and mission chains.',
			how_to_obtain_fr: 'Trouvé dans des chaînes de missions et de récupération avancées.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_carinite',
			name_en: 'Carinite',
			name_fr: 'Carinite',
			category: 'mineral',
			rarity: 'rare',
			image_url: '/images/wikelo/carinite.webp',
			description_en: 'A refined mineral used in high-end exchanges.',
			description_fr: 'Un minerai raffiné utilisé dans les échanges haut de gamme.',
			how_to_obtain_en: 'Mine and refine in Pyro and contested sectors.',
			how_to_obtain_fr: 'Miner et raffiner dans Pyro et les secteurs contestés.',
			location_id: locationPyroStation.id
		},
		{
			id: 'ing_irradiated_valakkar_fang_apex',
			name_en: 'Irradiated Valakkar Fang (Apex)',
			name_fr: 'Croc de Valakkar Irradié (Apex)',
			category: 'creature',
			rarity: 'epic',
			image_url: '/images/wikelo/irradiated_valakkar_fang.png',
			description_en: 'Apex-grade trophy from the most dangerous Valakkar hunts.',
			description_fr: 'Trophée de niveau Apex provenant des chasses Valakkar les plus dangereuses.',
			how_to_obtain_en: 'Loot from apex irradiated Valakkar encounters.',
			how_to_obtain_fr: 'Butin d’affrontements avec des Valakkars irradiés Apex.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_mg_scrip',
			name_en: 'MG Scrip',
			name_fr: 'MG Scrip',
			category: 'currency',
			rarity: 'epic',
			image_url: '/images/wikelo/mg_scrip.webp',
			description_en: 'Trusted currency used for military-grade exchanges.',
			description_fr: 'Monnaie utilisée pour les échanges de qualité militaire.',
			how_to_obtain_en: 'Awarded by specific mission chains and events.',
			how_to_obtain_fr: 'Récompense de chaînes de missions et d’événements spécifiques.',
			location_id: locationPyroStation.id
		},
		{
			id: 'ing_ace_interceptor_helmet',
			name_en: 'Ace Interceptor Helmet',
			name_fr: 'Casque Ace Interceptor',
			category: 'equipment',
			rarity: 'epic',
			image_url: '/images/wikelo/ace_interceptor_helmet.png',
			description_en: 'Rare pilot helmet valued in elite exchanges.',
			description_fr: 'Casque de pilote rare prisé dans les échanges élite.',
			how_to_obtain_en: 'Recovered from high-tier caches and contracts.',
			how_to_obtain_fr: 'Récupéré dans des caches et contrats de haut niveau.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			name_en: 'Irradiated Valakkar Pearl (Grade AAA)',
			name_fr: 'Perle de Valakkar Irradiée (Grade AAA)',
			category: 'creature',
			rarity: 'legendary',
			image_url: '/images/wikelo/irradiated_valakkar_pearl.png',
			description_en: 'Top-grade pearl used in premium reward exchanges.',
			description_fr: 'Perle de premier ordre utilisée dans les échanges premium.',
			how_to_obtain_en: 'Loot from rare apex fauna encounters.',
			how_to_obtain_fr: 'Butin d’affrontements rares contre la faune apex.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_uee_6th_platoon_medal_pristine',
			name_en: 'UEE 6th Platoon Medal (Pristine)',
			name_fr: 'Médaille du 6e Peloton UEE (Parfaite)',
			category: 'artifact',
			rarity: 'legendary',
			image_url: '/images/wikelo/uue_6th.webp',
			description_en: 'Pristine military medal accepted in elite barter.',
			description_fr: 'Médaille militaire parfaite acceptée dans le troc élite.',
			how_to_obtain_en: 'Recovered from military relic caches.',
			how_to_obtain_fr: 'Récupérée dans des caches de reliques militaires.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_carinite_pure',
			name_en: 'Carinite (Pure)',
			name_fr: 'Carinite (Pure)',
			category: 'mineral',
			rarity: 'epic',
			image_url: '/images/wikelo/carinite.webp',
			description_en: 'Exceptionally pure Carinite for flagship-grade trades.',
			description_fr: 'Carinite d’une pureté exceptionnelle pour les échanges haut de gamme.',
			how_to_obtain_en: 'Refine premium Carinite deposits.',
			how_to_obtain_fr: 'Raffiner des gisements premium de Carinite.',
			location_id: locationPyroStation.id
		},
		{
			id: 'ing_asd_secure_drive',
			name_en: 'ASD Secure Drive',
			name_fr: 'Disque sécurisé ASD',
			category: 'component',
			rarity: 'epic',
			image_url: '/images/wikelo/asd_secure_drive.png',
			description_en: 'Encrypted storage component required for secure transactions.',
			description_fr: 'Composant de stockage chiffré requis pour les transactions sécurisées.',
			how_to_obtain_en: 'Loot from secure bunkers and mission rewards.',
			how_to_obtain_fr: 'Butin de bunkers sécurisés et récompenses de mission.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_pwl_1',
			name_en: 'RCMBNT-PWL-1',
			name_fr: 'RCMBNT-PWL-1',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_pwl_2',
			name_en: 'RCMBNT-PWL-2',
			name_fr: 'RCMBNT-PWL-2',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_pwl_3',
			name_en: 'RCMBNT-PWL-3',
			name_fr: 'RCMBNT-PWL-3',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_rgl_1',
			name_en: 'RCMBNT-RGL-1',
			name_fr: 'RCMBNT-RGL-1',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_rgl_2',
			name_en: 'RCMBNT-RGL-2',
			name_fr: 'RCMBNT-RGL-2',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_rgl_3',
			name_en: 'RCMBNT-RGL-3',
			name_fr: 'RCMBNT-RGL-3',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_xtl_1',
			name_en: 'RCMBNT-XTL-1',
			name_fr: 'RCMBNT-XTL-1',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RBCMBNT-XTL-1.webp',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_xtl_2',
			name_en: 'RCMBNT-XTL-2',
			name_fr: 'RCMBNT-XTL-2',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_rcmbnt_xtl_3',
			name_en: 'RCMBNT-XTL-3',
			name_fr: 'RCMBNT-XTL-3',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/RCMBNT.png',
			description_en: 'Recombinant module used in advanced manufacturing.',
			description_fr: 'Module recombinant utilisé dans la fabrication avancée.',
			how_to_obtain_en: 'Found in contract rewards and component crates.',
			how_to_obtain_fr: 'Trouvé dans les récompenses de contrats et caisses de composants.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_adp_mk4_core_woodland',
			name_en: 'ADP-mk4 Core Woodland',
			name_fr: 'ADP-mk4 Core Woodland',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_adp_mk4_arms_woodland',
			name_en: 'ADP-mk4 Arms Woodland',
			name_fr: 'ADP-mk4 Arms Woodland',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_adp_mk4_legs_woodland',
			name_en: 'ADP-mk4 Legs Woodland',
			name_fr: 'ADP-mk4 Legs Woodland',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_adp_mk4_helmet_woodland',
			name_en: 'ADP-mk4 Helmet Woodland',
			name_fr: 'ADP-mk4 Helmet Woodland',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_antium_armor_core',
			name_en: 'Antium Armor Core',
			name_fr: 'Antium Armor Core',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_antium_armor_helmet',
			name_en: 'Antium Armor Helmet',
			name_fr: 'Antium Armor Helmet',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_antium_armor_legs',
			name_en: 'Antium Armor Legs',
			name_fr: 'Antium Armor Legs',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_antium_armor_arms',
			name_en: 'Antium Armor Arms',
			name_fr: 'Antium Armor Arms',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_argo_atls',
			name_en: 'Argo ATLS',
			name_fr: 'Argo ATLS',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_argo_atls_geo',
			name_en: 'Argo ATLS Geo',
			name_fr: 'Argo ATLS Geo',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_argo_atls_ikti',
			name_en: 'Argo ATLS IKTI',
			name_fr: 'Argo ATLS IKTI',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_copper',
			name_en: 'Copper',
			name_fr: 'Copper',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_corundum',
			name_en: 'Corundum',
			name_fr: 'Corundum',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_corbel_helmet_mire',
			name_en: 'Corbel Helmet Mire',
			name_fr: 'Corbel Helmet Mire',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_corbel_core_mire',
			name_en: 'Corbel Core Mire',
			name_fr: 'Corbel Core Mire',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_corbel_arms_mire',
			name_en: 'Corbel Arms Mire',
			name_fr: 'Corbel Arms Mire',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_corbel_legs_mire',
			name_en: 'Corbel Legs Mire',
			name_fr: 'Corbel Legs Mire',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_novikov_backpack_mire',
			name_en: 'Novikov Backpack Mire',
			name_fr: 'Novikov Backpack Mire',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_government_cartography_agency_medal_pristine',
			name_en: 'Government Cartography Agency Medal (Pristine)',
			name_fr: 'Government Cartography Agency Medal (Pristine)',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_irradiated_valakkar_pearl_grade_aa',
			name_en: 'Irradiated Valakkar Pearl (Grade AA)',
			name_fr: 'Irradiated Valakkar Pearl (Grade AA)',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_large_artifact_fragment_pristine',
			name_en: 'Large Artifact Fragment (Pristine)',
			name_fr: 'Large Artifact Fragment (Pristine)',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_nn_13_cannon',
			name_en: 'NN-13 Cannon',
			name_fr: 'NN-13 Cannon',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_quantanium',
			name_en: 'Quantanium',
			name_fr: 'Quantanium',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_strata_core',
			name_en: 'Strata Core',
			name_fr: 'Strata Core',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_strata_helmet',
			name_en: 'Strata Helmet',
			name_fr: 'Strata Helmet',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_strata_legs',
			name_en: 'Strata Legs',
			name_fr: 'Strata Legs',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_strata_arms',
			name_en: 'Strata Arms',
			name_fr: 'Strata Arms',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_strata_backpack',
			name_en: 'Strata Backpack',
			name_fr: 'Strata Backpack',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_testudo_helmet_turfwar',
			name_en: 'Testudo Helmet Turfwar',
			name_fr: 'Testudo Helmet Turfwar',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_testudo_core_turfwar',
			name_en: 'Testudo Core Turfwar',
			name_fr: 'Testudo Core Turfwar',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_testudo_arms_turfwar',
			name_en: 'Testudo Arms Turfwar',
			name_fr: 'Testudo Arms Turfwar',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_testudo_legs_turfwar',
			name_en: 'Testudo Legs Turfwar',
			name_fr: 'Testudo Legs Turfwar',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_testudo_backpack_turfwar',
			name_en: 'Testudo Backpack Turfwar',
			name_fr: 'Testudo Backpack Turfwar',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_tripledown_pistol',
			name_en: 'Tripledown Pistol',
			name_fr: 'Tripledown Pistol',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
		{
			id: 'ing_tungsten',
			name_en: 'Tungsten',
			name_fr: 'Tungsten',
			category: 'component',
			rarity: 'rare',
			image_url: '/images/wikelo/unavailable.png',
			description_en: 'Required for Wikelo contracts.',
			description_fr: 'Requis pour les contrats Wikelo.',
			how_to_obtain_en: 'Collected through missions and exploration.',
			how_to_obtain_fr: 'Collecté via des missions et l\'exploration.',
			location_id: locationBloom.id
		},
	],
	reward_ingredients: [
		{
			id: 'ri_a2_hercules_starlifter_1',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_a2_hercules_starlifter_2',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_polaris_bit',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_a2_hercules_starlifter_3',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_mg_scrip',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_a2_hercules_starlifter_4',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_a2_hercules_starlifter_5',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_a2_hercules_starlifter_6',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_a2_hercules_starlifter_7',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_a2_hercules_starlifter_8',
			reward_id: 'reward_a2_hercules_starlifter',
			ingredient_id: 'ing_carinite_pure',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_1',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_saldynium',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_2',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_carinite',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_3',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_jaclium',
			quantity: 45,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_4',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_carinite_pure',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_5',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_antium_armor_core',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_6',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_antium_armor_helmet',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_7',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_antium_armor_legs',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_ana_armor_endro_8',
			reward_id: 'reward_ana_armor_endro',
			ingredient_id: 'ing_antium_armor_arms',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_inferno_1',
			reward_id: 'reward_ares_star_fighter_inferno',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_inferno_2',
			reward_id: 'reward_ares_star_fighter_inferno',
			ingredient_id: 'ing_yormandi_tongue',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_inferno_3',
			reward_id: 'reward_ares_star_fighter_inferno',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_inferno_4',
			reward_id: 'reward_ares_star_fighter_inferno',
			ingredient_id: 'ing_uee_6th_platoon_medal_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_ion_1',
			reward_id: 'reward_ares_star_fighter_ion',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_ion_2',
			reward_id: 'reward_ares_star_fighter_ion',
			ingredient_id: 'ing_yormandi_eye',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_ion_3',
			reward_id: 'reward_ares_star_fighter_ion',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_ares_star_fighter_ion_4',
			reward_id: 'reward_ares_star_fighter_ion',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_asgard_1',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_asgard_2',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_asgard_3',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_pwl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_4',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_pwl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_5',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_pwl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_6',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_rgl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_7',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_rgl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_8',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_rgl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_9',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_xtl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_10',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_xtl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_asgard_11',
			reward_id: 'reward_asgard',
			ingredient_id: 'ing_rcmbnt_xtl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_cool_metal_1',
			reward_id: 'reward_atls_geo_cool_metal',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_cool_metal_2',
			reward_id: 'reward_atls_geo_cool_metal',
			ingredient_id: 'ing_carinite',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_cool_metal_3',
			reward_id: 'reward_atls_geo_cool_metal',
			ingredient_id: 'ing_carinite_pure',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_cool_metal_4',
			reward_id: 'reward_atls_geo_cool_metal',
			ingredient_id: 'ing_argo_atls',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_ikti_1',
			reward_id: 'reward_atls_geo_ikti',
			ingredient_id: 'ing_argo_atls_geo',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_ikti_2',
			reward_id: 'reward_atls_geo_ikti',
			ingredient_id: 'ing_argo_atls_ikti',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_ikti_3',
			reward_id: 'reward_atls_geo_ikti',
			ingredient_id: 'ing_nn_13_cannon',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_ikti_4',
			reward_id: 'reward_atls_geo_ikti',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_orange_line_1',
			reward_id: 'reward_atls_geo_orange_line',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_orange_line_2',
			reward_id: 'reward_atls_geo_orange_line',
			ingredient_id: 'ing_quantanium',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_orange_line_3',
			reward_id: 'reward_atls_geo_orange_line',
			ingredient_id: 'ing_argo_atls',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_orange_line_4',
			reward_id: 'reward_atls_geo_orange_line',
			ingredient_id: 'ing_copper',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_orange_line_5',
			reward_id: 'reward_atls_geo_orange_line',
			ingredient_id: 'ing_tungsten',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_orange_line_6',
			reward_id: 'reward_atls_geo_orange_line',
			ingredient_id: 'ing_corundum',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_snowland_1',
			reward_id: 'reward_atls_geo_snowland',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_snowland_2',
			reward_id: 'reward_atls_geo_snowland',
			ingredient_id: 'ing_irradiated_valakkar_fang_adult',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_snowland_3',
			reward_id: 'reward_atls_geo_snowland',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_geo_snowland_4',
			reward_id: 'reward_atls_geo_snowland',
			ingredient_id: 'ing_argo_atls',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_ikti_1',
			reward_id: 'reward_atls_ikti',
			ingredient_id: 'ing_argo_atls',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_atls_ikti_2',
			reward_id: 'reward_atls_ikti',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_atls_ikti_3',
			reward_id: 'reward_atls_ikti',
			ingredient_id: 'ing_irradiated_valakkar_fang_apex',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_atls_ikti_4',
			reward_id: 'reward_atls_ikti',
			ingredient_id: 'ing_nn_13_cannon',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_bokto_set_1',
			reward_id: 'reward_bokto_set',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_bokto_set_2',
			reward_id: 'reward_bokto_set',
			ingredient_id: 'ing_antium_armor_core',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_bokto_set_3',
			reward_id: 'reward_bokto_set',
			ingredient_id: 'ing_antium_armor_helmet',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_bokto_set_4',
			reward_id: 'reward_bokto_set',
			ingredient_id: 'ing_antium_armor_legs',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_bokto_set_5',
			reward_id: 'reward_bokto_set',
			ingredient_id: 'ing_antium_armor_arms',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_boomtube_clanguard_rocket_launcher_1',
			reward_id: 'reward_boomtube_clanguard_rocket_launcher',
			ingredient_id: 'ing_boomtube_rocket_launcher',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_boomtube_clanguard_rocket_launcher_2',
			reward_id: 'reward_boomtube_clanguard_rocket_launcher',
			ingredient_id: 'ing_vanduul_plating',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_boomtube_clanguard_rocket_launcher_3',
			reward_id: 'reward_boomtube_clanguard_rocket_launcher',
			ingredient_id: 'ing_vanduul_metal',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_c1_spirit_1',
			reward_id: 'reward_c1_spirit',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 8,
			unit: 'x'
		},
		{
			id: 'ri_c1_spirit_2',
			reward_id: 'reward_c1_spirit',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_coda_ascension_pistol_1',
			reward_id: 'reward_coda_ascension_pistol',
			ingredient_id: 'ing_coda_pistol',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_coda_ascension_pistol_2',
			reward_id: 'reward_coda_ascension_pistol',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_coda_ascension_pistol_3',
			reward_id: 'reward_coda_ascension_pistol',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_coda_ascension_pistol_4',
			reward_id: 'reward_coda_ascension_pistol',
			ingredient_id: 'ing_mg_scrip',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_constellation_taurus_1',
			reward_id: 'reward_constellation_taurus',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_constellation_taurus_2',
			reward_id: 'reward_constellation_taurus',
			ingredient_id: 'ing_carinite_pure',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_constellation_taurus_3',
			reward_id: 'reward_constellation_taurus',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_constellation_taurus_4',
			reward_id: 'reward_constellation_taurus',
			ingredient_id: 'ing_government_cartography_agency_medal_pristine',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_1',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_corbel_helmet_mire',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_2',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_corbel_core_mire',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_3',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_corbel_arms_mire',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_4',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_corbel_legs_mire',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_5',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_novikov_backpack_mire',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_6',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_7',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_rcmbnt_rgl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_8',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_rcmbnt_rgl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_corbel_crush_9',
			reward_id: 'reward_corbel_crush',
			ingredient_id: 'ing_rcmbnt_rgl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_cobalt_camo_1',
			reward_id: 'reward_dcp_armor_cobalt_camo',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_cobalt_camo_2',
			reward_id: 'reward_dcp_armor_cobalt_camo',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_cobalt_camo_3',
			reward_id: 'reward_dcp_armor_cobalt_camo',
			ingredient_id: 'ing_grassland_quasi_grazer_egg',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_cobalt_camo_4',
			reward_id: 'reward_dcp_armor_cobalt_camo',
			ingredient_id: 'ing_adp_mk4_core_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_cobalt_camo_5',
			reward_id: 'reward_dcp_armor_cobalt_camo',
			ingredient_id: 'ing_adp_mk4_arms_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_cobalt_camo_6',
			reward_id: 'reward_dcp_armor_cobalt_camo',
			ingredient_id: 'ing_adp_mk4_legs_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_cobalt_camo_7',
			reward_id: 'reward_dcp_armor_cobalt_camo',
			ingredient_id: 'ing_adp_mk4_helmet_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_hunter_camo_1',
			reward_id: 'reward_dcp_armor_hunter_camo',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_hunter_camo_2',
			reward_id: 'reward_dcp_armor_hunter_camo',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_hunter_camo_3',
			reward_id: 'reward_dcp_armor_hunter_camo',
			ingredient_id: 'ing_advocacy_badge_replica',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_hunter_camo_4',
			reward_id: 'reward_dcp_armor_hunter_camo',
			ingredient_id: 'ing_adp_mk4_core_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_hunter_camo_5',
			reward_id: 'reward_dcp_armor_hunter_camo',
			ingredient_id: 'ing_adp_mk4_arms_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_hunter_camo_6',
			reward_id: 'reward_dcp_armor_hunter_camo',
			ingredient_id: 'ing_adp_mk4_legs_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_hunter_camo_7',
			reward_id: 'reward_dcp_armor_hunter_camo',
			ingredient_id: 'ing_adp_mk4_helmet_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_jungle_camo_1',
			reward_id: 'reward_dcp_armor_jungle_camo',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_jungle_camo_2',
			reward_id: 'reward_dcp_armor_jungle_camo',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_jungle_camo_3',
			reward_id: 'reward_dcp_armor_jungle_camo',
			ingredient_id: 'ing_irradiated_valakkar_fang_juvenile',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_jungle_camo_4',
			reward_id: 'reward_dcp_armor_jungle_camo',
			ingredient_id: 'ing_adp_mk4_core_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_jungle_camo_5',
			reward_id: 'reward_dcp_armor_jungle_camo',
			ingredient_id: 'ing_adp_mk4_arms_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_jungle_camo_6',
			reward_id: 'reward_dcp_armor_jungle_camo',
			ingredient_id: 'ing_adp_mk4_legs_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_dcp_armor_jungle_camo_7',
			reward_id: 'reward_dcp_armor_jungle_camo',
			ingredient_id: 'ing_adp_mk4_helmet_woodland',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_f55_mark_i_lmg_1',
			reward_id: 'reward_f55_mark_i_lmg',
			ingredient_id: 'ing_f55_lmg',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_f55_mark_i_lmg_2',
			reward_id: 'reward_f55_mark_i_lmg',
			ingredient_id: 'ing_yormandi_eye',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_f55_mark_i_lmg_3',
			reward_id: 'reward_f55_mark_i_lmg',
			ingredient_id: 'ing_yormandi_tongue',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_f55_mark_i_lmg_4',
			reward_id: 'reward_f55_mark_i_lmg',
			ingredient_id: 'ing_carinite',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_f7c_m_super_hornet_mk_ii_1',
			reward_id: 'reward_f7c_m_super_hornet_mk_ii',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 16,
			unit: 'x'
		},
		{
			id: 'ri_f7c_m_super_hornet_mk_ii_2',
			reward_id: 'reward_f7c_m_super_hornet_mk_ii',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_f7c_m_super_hornet_mk_ii_3',
			reward_id: 'reward_f7c_m_super_hornet_mk_ii',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_f7c_m_super_hornet_mk_ii_4',
			reward_id: 'reward_f7c_m_super_hornet_mk_ii',
			ingredient_id: 'ing_government_cartography_agency_medal_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_f8c_lightning_1',
			reward_id: 'reward_f8c_lightning',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 40,
			unit: 'x'
		},
		{
			id: 'ri_f8c_lightning_2',
			reward_id: 'reward_f8c_lightning',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_f8c_lightning_3',
			reward_id: 'reward_f8c_lightning',
			ingredient_id: 'ing_carinite_pure',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_f8c_lightning_4',
			reward_id: 'reward_f8c_lightning',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_fortune_1',
			reward_id: 'reward_fortune',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 6,
			unit: 'x'
		},
		{
			id: 'ri_fortune_2',
			reward_id: 'reward_fortune',
			ingredient_id: 'ing_carinite_pure',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_deepwater_energy_lmg_1',
			reward_id: 'reward_fresnel_deepwater_energy_lmg',
			ingredient_id: 'ing_fresnel_energy_lmg',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_deepwater_energy_lmg_2',
			reward_id: 'reward_fresnel_deepwater_energy_lmg',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_deepwater_energy_lmg_3',
			reward_id: 'reward_fresnel_deepwater_energy_lmg',
			ingredient_id: 'ing_rcmbnt_xtl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_deepwater_energy_lmg_4',
			reward_id: 'reward_fresnel_deepwater_energy_lmg',
			ingredient_id: 'ing_rcmbnt_xtl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_deepwater_energy_lmg_5',
			reward_id: 'reward_fresnel_deepwater_energy_lmg',
			ingredient_id: 'ing_rcmbnt_xtl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_yormandi_lmg_1',
			reward_id: 'reward_fresnel_yormandi_lmg',
			ingredient_id: 'ing_fresnel_energy_lmg',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_yormandi_lmg_2',
			reward_id: 'reward_fresnel_yormandi_lmg',
			ingredient_id: 'ing_yormandi_eye',
			quantity: 6,
			unit: 'x'
		},
		{
			id: 'ri_fresnel_yormandi_lmg_3',
			reward_id: 'reward_fresnel_yormandi_lmg',
			ingredient_id: 'ing_yormandi_tongue',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_geist_snow_camo_1',
			reward_id: 'reward_geist_snow_camo',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_geist_snow_camo_2',
			reward_id: 'reward_geist_snow_camo',
			ingredient_id: 'ing_geist_armor_arms_asd_edition',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_geist_snow_camo_3',
			reward_id: 'reward_geist_snow_camo',
			ingredient_id: 'ing_geist_armor_core_asd_edition',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_geist_snow_camo_4',
			reward_id: 'reward_geist_snow_camo',
			ingredient_id: 'ing_geist_armor_helmet_asd_edition',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_geist_snow_camo_5',
			reward_id: 'reward_geist_snow_camo',
			ingredient_id: 'ing_geist_armor_legs_asd_edition',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_geist_snow_camo_6',
			reward_id: 'reward_geist_snow_camo',
			ingredient_id: 'ing_geist_backpack_asd_edition',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_golem_1',
			reward_id: 'reward_golem',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_golem_2',
			reward_id: 'reward_golem',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_guardian_1',
			reward_id: 'reward_guardian',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_guardian_2',
			reward_id: 'reward_guardian',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aa',
			quantity: 24,
			unit: 'x'
		},
		{
			id: 'ri_guardian_3',
			reward_id: 'reward_guardian',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_guardian_4',
			reward_id: 'reward_guardian',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_guardian_mx_1',
			reward_id: 'reward_guardian_mx',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_guardian_mx_2',
			reward_id: 'reward_guardian_mx',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_guardian_mx_3',
			reward_id: 'reward_guardian_mx',
			ingredient_id: 'ing_large_artifact_fragment_pristine',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_guardian_mx_4',
			reward_id: 'reward_guardian_mx',
			ingredient_id: 'ing_vanduul_plating',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_guardian_mx_5',
			reward_id: 'reward_guardian_mx',
			ingredient_id: 'ing_vanduul_metal',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_guardian_qi_1',
			reward_id: 'reward_guardian_qi',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_guardian_qi_2',
			reward_id: 'reward_guardian_qi',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aa',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_guardian_qi_3',
			reward_id: 'reward_guardian_qi',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_guardian_qi_4',
			reward_id: 'reward_guardian_qi',
			ingredient_id: 'ing_uee_6th_platoon_medal_pristine',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_intrepid_1',
			reward_id: 'reward_intrepid',
			ingredient_id: 'ing_government_cartography_agency_medal_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_intrepid_2',
			reward_id: 'reward_intrepid',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_karna_ascension_rifle_1',
			reward_id: 'reward_karna_ascension_rifle',
			ingredient_id: 'ing_karna_rifle',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_karna_ascension_rifle_2',
			reward_id: 'reward_karna_ascension_rifle',
			ingredient_id: 'ing_irradiated_valakkar_fang_adult',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_karna_ascension_rifle_3',
			reward_id: 'reward_karna_ascension_rifle',
			ingredient_id: 'ing_irradiated_valakkar_fang_juvenile',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_karna_ascension_rifle_4',
			reward_id: 'reward_karna_ascension_rifle',
			ingredient_id: 'ing_irradiated_kopion_horn',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_karna_ascension_rifle_5',
			reward_id: 'reward_karna_ascension_rifle',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_l_21_wolf_1',
			reward_id: 'reward_l_21_wolf',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_l_21_wolf_2',
			reward_id: 'reward_l_21_wolf',
			ingredient_id: 'ing_vanduul_plating',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_l_21_wolf_3',
			reward_id: 'reward_l_21_wolf',
			ingredient_id: 'ing_vanduul_metal',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_l_21_wolf_4',
			reward_id: 'reward_l_21_wolf',
			ingredient_id: 'ing_large_artifact_fragment_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_meteor_1',
			reward_id: 'reward_meteor',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_meteor_2',
			reward_id: 'reward_meteor',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_meteor_3',
			reward_id: 'reward_meteor',
			ingredient_id: 'ing_large_artifact_fragment_pristine',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_meteor_4',
			reward_id: 'reward_meteor',
			ingredient_id: 'ing_vanduul_plating',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_meteor_5',
			reward_id: 'reward_meteor',
			ingredient_id: 'ing_vanduul_metal',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_novikov_ascension_1',
			reward_id: 'reward_novikov_ascension',
			ingredient_id: 'ing_novikov_exploration_suit',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_novikov_ascension_2',
			reward_id: 'reward_novikov_ascension',
			ingredient_id: 'ing_novikov_helmet',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_novikov_ascension_3',
			reward_id: 'reward_novikov_ascension',
			ingredient_id: 'ing_mg_scrip',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_novikov_ascension_4',
			reward_id: 'reward_novikov_ascension',
			ingredient_id: 'ing_irradiated_valakkar_fang_adult',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_novikov_ascension_5',
			reward_id: 'reward_novikov_ascension',
			ingredient_id: 'ing_irradiated_valakkar_fang_juvenile',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_novikov_ascension_6',
			reward_id: 'reward_novikov_ascension',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_nox_1',
			reward_id: 'reward_nox',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_palatino_mark_1_1',
			reward_id: 'reward_palatino_mark_1',
			ingredient_id: 'ing_palatino_helmet',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_palatino_mark_1_2',
			reward_id: 'reward_palatino_mark_1',
			ingredient_id: 'ing_palatino_arms',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_palatino_mark_1_3',
			reward_id: 'reward_palatino_mark_1',
			ingredient_id: 'ing_palatino_legs',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_palatino_mark_1_4',
			reward_id: 'reward_palatino_mark_1',
			ingredient_id: 'ing_palatino_core',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_palatino_mark_1_5',
			reward_id: 'reward_palatino_mark_1',
			ingredient_id: 'ing_palatino_backpack',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_palatino_mark_1_6',
			reward_id: 'reward_palatino_mark_1',
			ingredient_id: 'ing_yormandi_eye',
			quantity: 14,
			unit: 'x'
		},
		{
			id: 'ri_palatino_mark_1_7',
			reward_id: 'reward_palatino_mark_1',
			ingredient_id: 'ing_yormandi_tongue',
			quantity: 7,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_skull_energy_assault_rifle_1',
			reward_id: 'reward_parallax_fun_kopion_skull_energy_assault_rifle',
			ingredient_id: 'ing_jaclium',
			quantity: 40,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_skull_energy_assault_rifle_2',
			reward_id: 'reward_parallax_fun_kopion_skull_energy_assault_rifle',
			ingredient_id: 'ing_saldynium',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_skull_energy_assault_rifle_3',
			reward_id: 'reward_parallax_fun_kopion_skull_energy_assault_rifle',
			ingredient_id: 'ing_carinite',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_skull_energy_assault_rifle_4',
			reward_id: 'reward_parallax_fun_kopion_skull_energy_assault_rifle',
			ingredient_id: 'ing_parallax_energy_assault_rifle',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_skull_energy_assault_rifle_5',
			reward_id: 'reward_parallax_fun_kopion_skull_energy_assault_rifle',
			ingredient_id: 'ing_tundra_kopion_horn',
			quantity: 35,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_tooth_energy_assault_rifle_1',
			reward_id: 'reward_parallax_fun_kopion_tooth_energy_assault_rifle',
			ingredient_id: 'ing_jaclium',
			quantity: 40,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_tooth_energy_assault_rifle_2',
			reward_id: 'reward_parallax_fun_kopion_tooth_energy_assault_rifle',
			ingredient_id: 'ing_saldynium',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_tooth_energy_assault_rifle_3',
			reward_id: 'reward_parallax_fun_kopion_tooth_energy_assault_rifle',
			ingredient_id: 'ing_carinite',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_tooth_energy_assault_rifle_4',
			reward_id: 'reward_parallax_fun_kopion_tooth_energy_assault_rifle',
			ingredient_id: 'ing_parallax_energy_assault_rifle',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_kopion_tooth_energy_assault_rifle_5',
			reward_id: 'reward_parallax_fun_kopion_tooth_energy_assault_rifle',
			ingredient_id: 'ing_tundra_kopion_horn',
			quantity: 35,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_skull_energy_assault_rifle_1',
			reward_id: 'reward_parallax_fun_military_skull_energy_assault_rifle',
			ingredient_id: 'ing_jaclium',
			quantity: 40,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_skull_energy_assault_rifle_2',
			reward_id: 'reward_parallax_fun_military_skull_energy_assault_rifle',
			ingredient_id: 'ing_saldynium',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_skull_energy_assault_rifle_3',
			reward_id: 'reward_parallax_fun_military_skull_energy_assault_rifle',
			ingredient_id: 'ing_carinite',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_skull_energy_assault_rifle_4',
			reward_id: 'reward_parallax_fun_military_skull_energy_assault_rifle',
			ingredient_id: 'ing_parallax_energy_assault_rifle',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_skull_energy_assault_rifle_5',
			reward_id: 'reward_parallax_fun_military_skull_energy_assault_rifle',
			ingredient_id: 'ing_irradiated_valakkar_fang_juvenile',
			quantity: 35,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_tooth_energy_assault_rifle_1',
			reward_id: 'reward_parallax_fun_military_tooth_energy_assault_rifle',
			ingredient_id: 'ing_jaclium',
			quantity: 40,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_tooth_energy_assault_rifle_2',
			reward_id: 'reward_parallax_fun_military_tooth_energy_assault_rifle',
			ingredient_id: 'ing_saldynium',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_tooth_energy_assault_rifle_3',
			reward_id: 'reward_parallax_fun_military_tooth_energy_assault_rifle',
			ingredient_id: 'ing_carinite',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_tooth_energy_assault_rifle_4',
			reward_id: 'reward_parallax_fun_military_tooth_energy_assault_rifle',
			ingredient_id: 'ing_parallax_energy_assault_rifle',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_parallax_fun_military_tooth_energy_assault_rifle_5',
			reward_id: 'reward_parallax_fun_military_tooth_energy_assault_rifle',
			ingredient_id: 'ing_irradiated_valakkar_fang_juvenile',
			quantity: 35,
			unit: 'x'
		},
		{
			id: 'ri_polaris_1',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_polaris_2',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_polaris_bit',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_polaris_3',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_polaris_4',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_pwl_1',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_5',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_pwl_2',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_6',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_pwl_3',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_7',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_rgl_1',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_8',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_rgl_2',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_9',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_rgl_3',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_10',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_xtl_1',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_11',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_xtl_2',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_12',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_rcmbnt_xtl_3',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_polaris_13',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_polaris_14',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_carinite',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_polaris_15',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_irradiated_valakkar_fang_apex',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_polaris_16',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_mg_scrip',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_polaris_17',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_polaris_18',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_polaris_19',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_uee_6th_platoon_medal_pristine',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_polaris_20',
			reward_id: 'reward_polaris',
			ingredient_id: 'ing_carinite_pure',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_idris_1',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_idris_2',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_polaris_bit',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_idris_3',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_idris_4',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_carinite',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_idris_5',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_irradiated_valakkar_fang_apex',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_idris_6',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_mg_scrip',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_idris_7',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_idris_8',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_idris_9',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_uee_6th_platoon_medal_pristine',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_idris_10',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_carinite_pure',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_idris_11',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_idris_12',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_pwl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_13',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_pwl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_14',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_pwl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_15',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_rgl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_16',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_rgl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_17',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_rgl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_18',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_xtl_1',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_19',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_xtl_2',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_idris_20',
			reward_id: 'reward_idris_p',
			ingredient_id: 'ing_rcmbnt_xtl_3',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_prism_irradiated_laser_shotgun_1',
			reward_id: 'reward_prism_irradiated_laser_shotgun',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_prism_irradiated_laser_shotgun_2',
			reward_id: 'reward_prism_irradiated_laser_shotgun',
			ingredient_id: 'ing_prism_laser_shotgun',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_prism_irradiated_laser_shotgun_3',
			reward_id: 'reward_prism_irradiated_laser_shotgun',
			ingredient_id: 'ing_irradiated_valakkar_fang_juvenile',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_prism_irradiated_laser_shotgun_4',
			reward_id: 'reward_prism_irradiated_laser_shotgun',
			ingredient_id: 'ing_irradiated_valakkar_fang_adult',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_prowler_utility_1',
			reward_id: 'reward_prowler_utility',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 40,
			unit: 'x'
		},
		{
			id: 'ri_prowler_utility_2',
			reward_id: 'reward_prowler_utility',
			ingredient_id: 'ing_yormandi_eye',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_prowler_utility_3',
			reward_id: 'reward_prowler_utility',
			ingredient_id: 'ing_yormandi_tongue',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_prowler_utility_4',
			reward_id: 'reward_prowler_utility',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_prowler_utility_5',
			reward_id: 'reward_prowler_utility',
			ingredient_id: 'ing_carinite_pure',
			quantity: 3,
			unit: 'x'
		},
		{
			id: 'ri_pulse_1',
			reward_id: 'reward_pulse',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_quartz_cobalt_camo_energy_smg_1',
			reward_id: 'reward_quartz_cobalt_camo_energy_smg',
			ingredient_id: 'ing_quartz_energy_smg',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_quartz_cobalt_camo_energy_smg_2',
			reward_id: 'reward_quartz_cobalt_camo_energy_smg',
			ingredient_id: 'ing_mg_scrip',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_quartz_cobalt_camo_energy_smg_3',
			reward_id: 'reward_quartz_cobalt_camo_energy_smg',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_quartz_cobalt_camo_energy_smg_4',
			reward_id: 'reward_quartz_cobalt_camo_energy_smg',
			ingredient_id: 'ing_grassland_quasi_grazer_egg',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_quartz_hunter_camo_energy_smg_1',
			reward_id: 'reward_quartz_hunter_camo_energy_smg',
			ingredient_id: 'ing_quartz_energy_smg',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_quartz_hunter_camo_energy_smg_2',
			reward_id: 'reward_quartz_hunter_camo_energy_smg',
			ingredient_id: 'ing_council_scrip',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_quartz_hunter_camo_energy_smg_3',
			reward_id: 'reward_quartz_hunter_camo_energy_smg',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_quartz_hunter_camo_energy_smg_4',
			reward_id: 'reward_quartz_hunter_camo_energy_smg',
			ingredient_id: 'ing_advocacy_badge_replica',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_quartz_jungle_camo_energy_smg_1',
			reward_id: 'reward_quartz_jungle_camo_energy_smg',
			ingredient_id: 'ing_quartz_energy_smg',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_quartz_jungle_camo_energy_smg_2',
			reward_id: 'reward_quartz_jungle_camo_energy_smg',
			ingredient_id: 'ing_mg_scrip',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_quartz_jungle_camo_energy_smg_3',
			reward_id: 'reward_quartz_jungle_camo_energy_smg',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_quartz_jungle_camo_energy_smg_4',
			reward_id: 'reward_quartz_jungle_camo_energy_smg',
			ingredient_id: 'ing_tundra_kopion_horn',
			quantity: 35,
			unit: 'x'
		},
		{
			id: 'ri_s71_ascension_rifle_1',
			reward_id: 'reward_s71_ascension_rifle',
			ingredient_id: 'ing_s71_rifle',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_s71_ascension_rifle_2',
			reward_id: 'reward_s71_ascension_rifle',
			ingredient_id: 'ing_carinite',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_s71_ascension_rifle_3',
			reward_id: 'reward_s71_ascension_rifle',
			ingredient_id: 'ing_saldynium',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_s71_ascension_rifle_4',
			reward_id: 'reward_s71_ascension_rifle',
			ingredient_id: 'ing_jaclium',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_s71_ascension_rifle_5',
			reward_id: 'reward_s71_ascension_rifle',
			ingredient_id: 'ing_carinite_pure',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_sabre_firebird_1',
			reward_id: 'reward_sabre_firebird',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_sabre_firebird_2',
			reward_id: 'reward_sabre_firebird',
			ingredient_id: 'ing_polaris_bit',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_sabre_firebird_3',
			reward_id: 'reward_sabre_firebird',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 6,
			unit: 'x'
		},
		{
			id: 'ri_sabre_firebird_4',
			reward_id: 'reward_sabre_firebird',
			ingredient_id: 'ing_government_cartography_agency_medal_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_sabre_peregrine_1',
			reward_id: 'reward_sabre_peregrine',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 8,
			unit: 'x'
		},
		{
			id: 'ri_sabre_peregrine_2',
			reward_id: 'reward_sabre_peregrine',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_scorpius_1',
			reward_id: 'reward_scorpius',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_scorpius_2',
			reward_id: 'reward_scorpius',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 6,
			unit: 'x'
		},
		{
			id: 'ri_scorpius_3',
			reward_id: 'reward_scorpius',
			ingredient_id: 'ing_carinite',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_scorpius_4',
			reward_id: 'reward_scorpius',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_max_1',
			reward_id: 'reward_starlancer_max',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_max_2',
			reward_id: 'reward_starlancer_max',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_max_3',
			reward_id: 'reward_starlancer_max',
			ingredient_id: 'ing_carinite_pure',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_max_4',
			reward_id: 'reward_starlancer_max',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_max_5',
			reward_id: 'reward_starlancer_max',
			ingredient_id: 'ing_government_cartography_agency_medal_pristine',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_tac_1',
			reward_id: 'reward_starlancer_tac',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_tac_2',
			reward_id: 'reward_starlancer_tac',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_tac_3',
			reward_id: 'reward_starlancer_tac',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 50,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_tac_4',
			reward_id: 'reward_starlancer_tac',
			ingredient_id: 'ing_irradiated_valakkar_pearl_grade_aaa',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_tac_5',
			reward_id: 'reward_starlancer_tac',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_tac_6',
			reward_id: 'reward_starlancer_tac',
			ingredient_id: 'ing_carinite_pure',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_starlancer_tac_7',
			reward_id: 'reward_starlancer_tac',
			ingredient_id: 'ing_dchs_05_orbital_positioning_comp_board',
			quantity: 5,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_1',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_strata_core',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_2',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_strata_helmet',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_3',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_strata_legs',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_4',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_strata_arms',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_5',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_strata_backpack',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_6',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_carinite',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_7',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_rcmbnt_pwl_1',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_8',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_rcmbnt_pwl_2',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_strata_lava_9',
			reward_id: 'reward_strata_lava',
			ingredient_id: 'ing_rcmbnt_pwl_3',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_terrapin_medic_1',
			reward_id: 'reward_terrapin_medic',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_terrapin_medic_2',
			reward_id: 'reward_terrapin_medic',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_terrapin_medic_3',
			reward_id: 'reward_terrapin_medic',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_testudo_clanguard_1',
			reward_id: 'reward_testudo_clanguard',
			ingredient_id: 'ing_testudo_helmet_turfwar',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_testudo_clanguard_2',
			reward_id: 'reward_testudo_clanguard',
			ingredient_id: 'ing_testudo_core_turfwar',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_testudo_clanguard_3',
			reward_id: 'reward_testudo_clanguard',
			ingredient_id: 'ing_testudo_arms_turfwar',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_testudo_clanguard_4',
			reward_id: 'reward_testudo_clanguard',
			ingredient_id: 'ing_testudo_legs_turfwar',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_testudo_clanguard_5',
			reward_id: 'reward_testudo_clanguard',
			ingredient_id: 'ing_testudo_backpack_turfwar',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_testudo_clanguard_6',
			reward_id: 'reward_testudo_clanguard',
			ingredient_id: 'ing_vanduul_plating',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_testudo_clanguard_7',
			reward_id: 'reward_testudo_clanguard',
			ingredient_id: 'ing_vanduul_metal',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_tripledown_hot_shot_pistol_1',
			reward_id: 'reward_tripledown_hot_shot_pistol',
			ingredient_id: 'ing_tripledown_pistol',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_tripledown_hot_shot_pistol_2',
			reward_id: 'reward_tripledown_hot_shot_pistol',
			ingredient_id: 'ing_bluemoon_fungus',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_tripledown_hot_shot_pistol_3',
			reward_id: 'reward_tripledown_hot_shot_pistol',
			ingredient_id: 'ing_carinite',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_ursa_medivac_1',
			reward_id: 'reward_ursa_medivac',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 4,
			unit: 'x'
		},
		{
			id: 'ri_ursa_medivac_2',
			reward_id: 'reward_ursa_medivac',
			ingredient_id: 'ing_saldynium',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_ursa_medivac_3',
			reward_id: 'reward_ursa_medivac',
			ingredient_id: 'ing_jaclium',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_1',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_venture_arms',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_2',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_venture_core',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_3',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_venture_helmet_white',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_4',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_venture_legs',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_5',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_mg_scrip',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_6',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_saldynium',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_7',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_jaclium',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_venture_ascension_8',
			reward_id: 'reward_venture_ascension',
			ingredient_id: 'ing_carinite_pure',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_xanthule_ascension_1',
			reward_id: 'reward_xanthule_ascension',
			ingredient_id: 'ing_xanthule_suit',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_xanthule_ascension_2',
			reward_id: 'reward_xanthule_ascension',
			ingredient_id: 'ing_xanthule_helmet',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_xanthule_ascension_3',
			reward_id: 'reward_xanthule_ascension',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_xanthule_ascension_4',
			reward_id: 'reward_xanthule_ascension',
			ingredient_id: 'ing_tevarin_war_service_marker_pristine',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_xanthule_ascension_5',
			reward_id: 'reward_xanthule_ascension',
			ingredient_id: 'ing_mg_scrip',
			quantity: 20,
			unit: 'x'
		},
		{
			id: 'ri_xdl_mark_i_monocular_rangefinder_1',
			reward_id: 'reward_xdl_mark_i_monocular_rangefinder',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_xdl_mark_i_monocular_rangefinder_2',
			reward_id: 'reward_xdl_mark_i_monocular_rangefinder',
			ingredient_id: 'ing_yormandi_eye',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_xdl_mark_i_monocular_rangefinder_3',
			reward_id: 'reward_xdl_mark_i_monocular_rangefinder',
			ingredient_id: 'ing_yormandi_tongue',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_zenith_snow_camo_laser_sniper_rifle_1',
			reward_id: 'reward_zenith_snow_camo_laser_sniper_rifle',
			ingredient_id: 'ing_asd_secure_drive',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_zenith_snow_camo_laser_sniper_rifle_2',
			reward_id: 'reward_zenith_snow_camo_laser_sniper_rifle',
			ingredient_id: 'ing_zenith_laser_sniper_rifle',
			quantity: 1,
			unit: 'x'
		},
		{
			id: 'ri_zeus_mk_ii_cl_1',
			reward_id: 'reward_zeus_mk_ii_cl',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 30,
			unit: 'x'
		},
		{
			id: 'ri_zeus_mk_ii_cl_2',
			reward_id: 'reward_zeus_mk_ii_cl',
			ingredient_id: 'ing_carinite',
			quantity: 24,
			unit: 'x'
		},
		{
			id: 'ri_zeus_mk_ii_cl_3',
			reward_id: 'reward_zeus_mk_ii_cl',
			ingredient_id: 'ing_ace_interceptor_helmet',
			quantity: 15,
			unit: 'x'
		},
		{
			id: 'ri_zeus_mk_ii_cl_4',
			reward_id: 'reward_zeus_mk_ii_cl',
			ingredient_id: 'ing_carinite_pure',
			quantity: 2,
			unit: 'x'
		},
		{
			id: 'ri_zeus_mk_ii_es_1',
			reward_id: 'reward_zeus_mk_ii_es',
			ingredient_id: 'ing_wikelo_favor',
			quantity: 10,
			unit: 'x'
		},
		{
			id: 'ri_zeus_mk_ii_es_2',
			reward_id: 'reward_zeus_mk_ii_es',
			ingredient_id: 'ing_uee_6th_platoon_medal_pristine',
			quantity: 2,
			unit: 'x'
		},
	],
	reputation_requirements: [],
	locations: [locationPyroStation, locationBloom],
	suggestions: [
		{
			id: 'sug_1',
			item_type: 'ingredient',
			item_id: 'ing_carinite',
			item_name: 'Carinite',
			suggestion_type: 'location_update',
			content: 'Found in larger quantities around Pyro outposts in 4.1.',
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
	profiles: [{ id: 'local-user-1', display_name: 'Local Tester', created_at: now }],
	auth_users: [
		{
			id: 'local-user-1',
			email: 'local@test.lan',
			password: 'admin123',
			approved: true,
			raw_user_meta_data: { role: 'admin', display_name: 'Local Tester' }
		}
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
