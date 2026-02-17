import type { Pool, RowDataPacket } from 'mysql2/promise';
import { getMariaPool, hasMariaConfig } from '$lib/server/maria';

export type DbAuthUser = {
	id: string;
	email: string;
	password: string;
	approved: number | boolean;
	created_at?: string;
	last_sign_in_at?: string;
	raw_user_meta_data?: any;
};

type Filter = { op: 'eq' | 'in'; field: string; value: any };

function parseBool(value: unknown): boolean {
	return value === true || value === 1 || value === '1';
}

function normalizeTable(table: string): string {
	if (table === 'auth.users') return 'auth_users';
	return table;
}

function createId(prefix: string): string {
	return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function getAuthUserById(pool: Pool, id: string | null | undefined): Promise<DbAuthUser | null> {
	if (!id) return null;
	const [rows] = await pool.query<RowDataPacket[]>(
		`SELECT id, email, password, approved, created_at, last_sign_in_at, raw_user_meta_data
		 FROM auth_users
		 WHERE id = ?
		 LIMIT 1`,
		[id]
	);
	if (!rows.length) return null;
	return rows[0] as DbAuthUser;
}

class QueryBuilder {
	private selectClause = '*';
	private filters: Filter[] = [];
	private orderBy: { field: string; asc: boolean } | null = null;
	private limitValue: number | null = null;
	private writeMode: 'insert' | 'update' | 'delete' | null = null;
	private payload: any;

	constructor(
		private readonly pool: Pool,
		private readonly tableName: string
	) {}

	select(fields = '*'): this {
		this.selectClause = fields;
		return this;
	}
	insert(payload: any): this {
		this.writeMode = 'insert';
		this.payload = payload;
		return this;
	}
	update(payload: any): this {
		this.writeMode = 'update';
		this.payload = payload;
		return this;
	}
	delete(): this {
		this.writeMode = 'delete';
		return this;
	}
	eq(field: string, value: any): this {
		this.filters.push({ op: 'eq', field, value });
		return this;
	}
	in(field: string, value: any[]): this {
		this.filters.push({ op: 'in', field, value });
		return this;
	}
	order(field: string, options?: { ascending?: boolean }): this {
		this.orderBy = { field, asc: options?.ascending ?? true };
		return this;
	}
	limit(value: number): this {
		this.limitValue = value;
		return this;
	}

	async single(): Promise<{ data: any; error: any }> {
		const { data, error } = await this.execute();
		if (error) return { data: null, error };
		if (!Array.isArray(data)) return { data, error: null };
		return { data: data[0] ?? null, error: data[0] ? null : { message: 'No rows' } };
	}

	async maybeSingle(): Promise<{ data: any; error: any }> {
		const { data, error } = await this.execute();
		if (error) return { data: null, error };
		if (!Array.isArray(data)) return { data, error: null };
		return { data: data[0] ?? null, error: null };
	}

	private buildWhere(): { sql: string; params: any[] } {
		if (!this.filters.length) return { sql: '', params: [] };
		const clauses: string[] = [];
		const params: any[] = [];
		for (const f of this.filters) {
			if (f.op === 'eq') {
				clauses.push(`\`${f.field}\` = ?`);
				params.push(f.value);
			}
			if (f.op === 'in') {
				const vals = Array.isArray(f.value) ? f.value : [];
				if (!vals.length) {
					clauses.push('1 = 0');
				} else {
					clauses.push(`\`${f.field}\` IN (${vals.map(() => '?').join(',')})`);
					params.push(...vals);
				}
			}
		}
		return { sql: ` WHERE ${clauses.join(' AND ')}`, params };
	}

	private async execute(): Promise<{ data: any; error: any }> {
		const table = normalizeTable(this.tableName);
		try {
			if (this.writeMode === 'insert') {
				const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
				const created: any[] = [];
				for (const row of rows) {
					const withId = { ...row };
					if (!withId.id) withId.id = createId(table);
					const keys = Object.keys(withId);
					await this.pool.query(
						`INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
						keys.map((k) => withId[k])
					);
					created.push(withId);
				}
				return { data: created, error: null };
			}

			if (this.writeMode === 'update') {
				const keys = Object.keys(this.payload ?? {});
				if (!keys.length) return { data: [], error: null };
				const where = this.buildWhere();
				await this.pool.query(
					`UPDATE \`${table}\` SET ${keys.map((k) => `\`${k}\` = ?`).join(',')}${where.sql}`,
					[...keys.map((k) => this.payload[k]), ...where.params]
				);
				const [rows] = await this.pool.query<RowDataPacket[]>(
					`SELECT * FROM \`${table}\`${where.sql}`,
					where.params
				);
				return { data: rows, error: null };
			}

			if (this.writeMode === 'delete') {
				const where = this.buildWhere();
				const [rows] = await this.pool.query<RowDataPacket[]>(`SELECT * FROM \`${table}\`${where.sql}`, where.params);
				await this.pool.query(`DELETE FROM \`${table}\`${where.sql}`, where.params);
				return { data: rows, error: null };
			}

			if (table === 'locations_with_ingredients') {
				const [locations] = await this.pool.query<RowDataPacket[]>('SELECT * FROM locations');
				const [ingredients] = await this.pool.query<RowDataPacket[]>('SELECT * FROM ingredients');
				const merged = locations.map((location: any) => ({
					...location,
					ingredients: ingredients.filter((i: any) => i.location_id === location.id)
				}));
				return { data: merged, error: null };
			}

			const where = this.buildWhere();
			if (this.selectClause.trim() === 'count') {
				const [rows] = await this.pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM \`${table}\`${where.sql}`, where.params);
				return { data: [rows[0]], error: null };
			}

			let sql = `SELECT * FROM \`${table}\`${where.sql}`;
			if (this.orderBy) {
				sql += ` ORDER BY \`${this.orderBy.field}\` ${this.orderBy.asc ? 'ASC' : 'DESC'}`;
			}
			if (this.limitValue !== null) {
				sql += ` LIMIT ${Math.max(0, Number(this.limitValue))}`;
			}
			const [rows] = await this.pool.query<RowDataPacket[]>(sql, where.params);
			if (table === 'reward_ingredients') {
				const ingredientIds = [...new Set((rows as any[]).map((r) => r.ingredient_id).filter(Boolean))];
				let ingredientMap = new Map<string, any>();
				if (ingredientIds.length) {
					const [ingredients] = await this.pool.query<RowDataPacket[]>(
						`SELECT * FROM ingredients WHERE id IN (${ingredientIds.map(() => '?').join(',')})`,
						ingredientIds
					);
					ingredientMap = new Map((ingredients as any[]).map((i) => [i.id, i]));
				}
				return {
					data: (rows as any[]).map((r) => ({ ...r, ingredients: ingredientMap.get(r.ingredient_id) ?? null })),
					error: null
				};
			}

			if (table === 'ingredients') {
				const locationIds = [...new Set((rows as any[]).map((r) => r.location_id).filter(Boolean))];
				let locationMap = new Map<string, any>();
				if (locationIds.length) {
					const [locations] = await this.pool.query<RowDataPacket[]>(
						`SELECT id, slug, name_en, name_fr FROM locations WHERE id IN (${locationIds.map(() => '?').join(',')})`,
						locationIds
					);
					locationMap = new Map((locations as any[]).map((l) => [l.id, l]));
				}
				return {
					data: (rows as any[]).map((r) => ({ ...r, locations: locationMap.get(r.location_id) ?? null })),
					error: null
				};
			}

			return { data: rows, error: null };
		} catch (error) {
			return { data: null, error };
		}
	}

	then<TResult1 = { data: any; error: any }, TResult2 = never>(
		onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
	): Promise<TResult1 | TResult2> {
		return this.execute().then(onfulfilled, onrejected);
	}
}

