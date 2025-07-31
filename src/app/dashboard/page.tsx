/** @format */

"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { JobHistoryTable } from "./components/job-history-table";
import { CrawlJob } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { JobForm } from "./components/job-form";
import { v4 as uuidv4 } from "uuid"; // 1. Import a UUID library to create temporary IDs

export default function DashboardPage() {
	const supabase = createClient();
	const router = useRouter();
	const [session, setSession] = useState<Session | null>(null);
	const [jobs, setJobs] = useState<CrawlJob[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkSession = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (!session) {
					router.replace("/login");
					return;
				}

				setSession(session);

				// Fetch jobs for the current user
				const { data: jobsData, error } = await supabase
					.from("crawl_jobs")
					.select("*")
					.order("created_at", { ascending: false });

				if (error) {
					console.error("Error fetching jobs:", error);
				} else {
					setJobs(jobsData || []);
				}
			} catch (error) {
				console.error("Session check error:", error);
				router.replace("/login");
			} finally {
				setLoading(false);
			}
		};

		checkSession();
	}, [router, supabase]);

	// 2. Define the callback function to handle the optimistic update
	const handleJobSubmitted = (url: string) => {
		// Create a temporary, "fake" job object.
		const optimisticJob: CrawlJob = {
			id: uuidv4(), // A unique temporary ID
			user_id: session!.user.id,
			target_url: url,
			status: "pending",
			created_at: new Date().toISOString(),
			job_id: null, // No external job_id yet
			result: null,
		};

		// 3. Prepend it to the jobs list in our state.
		//    This will instantly update the UI.
		setJobs((currentJobs) => [optimisticJob, ...currentJobs]);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-2">Loading...</h2>
					<p className="text-muted-foreground">
						Please wait while we load your dashboard.
					</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return null; // Will redirect to login
	}

	return (
		<div className="container mx-auto p-4 md:p-8">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back, {session.user.email}
					</p>
				</div>
				<Button variant="outline">Sign Out</Button>
			</div>
			<JobForm onJobSubmitted={handleJobSubmitted} />
			<JobHistoryTable initialJobs={jobs} />
		</div>
	);
}
