import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const email = String(body?.email ?? '')
			.trim()
			.toLowerCase();
		const password = String(body?.password ?? '');
		const displayName = String(body?.displayName ?? '').trim() || email.split('@')[0] || 'Unknown';

		if (!email || !password) {
			return json({ error: 'Email and password are required.' }, { status: 400 });
		}

		const { data, error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: { data: { display_name: displayName } }
		});

		if (error) {
			return json({ error: error.message || 'Could not create account.' }, { status: 400 });
		}

		return json({ user: data?.user ?? null, pendingApproval: true });
	} catch (error) {
		return json(
			{ error: (error as Error).message || 'Could not create account.' },
			{ status: 500 }
		);
	}
};
