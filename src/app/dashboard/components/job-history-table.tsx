/** @format */

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
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { deleteCrawlJob } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { JobActions } from './job-actions';

// CHANGE: Added a specific type for the component's props for clarity.
type JobHistoryTableProps = {
    /** The list of jobs to display, passed from the parent component. */
    initialJobs: CrawlJob[];
    onDeleteJob: (jobId: string) => void;
};

// component renders initial job list from parent server component.
export function JobHistoryTable({
    initialJobs,
    onDeleteJob,
}: JobHistoryTableProps) {
    const getBadgeVariant = (status: CrawlJob['status']) => {
        switch (status) {
            case 'completed':
                return 'default'; // blue
            case 'pending':
                return 'secondary'; // gray
            case 'failed':
                return 'destructive'; // orange
            default:
                return 'outline';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job History</CardTitle>
                <CardDescription>
                    A list of your 8 most recent crawl jobs. Pending jobs will
                    update automatically.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[40%]'>URL</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className='text-right'>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialJobs.map(job => (
                            <TableRow key={job.id}>
                                <TableCell className='font-medium truncate'>
                                    {job.target_url}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={getBadgeVariant(job.status)}
                                    >
                                        {job.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(job.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <JobActions
                                        job={job}
                                        onDeleteJob={onDeleteJob}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {initialJobs.length === 0 && (
                    <div className='text-center p-8 text-muted-foreground'>
                        You have no jobs yet.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
