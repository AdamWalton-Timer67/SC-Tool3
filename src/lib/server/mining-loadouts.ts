import fallbackData from '$lib/data/mining-loadout.json';
import { getMariaPool, hasMariaConfig } from '$lib/server/maria';

export type MiningEntry = {
	code: string;
	name: string;
	stats: Record<string, number | boolean | string | null>;
	prices: Record<string, number>;
	active?: boolean;
	size?: number;
	slots?: number;
	category?: string;
	uex_id?: number;
};

type LookupPayload = {
	lasers: Record<string, any>;
	modules: Record<string, any>;
	stores: Record<string, any>;
};

async function fetchRegolithData(): Promise<LookupPayload> {
	const response = await fetch('https://api.regolith.rocks/public', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ query: '{lookups{loadout}}' })
	});
	const body = await response.json();
	return body?.data?.lookups?.loadout as LookupPayload;
}

async function ensureTables() {
	if (!hasMariaConfig()) return;
	const pool = getMariaPool();
	await pool.query(`CREATE TABLE IF NOT EXISTS mining_lasers (
		code VARCHAR(128) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		size INT NULL,
		slots INT NULL,
		uex_id INT NULL,
		stats_json LONGTEXT NOT NULL,
		prices_json LONGTEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	)`);
	await pool.query(`CREATE TABLE IF NOT EXISTS mining_modules (
		code VARCHAR(128) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		category VARCHAR(16) NULL,
		active TINYINT(1) NOT NULL DEFAULT 0,
		uex_id INT NULL,
		stats_json LONGTEXT NOT NULL,
		prices_json LONGTEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	)`);
	await pool.query(`CREATE TABLE IF NOT EXISTS mining_stores (
		code VARCHAR(128) PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		nickname VARCHAR(255) NULL,
		system_name VARCHAR(255) NULL,
		planet VARCHAR(255) NULL,
		moon VARCHAR(255) NULL,
		station VARCHAR(255) NULL,
		outpost VARCHAR(255) NULL,
		city VARCHAR(255) NULL
	)`);
	await pool.query(`CREATE TABLE IF NOT EXISTS user_mining_loadouts (
		id VARCHAR(128) PRIMARY KEY,
		user_id VARCHAR(128) NOT NULL,
		name VARCHAR(255) NOT NULL,
		ship VARCHAR(128) NULL,
		laser_code VARCHAR(128) NOT NULL,
		module_codes_json LONGTEXT NOT NULL,
		notes TEXT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	)`);
}

function normalizeEntries(map: Record<string, any>, type: 'laser' | 'module'): MiningEntry[] {
	return Object.values(map).map((item: any) => ({
		code: item.code,
		name: item.name,
		stats: item.stats ?? {},
		prices: item.prices ?? {},
		active: type === 'module' ? Boolean(item.active) : undefined,
		size: type === 'laser' ? Number(item.size ?? 0) : undefined,
		slots: type === 'laser' ? Number(item.slots ?? 0) : undefined,
		category: type === 'module' ? (item.category ?? '') : undefined,
		uex_id: Number(item.UEXID ?? 0)
	}));
}

async function seedReferenceDataIfEmpty() {
	if (!hasMariaConfig()) return;
	await ensureTables();
	const pool = getMariaPool();
	const [countRows] = await pool.query<any[]>('SELECT COUNT(*) AS count FROM mining_lasers');
	if (Number(countRows?.[0]?.count ?? 0) > 0) return;

	let source: LookupPayload = fallbackData as any;
	try {
		source = await fetchRegolithData();
	} catch {
		// fallback only
	}

	for (const laser of normalizeEntries(source.lasers ?? {}, 'laser')) {
		await pool.query(
			`INSERT INTO mining_lasers (code,name,size,slots,uex_id,stats_json,prices_json)
			 VALUES (?,?,?,?,?,?,?)
			 ON DUPLICATE KEY UPDATE name=VALUES(name),size=VALUES(size),slots=VALUES(slots),uex_id=VALUES(uex_id),stats_json=VALUES(stats_json),prices_json=VALUES(prices_json)`,
			[
				laser.code,
				laser.name,
				laser.size ?? null,
				laser.slots ?? null,
				laser.uex_id ?? null,
				JSON.stringify(laser.stats),
				JSON.stringify(laser.prices)
			]
		);
	}
	for (const module of normalizeEntries(source.modules ?? {}, 'module')) {
		await pool.query(
			`INSERT INTO mining_modules (code,name,category,active,uex_id,stats_json,prices_json)
			 VALUES (?,?,?,?,?,?,?)
			 ON DUPLICATE KEY UPDATE name=VALUES(name),category=VALUES(category),active=VALUES(active),uex_id=VALUES(uex_id),stats_json=VALUES(stats_json),prices_json=VALUES(prices_json)`,
			[
				module.code,
				module.name,
				module.category ?? null,
				module.active ? 1 : 0,
				module.uex_id ?? null,
				JSON.stringify(module.stats),
				JSON.stringify(module.prices)
			]
		);
	}
	for (const [key, store] of Object.entries(source.stores ?? {})) {
		await pool.query(
			`INSERT INTO mining_stores (code,name,nickname,system_name,planet,moon,station,outpost,city)
			 VALUES (?,?,?,?,?,?,?,?,?)
			 ON DUPLICATE KEY UPDATE name=VALUES(name),nickname=VALUES(nickname),system_name=VALUES(system_name),planet=VALUES(planet),moon=VALUES(moon),station=VALUES(station),outpost=VALUES(outpost),city=VALUES(city)`,
			[
				key,
				(store as any).name ?? '',
				(store as any).nickname ?? null,
				(store as any).system ?? null,
				(store as any).planet ?? null,
				(store as any).moon ?? null,
				(store as any).station ?? null,
				(store as any).outpost ?? null,
				(store as any).city ?? null
			]
		);
	}
}

