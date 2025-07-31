/** @format */

"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createCrawlJob(url: string) {
	const supabase = await createServerSupabaseClient();

	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			throw new Error("User not authenticated");
		}

		const { data: newJob, error: insertError } = await supabase
			.from("crawl_jobs")
			.insert({ target_url: url, user_id: session.user.id, status: "pending" })
			.select("id")
			.single();

		if (insertError || !newJob) {
			throw new Error(
				insertError?.message || "Failed to create job in database."
			);
		}

		const apiResponse = await fetch(
			"https://llms-txt-crawler-api.onrender.com/generate-llms-txt",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.INTERNAL_API_KEY!}`,
				},
				body: JSON.stringify({
					url: url,
				}),
			}
		);

		const apiData = await apiResponse.json();

		if (!apiResponse.ok) {
			const errorMessage = Array.isArray(apiData.detail)
				? apiData.detail[0].msg
				: apiData.detail || `API error: ${apiResponse.statusText}`;
			throw new Error(errorMessage);
		}

		const externalJobId = apiData.job_id;

		const { error: updateError } = await supabase
			.from("crawl_jobs")
			.update({ job_id: externalJobId })
			.eq("id", newJob.id);

		if (updateError) {
			console.error(
				"Failed to update job with external ID:",
				updateError.message
			);
		}

		revalidatePath("/dashboard");

		return { success: true, message: "Job created successfully!" };
	} catch (error) {
		let message = "An unknown error occurred.";
		if (error instanceof Error) {
			message = error.message;
		}
		return { success: false, message };
	}
}
