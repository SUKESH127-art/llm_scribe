/** @format */
/**
 * @file This file is for SERVER-SIDE Supabase access only.
 * It provides a helper to create a Supabase client for server-side code.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a new Supabase client for server-side operations.
 * @returns A Supabase client instance configured for the server environment.
 */
export async function createServerSupabaseClient() {
	const cookieStore = await cookies();
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			// Manage authentication state between the client/server.
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					cookieStore.set({ name, value, ...options });
				},
				remove(name: string, options: CookieOptions) {
					cookieStore.delete({ name, ...options });
				},
			},
		}
	);
}
