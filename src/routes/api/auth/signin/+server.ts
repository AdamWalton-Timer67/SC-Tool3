import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SESSION_COOKIE } from '$lib/supabase';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	try {
		const body = await request.json();
		const email = String(body?.email ?? '').trim().toLowerCase();
		const password = String(body?.password ?? '');

		if (!email || !password) {
			return json({ error: 'Email and password are required.' }, { status: 400 });
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password });
		if (error || !data?.user?.id) {
			return json({ error: error?.message || 'Invalid email or password.' }, { status: 401 });
		}

		cookies.set(SESSION_COOKIE, data.user.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		return json({ user: data.user });
	} catch (error) {
		return json({ error: (error as Error).message || 'Could not sign in.' }, { status: 500 });
	}
};
