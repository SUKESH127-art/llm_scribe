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

// 1. Update the props to accept the callback function
export function JobForm({
	onJobSubmitted,
}: {
	onJobSubmitted: (url: string) => void;
}) {
	const [url, setUrl] = useState("");
	const [isPending, setIsPending] = useState(false);
	// 2. The router is no longer needed here.

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
			// 3. Instead of refreshing, call the function from our parent component
			onJobSubmitted(url);
			setUrl("");
		} else {
			toast.error(result.message);
		}

		setIsPending(false);
	};

	return (
		<Card className="mb-6">
			{/* ... Card content remains the same ... */}
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
		</Card>
	);
}
