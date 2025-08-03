'use client';

import { useState } from 'react';
import { CrawlJob } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Copy, X } from 'lucide-react';

type JobActionsProps = {
    job: CrawlJob;
    onDeleteJob: (jobId: string) => Promise<void>;
    onRetryJob: (jobId: string) => Promise<void>;
};

export function JobActions({ job, onDeleteJob, onRetryJob }: JobActionsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCopy = async () => {
        if (!job.result) return;
        try {
            await navigator.clipboard.writeText(job.result);
            toast.success('Copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy text.');
        }
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        await onRetryJob(job.id);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDeleteJob(job.id);
    };

    if (job.is_stale) {
        return (
            <div className='flex justify-end items-center space-x-2'>
                <Button variant="outline" size="sm" onClick={handleRetry} disabled={isRetrying || isDeleting}>
                    {isRetrying ? 'Re-crawling...' : 'Re-crawl'}
                </Button>
                <Button variant='destructive' size='sm' onClick={handleDelete} disabled={isRetrying || isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </div>
        );
    }

    return (
        <div className='flex justify-end items-center space-x-2'>
            {job.status === 'completed' && job.result && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant='outline' size='sm'>Create LLMs.txt</Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-3xl h-3/4 flex flex-col'>
                        <DialogHeader className='flex-row justify-between items-center'>
                            <DialogTitle>LLMs.txt for {job.target_url}</DialogTitle>
                            <div className='flex items-center space-x-2'>
                                <Button variant='ghost' size='icon' onClick={handleCopy}><Copy className='h-4 w-4' /></Button>
                                <DialogClose asChild><Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button></DialogClose>
                            </div>
                        </DialogHeader>
                        <Textarea readOnly value={job.result} className='flex-grow h-full font-mono text-sm resize-none' />
                    </DialogContent>
                </Dialog>
            )}

            {job.status === 'failed' && (
                <Button variant='outline' size='sm' onClick={handleRetry} disabled={isRetrying || isDeleting}>
                    {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
            )}

            <Button variant='destructive' size='sm' onClick={handleDelete} disabled={isRetrying || isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
        </div>
    );
}
