'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { JobHistoryTable } from './components/job-history-table';
import { JobForm } from './components/job-form';
import { CrawlJob } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import { 
    checkJobStatus, 
    signOut, 
    createCrawlJob, 
    deleteCrawlJob, 
    retryCrawlJob 
} from '@/lib/actions';
import { toast } from 'sonner';

export default function DashboardPage() {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [jobs, setJobs] = useState<CrawlJob[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = useCallback(async () => {
        const { data, error } = await supabase
            .from('crawl_jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error("Failed to fetch job history.");
            console.error('Error fetching jobs:', error);
        } else {
            setJobs(data || []);
        }
    }, []);

    useEffect(() => {
        const initializeDashboard = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/login');
                return;
            }
            setSession(session);
            await fetchJobs();
            setLoading(false);
        };
        initializeDashboard();
    }, [router, fetchJobs]);

    useEffect(() => {
        const hasPendingJobs = jobs.some(job => job.status === 'pending');
        if (!hasPendingJobs || loading) return;

        const interval = setInterval(async () => {
            const pendingJobs = jobs.filter(job => job.status === 'pending');
            if (pendingJobs.length === 0) {
                clearInterval(interval);
                return;
            }
            await Promise.all(pendingJobs.map(job => checkJobStatus(job)));
            await fetchJobs();
        }, 5000);
        return () => clearInterval(interval);
    }, [jobs, fetchJobs, loading]);

    const handleCreateJob = async (url: string) => {
        const optimisticJob: CrawlJob = {
            id: `optimistic-${Date.now()}`,
            user_id: session!.user.id,
            target_url: url,
            status: 'pending',
            created_at: new Date().toISOString(),
            is_stale: false,
        };
        setJobs(currentJobs => [optimisticJob, ...currentJobs]);
        const result = await createCrawlJob(url);
        await fetchJobs();
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };
    
    const handleDeleteJob = async (jobId: string) => {
        setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
        const result = await deleteCrawlJob(jobId);
        if (!result.success) {
            toast.error(result.message);
            await fetchJobs();
        } else {
            toast.success(result.message);
        }
    };

    const handleRetryJob = async (jobId: string) => {
        const result = await retryCrawlJob(jobId);
        await fetchJobs();
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const handleSignOut = async () => await signOut();

    if (loading) return <div className="flex items-center justify-center min-h-screen"><p>Loading dashboard...</p></div>;

    return (
        <div className='container mx-auto p-4 md:p-8'>
            <header className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-3xl font-bold'>Dashboard</h1>
                    <p className='text-muted-foreground'>Welcome back, {session?.user.email}</p>
                </div>
                <Button onClick={handleSignOut} variant='outline'>Sign Out</Button>
            </header>
            <main>
                <JobForm onJobSubmit={handleCreateJob} />
                <JobHistoryTable
                    jobs={jobs}
                    onDeleteJob={handleDeleteJob}
                    onRetryJob={handleRetryJob}
                />
            </main>
        </div>
    );
}
