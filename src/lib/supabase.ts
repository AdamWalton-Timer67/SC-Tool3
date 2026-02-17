import { browser } from '$app/environment';
import { getTable, mockDb } from '$lib/mock-db';

export type User = {
	id: string;
	email?: string;
	created_at?: string;
	last_sign_in_at?: string;
	user_metadata?: Record<string, unknown>;
};

export type Session = {
	access_token: string;
	user: User;
};

type QueryResult<T = any> = Promise<{ data: T; error: any }>;
type Filter = { type: 'eq'; field: string; value: any };
type AuthCallback = (event: string, session: Session | null) => void;

const SESSION_COOKIE = 'nas_session_user_id';
const SESSION_STORAGE_KEY = 'nas-session-user-id';

let browserSessionUserId: string | null = null;
const authCallbacks = new Set<AuthCallback>();

function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}

function ensureSeedAdmin() {
	const authUsers = mockDb.auth_users as any[];
	const existingAdmin = authUsers.find((u) => u.id === 'local-user-1');
	if (!existingAdmin) {
		authUsers.push({
			id: 'local-user-1',
			email: 'local@test.lan',
			password: 'admin123',
			approved: true,
			raw_user_meta_data: { role: 'admin' }
		});
	}

	if (!mockDb.user_roles.some((r: any) => r.user_id === 'local-user-1' && r.role === 'admin')) {
		mockDb.user_roles.push({ id: `role_${Date.now()}`, user_id: 'local-user-1', role: 'admin' });
	}
}

function buildUser(authUser: any): User {
	return {
		id: authUser.id,
		email: authUser.email,
		created_at: authUser.created_at,
		last_sign_in_at: authUser.last_sign_in_at,
		user_metadata: authUser.raw_user_meta_data ?? {}
	};
}

function makeSessionFromUser(authUser: any): Session {
	return {
		access_token: `nas-token-${authUser.id}`,
		user: buildUser(authUser)
	};
}

function getBrowserSessionUserId(): string | null {
	if (!browser) return null;

	if (browserSessionUserId) return browserSessionUserId;

	const fromStorage = window.localStorage.getItem(SESSION_STORAGE_KEY);
	if (fromStorage) {
		browserSessionUserId = fromStorage;
		return fromStorage;
	}

	const cookieValue = document.cookie
		.split(';')
		.map((c) => c.trim())
		.find((c) => c.startsWith(`${SESSION_COOKIE}=`))
		?.split('=')[1];

	if (cookieValue) {
		browserSessionUserId = decodeURIComponent(cookieValue);
		window.localStorage.setItem(SESSION_STORAGE_KEY, browserSessionUserId);
		return browserSessionUserId;
	}

	return null;
}

function persistBrowserSession(userId: string | null) {
	if (!browser) return;

	browserSessionUserId = userId;
	if (userId) {
		window.localStorage.setItem(SESSION_STORAGE_KEY, userId);
		document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(userId)}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
	} else {
		window.localStorage.removeItem(SESSION_STORAGE_KEY);
		document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
	}
}

function emitAuth(event: string, session: Session | null) {
	for (const cb of authCallbacks) {
		try {
			cb(event, session);
		} catch (error) {
			console.warn('Auth callback error:', error);
		}
	}
}

function findAuthUserById(id: string | null | undefined) {
	if (!id) return null;
	return (mockDb.auth_users as any[]).find((u) => u.id === id) ?? null;
}

function findAuthUserByEmail(email: string | undefined) {
	if (!email) return null;
	const normalized = email.trim().toLowerCase();
	return (mockDb.auth_users as any[]).find((u) => String(u.email ?? '').toLowerCase() === normalized) ?? null;
}

function applyFilters(rows: any[], filters: Filter[]) {
	return rows.filter((row) => filters.every((f) => (f.type === 'eq' ? row[f.field] === f.value : true)));
}

function maybeWithRelations(tableName: string, rows: any[]) {
	if (tableName === 'reward_ingredients') {
		return rows.map((ri) => ({
			...ri,
			ingredients: mockDb.ingredients.find((i) => i.id === ri.ingredient_id) ?? null
		}));
	}

	if (tableName === 'ingredients') {
		return rows.map((ingredient) => {
			const location = mockDb.locations.find((l) => l.id === ingredient.location_id);
			return {
				...ingredient,
				locations: location
					? {
						id: location.id,
						slug: location.slug,
						name_en: location.name_en,
						name_fr: location.name_fr
					}
					: null
			};
		});
	}

	return rows;
}

class QueryBuilder {
	private filters: Filter[] = [];
	private ordering: { field: string; ascending: boolean } | null = null;
	private limitCount: number | null = null;
	private writeMode: 'insert' | 'update' | 'delete' | 'upsert' | null = null;
	private payload: any;

	constructor(private tableName: string) {}

