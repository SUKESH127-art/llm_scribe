/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function JobForm() {
	const [url, setUrl] = useState("");
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
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
			setUrl(""); // Clear input on success
			router.refresh();
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
