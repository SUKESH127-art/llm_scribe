/** @format */

export type CrawlJob = {
	id: string;
	user_id: string;
	target_url: string;
	job_id: string | null;
	status: "pending" | "completed" | "failed";
	result: string | null;
	created_at: string;
};