	select(..._args: any[]): this { return this; }
	insert(payload: any): this { this.writeMode = 'insert'; this.payload = payload; return this; }
	update(payload: any): this { this.writeMode = 'update'; this.payload = payload; return this; }
	delete(..._args: any[]): this { this.writeMode = 'delete'; return this; }

	upsert(payload: any, options?: { onConflict?: string }): QueryResult<null> {
		const table = getTable(this.tableName) as any[];
		const items = Array.isArray(payload) ? payload : [payload];
		const conflictFields = (options?.onConflict ?? '')
			.split(',')
			.map((field) => field.trim())
			.filter(Boolean);

		for (const item of items) {
			let idx = -1;

			if (conflictFields.length > 0) {
				idx = table.findIndex((row) =>
					conflictFields.every((field) => row[field] !== undefined && row[field] === item[field])
				);
			} else if (item.id) {
				idx = table.findIndex((row) => row.id === item.id);
			}

			if (idx >= 0) {
				table[idx] = { ...table[idx], ...item };
			} else {
				table.push({ id: item.id ?? `mock_${Date.now()}_${Math.random()}`, ...item });
			}
		}

		return Promise.resolve({ data: null, error: null });
	}

	eq(field: string, value: any): this { this.filters.push({ type: 'eq', field, value }); return this; }
	neq(..._args: any[]): this { return this; }
	gt(..._args: any[]): this { return this; }
	gte(..._args: any[]): this { return this; }
	lt(..._args: any[]): this { return this; }
	lte(..._args: any[]): this { return this; }
	like(..._args: any[]): this { return this; }
	ilike(..._args: any[]): this { return this; }
	is(..._args: any[]): this { return this; }
	in(..._args: any[]): this { return this; }
	contains(..._args: any[]): this { return this; }
	containedBy(..._args: any[]): this { return this; }
	range(..._args: any[]): this { return this; }

	order(field: string, options?: { ascending?: boolean }): this {
		this.ordering = { field, ascending: options?.ascending ?? true };
		return this;
	}

	limit(value: number): this { this.limitCount = value; return this; }

	async single(..._args: any[]): QueryResult<any> {
		const { data, error } = await this.execute();
		if (error) return { data: null, error };
		if (!Array.isArray(data)) return { data, error: null };
		return data.length > 0 ? { data: data[0], error: null } : { data: null, error: { message: 'No rows' } };
	}

	async maybeSingle(..._args: any[]): QueryResult<any> {
		const { data, error } = await this.execute();
		if (error) return { data: null, error };
		if (!Array.isArray(data)) return { data, error: null };
		return { data: data[0] ?? null, error: null };
	}

	private async execute(): QueryResult<any> {
		const table = getTable(this.tableName);
		if (this.writeMode === 'insert') {
			const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
			const created = rows.map((row) => ({ id: row.id ?? `mock_${Date.now()}_${Math.random()}`, ...row }));
			table.push(...created);
			return { data: clone(created), error: null };
		}
		if (this.writeMode === 'update') {
			const filtered = applyFilters(table, this.filters);
			for (const row of filtered) Object.assign(row, this.payload);
			return { data: clone(filtered), error: null };
		}
		if (this.writeMode === 'delete') {
			const filtered = applyFilters(table, this.filters);
			for (const row of filtered) {
				const idx = table.indexOf(row);
				if (idx >= 0) table.splice(idx, 1);
			}
			return { data: clone(filtered), error: null };
		}

		let rows = maybeWithRelations(this.tableName, applyFilters(table, this.filters));
		if (this.ordering) {
			const { field, ascending } = this.ordering;
			rows = [...rows].sort((a, b) =>
				ascending
					? String(a[field] ?? '').localeCompare(String(b[field] ?? ''))
					: String(b[field] ?? '').localeCompare(String(a[field] ?? ''))
			);
		}
		if (this.limitCount !== null) rows = rows.slice(0, this.limitCount);
		return { data: clone(rows), error: null };
	}

	then<TResult1 = { data: any; error: any }, TResult2 = never>(
		onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
	): Promise<TResult1 | TResult2> {
		return this.execute().then(onfulfilled, onrejected);
	}
}

function searchLocations(params: any) {
	const search = (params?.search_term ?? '').toString().toLowerCase();
	return mockDb.locations
		.filter((l) => !search || l.name_en.toLowerCase().includes(search) || l.name_fr.toLowerCase().includes(search))
		.map((l) => ({ ...l, ingredient_count: mockDb.ingredients.filter((i) => i.location_id === l.id).length }));
}

function searchOrganizations(params: any) {
	const search = (params?.search_term ?? '').toString().toLowerCase();
	const limit = params?.limit_count ?? 50;
	return mockDb.organizations
		.filter((o) => !search || o.name.toLowerCase().includes(search) || o.slug.toLowerCase().includes(search))
		.slice(0, limit)
		.map((o) => ({ ...o, member_count: mockDb.organization_members.filter((m) => m.organization_id === o.id).length }));
}

