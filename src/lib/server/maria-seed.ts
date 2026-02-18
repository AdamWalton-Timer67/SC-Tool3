import { mockDb } from '$lib/mock-db';
import { getMariaPool, hasMariaConfig } from '$lib/server/maria';

function asJson(value: unknown): string | null {
	if (value === undefined || value === null) return null;
	return JSON.stringify(value);
}

async function ensureSchemaCompatibility() {
	const pool = getMariaPool();
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS type_en VARCHAR(255) NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS type_fr VARCHAR(255) NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS version VARCHAR(64) NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS favor_cost INT NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS description_en TEXT NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS description_fr TEXT NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS image_credit VARCHAR(255) NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS mission_name_en VARCHAR(255) NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS mission_name_fr VARCHAR(255) NULL');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS has_loadout TINYINT(1) NOT NULL DEFAULT 0');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS gives INT NOT NULL DEFAULT 1');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS not_released TINYINT(1) NOT NULL DEFAULT 0');
	await pool.query('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS components LONGTEXT NULL');

	await pool.query('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS image_credit VARCHAR(255) NULL');
	await pool.query('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS description_en TEXT NULL');
	await pool.query('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS description_fr TEXT NULL');
	await pool.query('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS how_to_obtain_en TEXT NULL');
	await pool.query('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS how_to_obtain_fr TEXT NULL');
	await pool.query('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS locations_en LONGTEXT NULL');
	await pool.query('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS locations_fr LONGTEXT NULL');

	await pool.query('ALTER TABLE reward_ingredients ADD COLUMN IF NOT EXISTS unit VARCHAR(32) NULL');

	await pool.query('ALTER TABLE reputation_requirements ADD COLUMN IF NOT EXISTS reputation_name_en VARCHAR(255) NULL');
	await pool.query('ALTER TABLE reputation_requirements ADD COLUMN IF NOT EXISTS reputation_name_fr VARCHAR(255) NULL');
	await pool.query('ALTER TABLE reputation_requirements ADD COLUMN IF NOT EXISTS required_level INT NULL');
}

let schemaCompatibilityPromise: Promise<void> | null = null;
let seedDataPromise: Promise<void> | null = null;

async function ensureSchemaCompatibilityOnce() {
	if (!schemaCompatibilityPromise) {
		schemaCompatibilityPromise = ensureSchemaCompatibility().catch((error) => {
			schemaCompatibilityPromise = null;
			throw error;
		});
	}
	await schemaCompatibilityPromise;
}

