/**
 * @format
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

/**
 * Server-side route handler to securely exchange an auth code for a user session.
 */
export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/dashboard";

	if (code) {
		const cookieStore = await cookies();
		
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get(name: string) {
						return cookieStore.get(name)?.value;
					},
					set(name: string, value: string, options: CookieOptions) {
						try {
							cookieStore.set({ name, value, ...options });
						} catch (error) {
							// Handle cookie setting errors gracefully
							console.error("Cookie setting error:", error);
						}
					},
					remove(name: string, options: CookieOptions) {
						try {
							cookieStore.delete({ name, ...options });
						} catch (error) {
							// Handle cookie deletion errors gracefully
							console.error("Cookie deletion error:", error);
						}
					},
				},
			}
		);

		try {
			const { data, error } = await supabase.auth.exchangeCodeForSession(code);
			
			if (error) {
				console.error("Auth callback error:", error);
				return NextResponse.redirect(`${origin}/login?error=auth_error&message=${encodeURIComponent(error.message)}`);
			}

			if (data.session) {
				// Successfully exchanged code for session
				return NextResponse.redirect(`${origin}${next}`);
			} else {
				console.error("No session returned from code exchange");
				return NextResponse.redirect(`${origin}/login?error=no_session`);
			}
		} catch (error) {
			console.error("Unexpected auth callback error:", error);
			return NextResponse.redirect(`${origin}/login?error=unexpected_error`);
		}
	}

	console.error("Auth callback error: No code received");
	return NextResponse.redirect(`${origin}/login?error=no_code`);
}