export function createMariaSupabaseClient(options?: { requestUserId?: string | null }) {
	if (!hasMariaConfig()) {
		throw new Error('MariaDB config is required for live mode. Set MARIADB_HOST, MARIADB_USER, and MARIADB_DATABASE.');
	}

	const pool = getMariaPool();

	return {
		from: (table: string) => new QueryBuilder(pool, table),
		rpc: async () => ({ data: [], error: null }),
		auth: {
			getSession: async () => {
				const user = await getAuthUserById(pool, options?.requestUserId ?? null);
				if (!user || !parseBool(user.approved)) return { data: { session: null }, error: null };
				return {
					data: {
						session: {
							access_token: `nas-token-${user.id}`,
							user: {
								id: user.id,
								email: user.email,
								created_at: user.created_at,
								last_sign_in_at: user.last_sign_in_at,
								user_metadata: user.raw_user_meta_data ?? {}
							}
						}
					},
					error: null
				};
			},
			getUser: async () => {
				const user = await getAuthUserById(pool, options?.requestUserId ?? null);
				if (!user || !parseBool(user.approved)) return { data: { user: null }, error: null };
				return {
					data: {
						user: {
							id: user.id,
							email: user.email,
							created_at: user.created_at,
							last_sign_in_at: user.last_sign_in_at,
							user_metadata: user.raw_user_meta_data ?? {}
						}
					},
					error: null
				};
			},
			signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
				const normalized = email.trim().toLowerCase();
				const [rows] = await pool.query<RowDataPacket[]>(
					`SELECT id, email, password, approved, created_at, last_sign_in_at, raw_user_meta_data
					 FROM auth_users
					 WHERE LOWER(email) = ?
					 LIMIT 1`,
					[normalized]
				);
				const user = rows[0] as DbAuthUser | undefined;
				if (!user || user.password !== password) {
					return { data: null, error: { message: 'Invalid email or password.' } };
				}
				if (!parseBool(user.approved)) {
					return { data: null, error: { message: 'Account pending admin approval.' } };
				}
				await pool.query('UPDATE auth_users SET last_sign_in_at = NOW() WHERE id = ?', [user.id]);
				return {
					data: {
						user: { id: user.id, email: user.email, user_metadata: user.raw_user_meta_data ?? {} },
						session: { access_token: `nas-token-${user.id}`, user: { id: user.id, email: user.email } }
					},
					error: null
				};
			},
			signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
				const normalized = email.trim().toLowerCase();
				const displayName = options?.data?.display_name || normalized.split('@')[0] || 'Unknown';
				const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM auth_users WHERE LOWER(email) = ? LIMIT 1', [normalized]);
				if (existing.length) {
					return { data: null, error: { message: 'An account with this email already exists.' } };
				}
				const id = createId('user');
				await pool.query(
					'INSERT INTO auth_users (id, email, password, approved, created_at, raw_user_meta_data) VALUES (?, ?, ?, ?, NOW(), ?)',
					[id, normalized, password, 0, JSON.stringify({ role: 'user', display_name: displayName })]
				);
				await pool.query('INSERT INTO profiles (id, display_name, created_at) VALUES (?, ?, NOW())', [id, displayName]);
				await pool.query('INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)', [createId('role'), id, 'user']);
				return { data: { user: { id, email: normalized }, session: null }, error: null };
			},
			signOut: async () => ({ error: null }),
			signInWithOAuth: async () => ({ data: null, error: { message: 'OAuth disabled in local mode.' } }),
			onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null })
		},
		storage: {
			from: () => ({
				upload: async () => ({ data: null, error: null }),
				download: async () => ({ data: null, error: null }),
				remove: async () => ({ data: null, error: null })
			})
		}
	};
}

export async function findMariaAuthUserById(id: string | null | undefined) {
	if (!hasMariaConfig()) return null;
	return getAuthUserById(getMariaPool(), id);
}

export function isApprovedUser(user: any): boolean {
	return parseBool(user?.approved);
}
