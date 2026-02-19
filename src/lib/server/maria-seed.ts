import { hasMariaConfig } from '$lib/server/maria';

async function ensureSchemaCompatibility() {
	const { getMariaPool } = await import('$lib/server/maria');
	const pool = getMariaPool();
	const safeAlter = async (sql: string) => {
		try {
			await pool.query(sql);
		} catch (error) {
			console.warn('Schema compatibility warning (non-fatal):', (error as Error).message);
		}
	};
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS type_en VARCHAR(255) NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS type_fr VARCHAR(255) NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS version VARCHAR(64) NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS favor_cost INT NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS description_en TEXT NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS description_fr TEXT NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS image_credit VARCHAR(255) NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS mission_name_en VARCHAR(255) NULL');
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS mission_name_fr VARCHAR(255) NULL');
	await safeAlter(
		'ALTER TABLE rewards ADD COLUMN IF NOT EXISTS has_loadout TINYINT(1) NOT NULL DEFAULT 0'
	);
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS gives INT NOT NULL DEFAULT 1');
	await safeAlter(
		'ALTER TABLE rewards ADD COLUMN IF NOT EXISTS not_released TINYINT(1) NOT NULL DEFAULT 0'
	);
	await safeAlter('ALTER TABLE rewards ADD COLUMN IF NOT EXISTS components LONGTEXT NULL');

	await safeAlter(
		'ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS image_credit VARCHAR(255) NULL'
	);
	await safeAlter('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS description_en TEXT NULL');
	await safeAlter('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS description_fr TEXT NULL');
	await safeAlter('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS how_to_obtain_en TEXT NULL');
	await safeAlter('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS how_to_obtain_fr TEXT NULL');
	await safeAlter('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS locations_en LONGTEXT NULL');
	await safeAlter('ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS locations_fr LONGTEXT NULL');

	await safeAlter('ALTER TABLE reward_ingredients ADD COLUMN IF NOT EXISTS unit VARCHAR(32) NULL');

	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS planet VARCHAR(128) NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS moon VARCHAR(128) NULL');
	await safeAlter(
		'ALTER TABLE locations ADD COLUMN IF NOT EXISTS cheatsheet_image_url VARCHAR(1024) NULL'
	);
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS short_description_en TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS short_description_fr TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS how_to_access_en TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS how_to_access_fr TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS mission_types_en TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS mission_types_fr TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS loot_types_en TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS loot_types_fr TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS requirements TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS rewards TEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS coordinates VARCHAR(255) NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS crate_types LONGTEXT NULL');
	await safeAlter('ALTER TABLE locations ADD COLUMN IF NOT EXISTS related_missions LONGTEXT NULL');

	await safeAlter(
		'ALTER TABLE reputation_requirements ADD COLUMN IF NOT EXISTS reputation_name_en VARCHAR(255) NULL'
	);
	await safeAlter(
		'ALTER TABLE reputation_requirements ADD COLUMN IF NOT EXISTS reputation_name_fr VARCHAR(255) NULL'
	);
	await safeAlter(
		'ALTER TABLE reputation_requirements ADD COLUMN IF NOT EXISTS required_level INT NULL'
	);
}

const ensureSchemaCompatibilityOnce = (() => {
	let schemaCompatibilityPromise: Promise<void> | null = null;

	return async () => {
		if (!schemaCompatibilityPromise) {
			schemaCompatibilityPromise = ensureSchemaCompatibility().catch((error) => {
				schemaCompatibilityPromise = null;
				throw error;
			});
		}

		await schemaCompatibilityPromise;
	};
})();

export async function ensureMariaWikeloSeedData(): Promise<void> {
	if (!hasMariaConfig()) return;
	await ensureSchemaCompatibilityOnce();
}
