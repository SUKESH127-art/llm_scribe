/** @format */

"use client";

import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function LoginContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(true);
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get error from URL params
	useEffect(() => {
		const errorParam = searchParams.get("error");
		const messageParam = searchParams.get("message");
		
		if (errorParam) {
			let errorMessage = "Authentication failed. Please try again.";
			
			switch (errorParam) {
				case "auth_error":
					errorMessage = messageParam || "Authentication error occurred.";
					break;
				case "no_session":
					errorMessage = "No session was created. Please try signing in again.";
					break;
				case "no_code":
					errorMessage = "Invalid authentication code. Please try signing in again.";
					break;
				case "unexpected_error":
					errorMessage = "An unexpected error occurred. Please try again.";
					break;
				default:
					errorMessage = messageParam || "Authentication failed. Please try again.";
			}
			
			setError(errorMessage);
		}
	}, [searchParams]);

	const handleGoogleLogin = async () => {
		try {
			setIsSigningIn(true);
			setError(null);
			
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				console.error("Sign in error:", error);
				setError(error.message || "Failed to initiate sign in. Please try again.");
			}
		} catch (error) {
			console.error("Unexpected sign in error:", error);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsSigningIn(false);
		}
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
				// Don't set error here as it might be a temporary issue
			} finally {
				setIsLoading(false);
			}
		};

		checkSession();
	}, [router]);

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
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					
					<Button 
						onClick={handleGoogleLogin} 
						className="w-full"
						disabled={isSigningIn}
					>
						{isSigningIn ? "Signing In..." : "Sign In with Google"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		}>
			<LoginContent />
		</Suspense>
	);
}
