'use client';

import { CrawlJob } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { JobActions } from './job-actions';

/**
 * Props for the JobHistoryTable component.
 */
type JobHistoryTableProps = {
    jobs: CrawlJob[];
    onDeleteJob: (jobId: string) => Promise<void>;
    onRetryJob: (jobId: string) => Promise<void>;
};

/**
 * A table component for displaying crawl job history.
 */
export function JobHistoryTable({
    jobs,
    onDeleteJob,
    onRetryJob,
}: JobHistoryTableProps) {
    /**
     * Determines the appropriate badge variant based on the job status.
     * 
     * @param status - The status of the job.
     * @returns The badge variant.
     */
    const getBadgeVariant = (status: CrawlJob['status']) => {
        switch (status) {
            case 'completed': return 'default';
            case 'pending': return 'secondary';
            case 'failed': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job History</CardTitle>
                <CardDescription>
                    A list of your most recent crawl jobs. Pending jobs will update automatically.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[40%]'>URL</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.map(job => (
                            <TableRow key={job.id}>
                                <TableCell className='font-medium truncate'>{job.target_url}</TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(job.status)}>{job.status}</Badge>
                                </TableCell>
                                <TableCell>{new Date(job.created_at).toLocaleString()}</TableCell>
                                <TableCell className='text-right'>
                                    <JobActions
                                        job={job}
                                        onDeleteJob={onDeleteJob}
                                        onRetryJob={onRetryJob}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {jobs.length === 0 && (
                    <div className='text-center p-8 text-muted-foreground'>
                        You have no jobs yet.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
