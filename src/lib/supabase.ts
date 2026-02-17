import { getTable, mockDb } from '$lib/mock-db';

export type User = {
	id: string;
	email?: string;
	created_at?: string;
	last_sign_in_at?: string;
	user_metadata?: Record<string, unknown>;
};

type QueryResult<T = any> = Promise<{ data: T; error: any }>;

type Filter = { type: 'eq'; field: string; value: any };

function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
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
	private selected = false;
	private ordering: { field: string; ascending: boolean } | null = null;
	private limitCount: number | null = null;
	private writeMode: 'insert' | 'update' | 'delete' | 'upsert' | null = null;
	private payload: any;

	constructor(private tableName: string) {}

	select(..._args: any[]): this {
		this.selected = true;
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

	delete(..._args: any[]): this {
		this.writeMode = 'delete';
		return this;
	}

	upsert(payload: any): QueryResult<null> {
		const table = getTable(this.tableName);
		const items = Array.isArray(payload) ? payload : [payload];
		for (const item of items) {
			const idx = table.findIndex((r: any) => r.id && item.id && r.id === item.id);
			if (idx >= 0) table[idx] = { ...table[idx], ...item };
			else table.push({ id: item.id ?? `mock_${Date.now()}`, ...item });
		}
		return Promise.resolve({ data: null, error: null });
	}

	eq(field: string, value: any): this {
		this.filters.push({ type: 'eq', field, value });
		return this;
	}

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

	limit(value: number): this {
		this.limitCount = value;
		return this;
	}

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

		let rows = applyFilters(table, this.filters);
		rows = maybeWithRelations(this.tableName, rows);

		if (this.ordering) {
			const { field, ascending } = this.ordering;
			rows = [...rows].sort((a, b) => {
				const av = a[field] ?? '';
				const bv = b[field] ?? '';
				return ascending ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
			});
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
		.filter((l) =>
			!search || l.name_en.toLowerCase().includes(search) || l.name_fr.toLowerCase().includes(search)
		)
		.map((l) => ({
			...l,
			ingredient_count: mockDb.ingredients.filter((i) => i.location_id === l.id).length
		}));
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
		case 'search_locations':
			return searchLocations(params);
		case 'search_organizations':
			return searchOrganizations(params);
		case 'get_user_organizations':
			return searchOrganizations({ limit_count: 20 });
		case 'get_org_member_count':
			return mockDb.organization_members.filter((m) => m.organization_id === params?.org_id).length;
		case 'is_org_member':
			return mockDb.organization_members.some((m) => m.organization_id === params?.org_id);
		case 'is_org_manager':
			return true;
		case 'generate_org_slug':
			return (params?.org_name ?? 'organization').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		case 'get_org_members_with_user_info':
			return getOrgMembers(params?.org_id);
		case 'get_org_join_requests_with_user_info':
			return [];
		case 'get_org_aggregated_inventory':
			return [];
		case 'get_org_ingredient_breakdown':
			return [];
		default:
			return [];
	}
}

const disabledError = { message: 'Auth is disabled in NAS free mode.' };

export const supabase: any = {
	from: (table: string) => new QueryBuilder(table),
	rpc: (fn: string, params?: any) => Promise.resolve({ data: clone(runRpc(fn, params)), error: null }),
	auth: {
		getSession: () => Promise.resolve({ data: { session: null }, error: null }),
		getUser: () => Promise.resolve({ data: { user: null }, error: null }),
		signInWithPassword: (..._args: any[]) => Promise.resolve({ data: null, error: disabledError }),
		signUp: (..._args: any[]) => Promise.resolve({ data: null, error: disabledError }),
		signOut: () => Promise.resolve({ error: null }),
		signInWithOAuth: (..._args: any[]) => Promise.resolve({ data: null, error: disabledError }),
		onAuthStateChange: (..._args: any[]) => ({
			data: { subscription: { unsubscribe: () => {} } },
			error: null
		})
	},
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