export async function getMiningReferenceData() {
	if (!hasMariaConfig()) {
		const f = fallbackData as any;
		return {
			lasers: normalizeEntries(f.lasers ?? {}, 'laser'),
			modules: normalizeEntries(f.modules ?? {}, 'module'),
			stores: Object.entries(f.stores ?? {}).map(([code, store]: [string, any]) => ({
				code,
				...store
			}))
		};
	}
	await seedReferenceDataIfEmpty();
	const pool = getMariaPool();
	const [lasers] = await pool.query<any[]>('SELECT * FROM mining_lasers ORDER BY name ASC');
	const [modules] = await pool.query<any[]>('SELECT * FROM mining_modules ORDER BY name ASC');
	const [stores] = await pool.query<any[]>('SELECT * FROM mining_stores ORDER BY name ASC');
	return {
		lasers: lasers.map((row) => ({
			code: row.code,
			name: row.name,
			size: row.size,
			slots: row.slots,
			uex_id: row.uex_id,
			stats: JSON.parse(row.stats_json || '{}'),
			prices: JSON.parse(row.prices_json || '{}')
		})),
		modules: modules.map((row) => ({
			code: row.code,
			name: row.name,
			category: row.category,
			active: Boolean(row.active),
			uex_id: row.uex_id,
			stats: JSON.parse(row.stats_json || '{}'),
			prices: JSON.parse(row.prices_json || '{}')
		})),
		stores
	};
}

export async function getUserMiningLoadouts(userId: string) {
	if (!hasMariaConfig()) return [];
	await ensureTables();
	const pool = getMariaPool();
	const [rows] = await pool.query<any[]>(
		'SELECT * FROM user_mining_loadouts WHERE user_id=? ORDER BY updated_at DESC',
		[userId]
	);
	return rows.map((row) => ({ ...row, module_codes: JSON.parse(row.module_codes_json || '[]') }));
}

export async function createUserMiningLoadout(payload: any) {
	if (!hasMariaConfig()) throw new Error('MariaDB is required to save personal loadouts.');
	await ensureTables();
	const pool = getMariaPool();
	await pool.query(
		'INSERT INTO user_mining_loadouts (id,user_id,name,ship,laser_code,module_codes_json,notes) VALUES (?,?,?,?,?,?,?)',
		[
			payload.id,
			payload.user_id,
			payload.name,
			payload.ship ?? null,
			payload.laser_code,
			JSON.stringify(payload.module_codes ?? []),
			payload.notes ?? null
		]
	);
}

export async function updateMiningEntry(
	table: 'mining_lasers' | 'mining_modules',
	code: string,
	body: any
) {
	if (!hasMariaConfig()) throw new Error('MariaDB is required to edit mining reference data.');
	await ensureTables();
	const pool = getMariaPool();
	if (table === 'mining_lasers') {
		await pool.query(
			'UPDATE mining_lasers SET name=?, size=?, slots=?, stats_json=?, prices_json=? WHERE code=?',
			[
				body.name,
				body.size ?? null,
				body.slots ?? null,
				JSON.stringify(body.stats ?? {}),
				JSON.stringify(body.prices ?? {}),
				code
			]
		);
	} else {
		await pool.query(
			'UPDATE mining_modules SET name=?, category=?, active=?, stats_json=?, prices_json=? WHERE code=?',
			[
				body.name,
				body.category ?? null,
				body.active ? 1 : 0,
				JSON.stringify(body.stats ?? {}),
				JSON.stringify(body.prices ?? {}),
				code
			]
		);
	}
}
