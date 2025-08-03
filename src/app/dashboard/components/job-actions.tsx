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
// --- REMOVE `retryCrawlJob` import ---

type JobActionsProps = {
    job: CrawlJob;
    onDeleteJob: (jobId: string) => Promise<void>;
    onRetryJob: (jobId: string) => Promise<void>;
};

export function JobActions({ job, onDeleteJob, onRetryJob }: JobActionsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    // Add a separate loading state for delete
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCopy = async () => {
        if (!job.result) {
            return;
        }
        try {
            await navigator.clipboard.writeText(job.result);
            toast.success('Copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy text.');
            console.error('Failed to copy: ', err);
        }
    };

    const handleRetry = async () => {
        setIsRetrying(true);
        await onRetryJob(job.id);
        // No need to set isRetrying false unless you want to re-enable the button immediately
        // The parent re-render will likely remove this component anyway
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDeleteJob(job.id);
    };

    // If the job is stale, show a "Re-crawl" button.
    // This button will reuse our existing retry logic.
    if (job.is_stale) {
        return (
            <div className='flex justify-end items-center space-x-2'>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRetry}  
                    disabled={isRetrying || isDeleting}
                >
                    {isRetrying ? 'Re-crawling...' : 'Re-crawl'}
                </Button>
                <Button
                    variant='destructive'
                    size='sm'
                    onClick={handleDelete}
                    disabled={isRetrying || isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </div>
        );
    }

    return (
        <div className='flex justify-end items-center space-x-2'>
            {/* Conditionally render the Generate button for completed jobs */}
            {job.status === 'completed' && job.result && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant='outline'
                            size='sm'
                            className='bg-primary text-primary-foreground hover:bg-transparent hover:text-primary hover:border-primary border-2 border-transparent'
                        >
                            Create LLMs.txt
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-3xl h-3/4 flex flex-col'>
                        <DialogHeader className='flex-row justify-between items-center'>
                            <DialogTitle>LLMs.txt</DialogTitle>
                            <div className='flex items-center space-x-2'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={handleCopy}
                                >
                                    <Copy className='h-4 w-4' />
                                </Button>
                                <DialogClose asChild>
                                    <X className='h-4 w-4' />
                                </DialogClose>
                            </div>
                        </DialogHeader>
                        <Textarea
                            readOnly
                            value={job.result}
                            className='flex-grow h-full font-mono text-sm resize-none'
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Show retry button for failed jobs */}
            {job.status === 'failed' && (
                <Button
                    variant='outline'
                    size='sm'
                    onClick={handleRetry}
                    disabled={isRetrying || isDeleting}
                >
                    {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
            )}

            {/* Always show the delete button */}
            <Button
                variant='destructive'
                size='sm'
                onClick={handleDelete}
                disabled={isRetrying || isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
        </div>
    );
}
