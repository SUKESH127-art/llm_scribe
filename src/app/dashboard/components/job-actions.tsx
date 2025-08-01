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
    onDeleteJob: (jobId: string) => void;
};

export function JobActions({ job, onDeleteJob }: JobActionsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    return (
        <div className='flex justify-end items-center space-x-2'>
            {/* Conditionally render the Generate button for completed jobs */}
            {job.status === 'completed' && job.result && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant='outline' size='sm'>
                            Generate LLMs.txt
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-3xl h-3/4 flex flex-col'>
                        <DialogHeader className='flex-row justify-between items-center'>
                            <DialogTitle>Generated llms.txt</DialogTitle>
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

            {/* Always show the delete button */}
            <Button
                variant='destructive'
                size='sm'
                onClick={() => onDeleteJob(job.id)}
            >
                Delete
            </Button>
        </div>
    );
}
