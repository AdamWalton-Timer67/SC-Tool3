import { browser } from '$app/environment';

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

const SESSION_STORAGE_KEY = 'nas-session-user-id';
export const SESSION_COOKIE = 'nas_session_user_id';

const authCallbacks = new Set<AuthCallback>();
let browserSessionUserId: string | null = null;

function clone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
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

	if (!cookieValue) return null;
	browserSessionUserId = decodeURIComponent(cookieValue);
	window.localStorage.setItem(SESSION_STORAGE_KEY, browserSessionUserId);
	return browserSessionUserId;
}

function persistBrowserSession(userId: string | null) {
	if (!browser) return;
	browserSessionUserId = userId;

	if (userId) {
		window.localStorage.setItem(SESSION_STORAGE_KEY, userId);
	} else {
		window.localStorage.removeItem(SESSION_STORAGE_KEY);
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

async function parseJsonResponse(response: Response): Promise<any> {
	const payload = await response.json().catch(() => ({}));
	if (!response.ok) {
		const message = payload?.error || payload?.message || `Request failed (${response.status})`;
		throw new Error(message);
	}
	return payload;
}

function makeAuthApi() {
	return {
		getSession: async () => {
			if (!browser) return { data: { session: null }, error: null };
			try {
				const response = await fetch('/api/auth/session');
				const payload = await parseJsonResponse(response);
				const user = payload?.user ?? null;
				if (!user) return { data: { session: null }, error: null };
				persistBrowserSession(user.id ?? null);
				return {
					data: {
						session: {
							access_token: `nas-token-${user.id}`,
							user
						}
					},
					error: null
				};
			} catch (error) {
				return { data: { session: null }, error };
			}
		},
		getUser: async () => {
			if (!browser) return { data: { user: null }, error: null };
			try {
				const response = await fetch('/api/auth/session');
				const payload = await parseJsonResponse(response);
				const user = payload?.user ?? null;
				persistBrowserSession(user?.id ?? null);
				return { data: { user }, error: null };
			} catch (error) {
				return { data: { user: null }, error };
			}
		},
		signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
			try {
				const response = await fetch('/api/auth/signin', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				});
				const payload = await parseJsonResponse(response);
				const user = payload?.user ?? null;
				if (!user) return { data: null, error: { message: 'Invalid email or password.' } };

				persistBrowserSession(user.id ?? null);
				const session: Session = {
					access_token: `nas-token-${user.id}`,
					user
				};
				emitAuth('SIGNED_IN', session);
				return { data: { user, session }, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},
		signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
			try {
				const response = await fetch('/api/auth/signup', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password, displayName: options?.data?.display_name })
				});
				const payload = await parseJsonResponse(response);
				return { data: { user: payload?.user ?? null, session: null }, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},
		signOut: async () => {
			try {
				await fetch('/api/auth/signout', { method: 'POST' });
			} finally {
				persistBrowserSession(null);
				emitAuth('SIGNED_OUT', null);
			}
			return { error: null };
		},
		signInWithOAuth: async () => ({ data: null, error: { message: 'OAuth disabled in Maria mode.' } }),
		onAuthStateChange: (callback: AuthCallback) => {
			authCallbacks.add(callback);
			void (async () => {
				const {
					data: { user }
				} = await supabase.auth.getUser();
				const session = user
					? {
						access_token: `nas-token-${user.id}`,
						user
					}
					: null;
				callback('INITIAL_SESSION', session);
			})();
			return {
				data: { subscription: { unsubscribe: () => authCallbacks.delete(callback) } },
				error: null
			};
		}
	};
}

class QueryBuilder {
	private filters: Filter[] = [];
	private ordering: { field: string; ascending: boolean } | null = null;
	private limitCount: number | null = null;
	private writeMode: 'insert' | 'update' | 'delete' | 'upsert' | null = null;
	private payload: any;
	private selectClause = '*';
	private upsertConflict: string | undefined;

	constructor(private tableName: string) {}

	select(fields = '*'): this { this.selectClause = fields; return this; }
	insert(payload: any): this { this.writeMode = 'insert'; this.payload = payload; return this; }
	update(payload: any): this { this.writeMode = 'update'; this.payload = payload; return this; }
	delete(..._args: any[]): this { this.writeMode = 'delete'; return this; }
	upsert(payload: any, options?: { onConflict?: string }): this {
		this.writeMode = 'upsert';
		this.payload = payload;
		this.upsertConflict = options?.onConflict;
		return this;
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
		if (!browser) {
			return { data: null, error: { message: 'Client query attempted during SSR.' } };
		}

		try {
			const response = await fetch(`/api/db/${this.tableName}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: this.writeMode ?? 'select',
					filters: this.filters,
					ordering: this.ordering,
					limit: this.limitCount,
					payload: this.payload,
					select: this.selectClause,
					onConflict: this.upsertConflict
				})
			});
			const payload = await parseJsonResponse(response);
			return { data: clone(payload?.data ?? null), error: null };
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

export function createSupabaseClient(_options?: { requestUserId?: string | null }): any {
	return {
		from: (table: string) => new QueryBuilder(table),
		rpc: async (fn: string, params?: any) => {
			if (!browser) return { data: null, error: { message: 'RPC unavailable during SSR.' } };
			try {
				const response = await fetch(`/api/rpc/${fn}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ params: params ?? {} })
				});
				const payload = await parseJsonResponse(response);
				return { data: payload?.data ?? null, error: null };
			} catch (error) {
				return { data: null, error };
			}
		},
		auth: makeAuthApi(),
		storage: {
			from: () => ({
				upload: async () => ({ data: null, error: { message: 'Storage not implemented in Maria mode.' } }),
				download: async () => ({ data: null, error: { message: 'Storage not implemented in Maria mode.' } }),
				remove: async () => ({ data: null, error: { message: 'Storage not implemented in Maria mode.' } }),
				list: async () => ({ data: [], error: null }),
				getPublicUrl: () => ({ data: { publicUrl: '' } })
			})
		}
	};
}

export const supabase: any = createSupabaseClient();

export function findAuthUserById(_id: string | null | undefined) {
	return null;
}

void getBrowserSessionUserId();
