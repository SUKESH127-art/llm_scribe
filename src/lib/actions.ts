/** @format */

"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { CrawlJob } from "./types";

// This helper function contains the slow, external API call.
// We will call this function without `await` to run it in the background.
async function triggerAndTrackJob(jobId: string, url: string) {
	const supabase = await createServerSupabaseClient();
	try {
		const apiResponse = await fetch(
			"https://llms-txt-crawler-api.onrender.com/generate-llms-txt",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.INTERNAL_API_KEY!}`,
				},
				body: JSON.stringify({ url: url }),
			}
		);

		const apiData = await apiResponse.json();

		if (!apiResponse.ok) {
			throw new Error(apiData.detail || "The crawler API returned an error.");
		}

		// Success: Update our job with the external ID from the crawler service.
		await supabase
			.from("crawl_jobs")
			.update({ job_id: apiData.job_id })
			.eq("id", jobId);
	} catch (error) {
		console.error(
			`Background job trigger failed for Supabase job ID ${jobId}:`,
			error
		);
		// If the trigger fails, mark our job as failed so it doesn't stay pending forever.
		await supabase
			.from("crawl_jobs")
			.update({ status: "failed" })
			.eq("id", jobId);
	}
}

// This is our main Server Action, now refactored to be fast.
export async function createCrawlJob(url: string) {
	const supabase = await createServerSupabaseClient();
	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			throw new Error("User not authenticated");
		}

		// 1. Create the job in our DB instantly. This is fast.
		const { data: newJob, error: insertError } = await supabase
			.from("crawl_jobs")
			.insert({ target_url: url, user_id: session.user.id, status: "pending" })
			.select("id")
			.single();

		if (insertError || !newJob) {
			throw new Error("Failed to create job record in database.");
		}

		// 2. "Fire and Forget" the slow API call. We don't use `await` here.
		triggerAndTrackJob(newJob.id, url);

		// 3. Return to the user immediately.
		revalidatePath("/dashboard");
		return { success: true, message: "Job submitted successfully!" };
	} catch (error) {
		let message = "An unknown error occurred.";
		if (error instanceof Error) {
			message = error.message;
		}
		return { success: false, message };
	}
}

export async function checkJobStatus(job: CrawlJob) {
	if (!job.job_id) {
		console.error(`Job ${job.id} has no external job_id to check.`);
		return;
	}

	try {
		const apiResponse = await fetch(
			`https://llms-txt-crawler-api.onrender.com/crawl-status/${job.job_id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.INTERNAL_API_KEY!}`,
				},
			}
		);

		// if status 202, job still running
		if (apiResponse.status == 202) {
			return;
		}

		const supabase = await createServerSupabaseClient();
		if (apiResponse.status == 200) {
			// Job complete, update our DB with result
			const resultText = await apiResponse.text();
			await supabase
				.from("crawl_jobs")
				.update({
					status: "completed",
					result: resultText,
				})
				.eq("id", job.id);
		} else {
			// Any other status (400, 404, etc.) is considered a failure
			const errorText = await apiResponse.text();
			console.error(
				`Job ${job.job_id} failed with status ${apiResponse.status}: ${errorText}`
			);
			await supabase
				.from("crawl_jobs")
				.update({ status: "failed" })
				.eq("id", job.id);
		}
		// Revalidate the path so the next full refresh will definitely get the new data.
		revalidatePath("/dashboard");
	} catch (error) {
		console.error(`Error in checkJobStatus for job ${job.job_id}:`, error);
	}
}
