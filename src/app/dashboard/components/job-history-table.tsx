/** @format */

"use client";

import { CrawlJob } from "@/lib/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// This component receives the initial list of jobs from its parent server component.
export function JobHistoryTable({ initialJobs }: { initialJobs: CrawlJob[] }) {
	const getBadgeVariant = (status: CrawlJob["status"]) => {
		switch (status) {
			case "completed":
				return "default"; // Default is often green in ShadCN
			case "pending":
				return "secondary"; // Secondary is often gray/yellow
			case "failed":
				return "destructive"; // Destructive is red
			default:
				return "outline";
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Job History</CardTitle>
				<CardDescription>A list of your recent crawl jobs.</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[40%]">URL</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{initialJobs.map((job) => (
							<TableRow key={job.id}>
								<TableCell className="font-medium truncate">
									{job.target_url}
								</TableCell>
								<TableCell>
									<Badge variant={getBadgeVariant(job.status)}>
										{job.status}
									</Badge>
								</TableCell>
								<TableCell>
									{new Date(job.created_at).toLocaleString()}
								</TableCell>
								<TableCell className="text-right">
									{/* We will add real functionality to these buttons later */}
									<Button variant="outline" size="sm" disabled>
										Download
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{initialJobs.length === 0 && (
					<div className="text-center p-8 text-muted-foreground">
						You have no jobs yet.
					</div>
				)}
			</CardContent>
		</Card>
	);
}