export async function ensureMariaWikeloSeedData(): Promise<void> {
	if (!hasMariaConfig()) return;

	if (seedDataPromise) {
		await seedDataPromise;
		return;
	}

	seedDataPromise = (async () => {
		await ensureSchemaCompatibilityOnce();

		const pool = getMariaPool();
		const [countRows] = await pool.query<any[]>('SELECT COUNT(*) AS c FROM rewards');
		if ((countRows?.[0]?.c ?? 0) > 0) return;

		for (const location of mockDb.locations as any[]) {
			await pool.query(
			`INSERT IGNORE INTO locations (
				id, slug, type, system, planet, moon,
				name_en, name_fr,
				short_description_en, short_description_fr,
				description_en, description_fr,
				how_to_access_en, how_to_access_fr,
				mission_types_en, mission_types_fr,
				loot_types_en, loot_types_fr,
				image_url, image_credit, cheatsheet_image_url,
				requirements, rewards, difficulty, coordinates
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				location.id,
				location.slug,
				location.type ?? null,
				location.system ?? null,
				location.planet ?? null,
				location.moon ?? null,
				location.name_en,
				location.name_fr,
				location.short_description_en ?? null,
				location.short_description_fr ?? null,
				location.description_en ?? null,
				location.description_fr ?? null,
				location.how_to_access_en ?? null,
				location.how_to_access_fr ?? null,
				location.mission_types_en ?? null,
				location.mission_types_fr ?? null,
				location.loot_types_en ?? null,
				location.loot_types_fr ?? null,
				location.image_url ?? null,
				location.image_credit ?? null,
				location.cheatsheet_image_url ?? null,
				location.requirements ?? null,
				location.rewards ?? null,
				location.difficulty ?? null,
				location.coordinates ?? null
			]
			);
		}

		for (const ingredient of mockDb.ingredients as any[]) {
			await pool.query(
			`INSERT IGNORE INTO ingredients (
				id, category, rarity, name_en, name_fr,
				image_url, image_credit,
				description_en, description_fr,
				how_to_obtain_en, how_to_obtain_fr,
				locations_en, locations_fr,
				location_id, game_version, source_name, source_details_en, source_details_fr, source_url
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				ingredient.id,
				ingredient.category ?? 'other',
				ingredient.rarity ?? 'common',
				ingredient.name_en,
				ingredient.name_fr,
				ingredient.image_url ?? null,
				ingredient.image_credit ?? null,
				ingredient.description_en ?? null,
				ingredient.description_fr ?? null,
				ingredient.how_to_obtain_en ?? null,
				ingredient.how_to_obtain_fr ?? null,
				asJson(ingredient.locations_en),
				asJson(ingredient.locations_fr),
				ingredient.location_id ?? null,
				ingredient.game_version ?? null,
				ingredient.source_name ?? null,
				ingredient.source_details_en ?? null,
				ingredient.source_details_fr ?? null,
				ingredient.source_url ?? null
			]
			);
		}

		for (const reward of mockDb.rewards as any[]) {
			await pool.query(
			`INSERT IGNORE INTO rewards (
				id, category, rarity,
				name_en, name_fr, type_en, type_fr,
				version, favor_cost,
				description_en, description_fr,
				image_url, image_credit,
				mission_name_en, mission_name_fr,
				has_loadout, gives, not_released, components,
				game_version, source_name, source_type, source_details_en, source_details_fr, source_url
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				reward.id,
				reward.category ?? 'utility',
				reward.rarity ?? 'common',
				reward.name_en ?? reward.id,
				reward.name_fr ?? reward.name_en ?? reward.id,
				reward.type_en ?? null,
				reward.type_fr ?? null,
				reward.version ?? null,
				reward.favor_cost ?? 0,
				reward.description_en ?? null,
				reward.description_fr ?? null,
				reward.image_url ?? null,
				reward.image_credit ?? null,
				reward.mission_name_en ?? null,
				reward.mission_name_fr ?? null,
				reward.has_loadout ? 1 : 0,
				reward.gives ?? 1,
				reward.not_released ? 1 : 0,
				asJson(reward.components),
				reward.game_version ?? null,
				reward.source_name ?? null,
				reward.source_type ?? null,
				reward.source_details_en ?? null,
				reward.source_details_fr ?? null,
				reward.source_url ?? null
			]
			);
		}

		for (const row of mockDb.reward_ingredients as any[]) {
			await pool.query(
			'INSERT IGNORE INTO reward_ingredients (id, reward_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?, ?)',
			[row.id, row.reward_id, row.ingredient_id, row.quantity ?? 1, row.unit ?? null]
			);
		}

		for (const row of mockDb.reputation_requirements as any[]) {
			await pool.query(
			`INSERT IGNORE INTO reputation_requirements (
				id, reward_id, faction, level, reputation_name_en, reputation_name_fr, required_level
			) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				row.id,
				row.reward_id,
				row.faction ?? row.reputation_name_en ?? 'Unknown',
				row.level ?? row.required_level ?? 1,
				row.reputation_name_en ?? null,
				row.reputation_name_fr ?? null,
				row.required_level ?? row.level ?? 1
			]
			);
		}
	})();

	try {
		await seedDataPromise;
	} catch (error) {
		seedDataPromise = null;
		throw error;
	}
}
