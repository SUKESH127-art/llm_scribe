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
import { checkJobStatus, signOut } from '@/lib/actions';

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
            console.error('Error fetching jobs:', error);
        } else {
            setJobs(data || []);
        }
    }, []);

    // Call the server action and performs a hard redirect.
    const handleSignOut = async () => {
        // 1. Call the client-side signOut method with the 'local' scope.
        // This clears the session from browser storage.
        await supabase.auth.signOut({ scope: 'local' });

        // 2. Force a full page reload to the login page.
        // This clears any in-memory state and ensures the login page
        // loads fresh, without a cached session.
        window.location.href = '/login';
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
    }, [router, supabase, fetchJobs]);

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

    // Callback function for optimistic update
    const handleJobSubmitted = (url: string) => {
        // Create a temporary, "fake" job object.
        const optimisticJob: CrawlJob = {
            id: `optimistic-${Date.now()}`,
            user_id: session!.user.id,
            target_url: url,
            status: 'pending',
            created_at: new Date().toISOString(),
            job_id: null, // No external job_id yet
            result: null,
        };

        // Prepend it to jobs list in our state to instantly update UI.
        setJobs(currentJobs => [optimisticJob, ...currentJobs]);
    };

    // CHANGE: This function is now simpler. It only handles the optimistic UI update.
    const handleDeleteJob = (jobId: string) => {
        setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
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
                <JobForm onJobSubmitted={handleJobSubmitted} />
                <JobHistoryTable
                    initialJobs={jobs}
                    onDeleteJob={handleDeleteJob}
                />
            </main>
        </div>
    );
}
