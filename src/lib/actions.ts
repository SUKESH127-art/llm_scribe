/** @format */

'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CrawlJob } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Background task to make the slow API call to the crawler service.
 * This is called without `await` to avoid blocking the main thread.
 * @param jobId - The internal Supabase DB ID for the job.
 * @param url - The target URL to crawl.
 * @param supabase - An authenticated Supabase client instance.
 */
async function triggerAndTrackJob(
    jobId: string,
    url: string,
    supabase: SupabaseClient
) {
    try {
        const apiResponse = await fetch(
            'https://llms-txt-crawler-api.onrender.com/generate-llms-txt',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.INTERNAL_API_KEY!}`,
                },
                body: JSON.stringify({ url: url, limit: 1 }),
            }
        );

        const apiData = await apiResponse.json();

        if (!apiResponse.ok) {
            throw new Error(
                apiData.detail || 'The crawler API returned an error.'
            );
        }

        // Success: Update our job with the external ID from the crawler service.
        await supabase
            .from('crawl_jobs')
            .update({ job_id: apiData.job_id })
            .eq('id', jobId);
    } catch (error) {
        console.error(
            `Background job trigger failed for Supabase job ID ${jobId}:`,
            error
        );
        // If the trigger fails, mark our job as failed so it doesn't stay pending forever.
        await supabase
            .from('crawl_jobs')
            .update({ status: 'failed' })
            .eq('id', jobId);
    }
}

/**
 * Creates a new crawl job. Returns instantly to the client ("Fire and Forget").
 * @param url - The target URL to crawl.
 * @returns An object indicating success or failure with a message.
 */
export async function createCrawlJob(url: string) {
    const supabase = await createServerSupabaseClient();
    try {
        //for supabase: getUser > getSession for security
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        // The new check for an authenticated user.
        if (userError || !user) {
            throw new Error('User not authenticated');
        }

        // Create the job in our DB instantly
        const { data: newJob, error: insertError } = await supabase
            .from('crawl_jobs')
            .insert({ target_url: url, user_id: user.id, status: 'pending' })
            .select('id')
            .single();

        if (insertError || !newJob) {
            throw new Error('Failed to create job record in database.');
        }

        triggerAndTrackJob(newJob.id, url, supabase);

        // Return to the user immediately.
        revalidatePath('/dashboard');
        return { success: true, message: 'Job submitted successfully!' };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred.',
        };
    }
}

/**
 * Polls the external crawler API for the status of a single job.
 * @param job - The crawl job object from our database.
 */
export async function checkJobStatus(job: CrawlJob) {
    const supabase = createServerSupabaseClient();

    // Added logic to handle stale pending jobs without external job_id
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    if (!job.job_id && new Date(job.created_at) < twoMinutesAgo) {
        console.error(`Job ${job.id} is stale, marking as failed.`);
        (await supabase)
            .from('crawl_jobs') // TODO: debug
            .update({ status: 'failed' })
            .eq('id', job.id);
        revalidatePath('/dashboard');
        return;
    }

    if (!job.job_id) {
        console.error(`Job ${job.id} has no external job_id to check.`);
        return;
    }

    try {
        const apiResponse = await fetch(
            `https://llms-txt-crawler-api.onrender.com/crawl-status/${job.job_id}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.INTERNAL_API_KEY!}`,
                },
            }
        );

        // if status 202, job still running
        if (apiResponse.status == 202) {
            console.log(`Job is still running! Status 202!`);
            // update db maybe, still waiting
            return;
        }

        const supabase = await createServerSupabaseClient();
        if (apiResponse.status == 200) {
            console.log(`Job complete, updating DB with result! Status 200!`);
            // Job complete, update our DB with result
            const resultText = await apiResponse.text();
            console.log(`result: ${resultText}`);
            await supabase
                .from('crawl_jobs')
                .update({
                    status: 'completed',
                    result: resultText,
                })
                .eq('id', job.id);
        } else {
            // Any other status (400, 404, etc.) is considered a failure
            const errorText = await apiResponse.text();
            console.error(
                `Job ${job.job_id} failed with status ${apiResponse.status}: ${errorText}`
            );
            await supabase
                .from('crawl_jobs')
                .update({ status: 'failed' })
                .eq('id', job.id);
        }
        // Revalidate the path so the next full refresh will definitely get the new data.
        revalidatePath('/dashboard');
    } catch (error) {
        console.error(`Error in checkJobStatus for job ${job.job_id}:`, error);
    }
}

/**
 * Deletes a crawl job from the database.
 * Relies on RLS to ensure a user can only delete their own jobs.
 * @param jobId - The UUID of the job to be deleted.
 * @returns An object indicating success or failure with a message.
 */
export async function deleteCrawlJob(jobId: string) {
    const supabase = await createServerSupabaseClient();
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data: deletedJob, error } = await supabase
            .from('crawl_jobs')
            .delete()
            .eq('id', jobId)
            .select();

        if (error) {
            throw error;
        }
        // --- NEW: Check if anything was actually deleted ---
        if (!deletedJob || deletedJob.length === 0) {
            // This is our RLS failure case. The query ran but affected 0 rows.
            throw new Error(
                'Delete failed: Job not found or permission denied by RLS.'
            );
        }

        console.log('Successfully deleted job:', deletedJob[0]);

        await revalidatePath('/dashboard');
        return { success: true, message: 'Job deleted successfully!' };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to delete job.',
        };
    }
}

/**
 * Signs the current user out and redirects to the login page.
 *
 * This function logs out the authenticated user from Supabase and navigates them to the login screen.
 */
export async function signOut() {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    // This redirect is crucial for clearing the auth cookie.
    return redirect('/login');
}