function getOrgMembers(orgId: string) {
	return mockDb.organization_members
		.filter((m) => m.organization_id === orgId)
		.map((m) => ({
			...m,
			user_display_name: mockDb.profiles.find((p) => p.id === m.user_id)?.display_name ?? 'Unknown',
			unique_ingredients_count: 0,
			total_ingredients_count: 0
		}));
}

function runRpc(fn: string, params: any) {
	switch (fn) {
		case 'search_locations': return searchLocations(params);
		case 'search_organizations': return searchOrganizations(params);
		case 'get_user_organizations': return searchOrganizations({ limit_count: 20 });
		case 'get_org_member_count': return mockDb.organization_members.filter((m) => m.organization_id === params?.org_id).length;
		case 'is_org_member': return mockDb.organization_members.some((m) => m.organization_id === params?.org_id);
		case 'is_org_manager': return true;
		case 'generate_org_slug':
			return (params?.org_name ?? 'organization').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		case 'get_org_members_with_user_info': return getOrgMembers(params?.org_id);
		case 'get_org_join_requests_with_user_info': return [];
		case 'get_org_aggregated_inventory': return [];
		case 'get_org_ingredient_breakdown': return [];
		default: return [];
	}
}

function createAuthApi(requestUserId?: string | null) {
	ensureSeedAdmin();

	const getCurrentAuthUser = () => {
		if (requestUserId !== undefined) return findAuthUserById(requestUserId);
		return findAuthUserById(getBrowserSessionUserId());
	};

	return {
		getSession: async () => {
			const authUser = getCurrentAuthUser();
			if (!authUser || authUser.approved === false) return { data: { session: null }, error: null };
			return { data: { session: makeSessionFromUser(authUser) }, error: null };
		},
		getUser: async () => {
			const authUser = getCurrentAuthUser();
			if (!authUser || authUser.approved === false) return { data: { user: null }, error: null };
			return { data: { user: buildUser(authUser) }, error: null };
		},
		signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
			const authUser = findAuthUserByEmail(email);
			if (!authUser || authUser.password !== password) {
				return { data: null, error: { message: 'Invalid email or password.' } };
			}
			if (authUser.approved === false) {
				return { data: null, error: { message: 'Account pending admin approval.' } };
			}

			authUser.last_sign_in_at = new Date().toISOString();
			persistBrowserSession(authUser.id);
			const session = makeSessionFromUser(authUser);
			emitAuth('SIGNED_IN', session);
			return { data: { user: buildUser(authUser), session }, error: null };
		},
		signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
			if (!email || !password) {
				return { data: null, error: { message: 'Email and password are required.' } };
			}
			if (findAuthUserByEmail(email)) {
				return { data: null, error: { message: 'An account with this email already exists.' } };
			}

			const id = `local-user-${Date.now()}`;
			const createdAt = new Date().toISOString();
			const displayName = options?.data?.display_name || email.split('@')[0];

			authUsers.push({
				id,
				email: email.trim().toLowerCase(),
				password,
				approved: false,
				created_at: createdAt,
				raw_user_meta_data: { role: 'user', display_name: displayName }
			});
			mockDb.profiles.push({ id, display_name: displayName, created_at: createdAt });
			mockDb.user_roles.push({ id: `role_${Date.now()}`, user_id: id, role: 'user' });

			return {
				data: {
					user: { id, email: email.trim().toLowerCase(), user_metadata: { display_name: displayName } },
					session: null
				},
				error: null
			};
		},
		signOut: async () => {
			persistBrowserSession(null);
			emitAuth('SIGNED_OUT', null);
			return { error: null };
		},
		signInWithOAuth: async (..._args: any[]) => ({
			data: null,
			error: { message: 'OAuth is disabled in local NAS auth mode.' }
		}),
		onAuthStateChange: (callback: AuthCallback) => {
			authCallbacks.add(callback);
			callback('INITIAL_SESSION', getCurrentAuthUser()?.approved === false ? null : (getCurrentAuthUser() ? makeSessionFromUser(getCurrentAuthUser()) : null));
			return {
				data: {
					subscription: {
						unsubscribe: () => authCallbacks.delete(callback)
					}
				},
				error: null
			};
		}
	};
}

export function createSupabaseClient(options?: { requestUserId?: string | null }): any {
	return {
		from: (table: string) => new QueryBuilder(table),
		rpc: (fn: string, params?: any) => Promise.resolve({ data: clone(runRpc(fn, params)), error: null }),
		auth: createAuthApi(options?.requestUserId),
		storage: {
			from: () => ({
				upload: () => Promise.resolve({ data: null, error: null }),
				download: () => Promise.resolve({ data: null, error: null }),
				remove: () => Promise.resolve({ data: null, error: null }),
				list: () => Promise.resolve({ data: [], error: null }),
				getPublicUrl: () => ({ data: { publicUrl: '' } })
			})
		}
	};
}

export const supabase: any = createSupabaseClient();
export { SESSION_COOKIE, findAuthUserById };
