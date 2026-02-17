import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = supabase as any;
	event.locals.safeGetSession = async () => ({ session: null, user: null });

	return resolve(event);
};
