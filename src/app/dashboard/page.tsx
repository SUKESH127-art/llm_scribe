/** @format */

'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { JobHistoryTable } from './components/job-history-table';
import { JobForm } from './components/job-form';
import { CrawlJob } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
// --- Centralize all action imports here ---
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

    // Extracted job fetching into a memoized useCallback function for reuse.
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

    // Call the server action and performs a hard redirect.
    const handleSignOut = async () => {
        await signOut();
    };

    // Effect for the initial session check and data load.
    useEffect(() => {
        const initializeDashboard = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    router.replace('/login');
                    return;
                }

                setSession(session);
                await fetchJobs();
            } catch (error) {
                console.error('Initialization error:', error);
                router.replace('/login');
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, [router, fetchJobs]);

    // This effect is responsible for the real-time status updates.
    useEffect(() => {
        const hasPendingJobs = jobs.some(job => job.status === 'pending');
        if (!hasPendingJobs || loading) {
            return;
        }

        const interval = setInterval(async () => {
            const pendingJobs = jobs.filter(job => job.status === 'pending');
            if (pendingJobs.length === 0) {
                clearInterval(interval);
                return;
            }

            console.log(`Polling ${pendingJobs.length} pending job(s)...`);
            await Promise.all(pendingJobs.map(job => checkJobStatus(job)));

            await fetchJobs();
        }, 5000);

        return () => clearInterval(interval);
    }, [jobs, fetchJobs, loading]);

    // --- NEW: Centralized handlers for all job actions ---

    const handleCreateJob = async (url: string) => {
        // Optimistic update for instant UI feedback
        const optimisticJob: CrawlJob = {
            id: `optimistic-${Date.now()}`,
            user_id: session!.user.id,
            target_url: url,
            status: 'pending',
            created_at: new Date().toISOString(),
            job_id: null,
            result: null,
            is_stale: false,
        };
        setJobs(currentJobs => [optimisticJob, ...currentJobs]);

        const result = await createCrawlJob(url);
        
        // Always re-fetch to synchronize with the true database state
        await fetchJobs(); 

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };
    
    const handleDeleteJob = async (jobId: string) => {
        // Optimistic UI update
        setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
        
        const result = await deleteCrawlJob(jobId);
        
        if (!result.success) {
            toast.error(result.message);
            // Re-fetch to restore the job if the delete failed (e.g., due to RLS)
            await fetchJobs();
        } else {
            toast.success(result.message);
        }
    };

    const handleRetryJob = async (jobId: string) => {
        const result = await retryCrawlJob(jobId);

        // Re-fetch to show the new pending job and remove the old one
        await fetchJobs();

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <p className='text-muted-foreground'>Loading dashboard...</p>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect to login
    }

    return (
        <div className='container mx-auto p-4 md:p-8'>
            <header className='flex justify-between items-center mb-6'>
                <div>
                    <h1 className='text-3xl font-bold'>Dashboard</h1>
                    <p className='text-muted-foreground'>
                        Welcome back, {session?.user.email}
                    </p>
                </div>
                <Button onClick={handleSignOut} variant='outline'>
                    Sign Out
                </Button>
            </header>
            <main>
                {/* Pass the new centralized handlers as props */}
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
