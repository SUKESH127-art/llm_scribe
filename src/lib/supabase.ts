/**
 * @format
 * @file This file is for CLIENT-SIDE Supabase access only. It initializes and exports a Supabase client instance safe for use in browser environments.
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a new Supabase client for use in Client Components.
 * @returns A Supabase client instance.
 */
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
