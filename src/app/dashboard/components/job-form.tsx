/** @format */

"use client";

import { useState } from "react";
import { createCrawlJob } from "@/lib/actions";
import { toast } from "sonner";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type JobFormProps = {
	/** Callback function invoked with the submitted URL on successful job creation. */
	onJobSubmitted: (url: string) => void;
};

/**
 * A form for submitting new URLs to be crawled.
 */
export function JobForm({ onJobSubmitted }: JobFormProps) {
	const [url, setUrl] = useState("");
	const [isPending, setIsPending] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!url) {
			toast.error("Please enter a URL.");
			return;
		}
		setIsPending(true);

		const result = await createCrawlJob(url);

		if (result.success) {
			toast.success(result.message);
			// Instead of refreshing, call the function from our parent component
			onJobSubmitted(url); // Optimistic update
			setUrl("");
		} else {
			toast.error(result.message);
		}
		setIsPending(false);
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Create New Job</CardTitle>
				<CardDescription>
					Enter a URL to start the crawling process.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="flex items-center gap-4">
					<Input
						type="url"
						placeholder="https://example.com"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						disabled={isPending}
						required
					/>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Submitting..." : "Submit"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
