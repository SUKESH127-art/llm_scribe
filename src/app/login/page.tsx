/** @format */

"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	const handleGoogleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	// handles user who already logged in (lets them skip)
	useEffect(() => {
		const checkSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session) {
					router.replace("/dashboard");
				}
			} catch (error) {
				console.error("Session check error:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkSession();
	}, [router, supabase]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<Card className="w-full max-w-sm">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">LLM Scribe</CardTitle>
					<CardDescription>
						Sign in with your Google account to continue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button onClick={handleGoogleLogin} className="w-full">
						Sign In with Google
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
