/**
 * @format
 */

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Server-side route handler to securely exchange an auth code for a user session.
 */
export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");

	if (code) {
		const supabase = createServerSupabaseClient();
		const { error } = await (await supabase).auth.exchangeCodeForSession(code);
		if (!error) {
			return NextResponse.redirect(`${origin}/dashboard`);
		}
	}

	console.error(
		"Auth callback error: No code received or session exchange failed."
	);
	return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
