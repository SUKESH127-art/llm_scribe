/** @format */

"use client";

import { useState } from "react";
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

/**
 * Props for the JobForm component.
 */
type JobFormProps = {
	// This prop now expects the async handler from the parent.
	onJobSubmit: (url: string) => Promise<void>;
};

/**
 * A form for submitting new URLs to be crawled.
 */
export function JobForm({ onJobSubmit }: JobFormProps) {
	const [url, setUrl] = useState("");
	const [isPending, setIsPending] = useState(false);

	/**
	 * Handles the form submission.
	 * 
	 * @param event - The form submission event.
	 */
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!url) {
			toast.error("Please enter a URL.");
			return;
		}
		setIsPending(true);
		
		// Just call the handler passed from the parent page.
		await onJobSubmit(url);
		
		setUrl("");
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
