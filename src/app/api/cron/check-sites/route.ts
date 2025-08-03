import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a system-level route, so we use the Supabase service role key
// to bypass RLS and operate on the entire table.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 60; // Allow this function to run for up to 60 seconds on Vercel

export async function GET(request: NextRequest) {
  // IMPROVEMENT 1: More robust authentication check & consistent JSON responses
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: recentJobs, error: rpcError } = await supabaseAdmin.rpc(
      'get_latest_job_for_each_url'
    );

    if (rpcError) throw rpcError;

    let updatedCount = 0;
    const updatePromises = [];

    for (const job of recentJobs) {
      // IMPROVEMENT 2: Add a small delay between requests to be a good internet citizen
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay

      try {
        // IMPROVEMENT 3: Add timeout protection for fetch requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

        const response = await fetch(job.target_url, { 
            method: 'HEAD', 
            cache: 'no-store',
            signal: controller.signal 
        });

        clearTimeout(timeoutId); // Clear the timeout if the fetch was successful

        const newEtag = response.headers.get('etag');
        const newLastModified = response.headers.get('last-modified');

        const hasEtagChanged = job.etag_header && newEtag && job.etag_header !== newEtag;
        const hasLastModifiedChanged = job.last_modified_header && newLastModified && new Date(newLastModified) > new Date(job.last_modified_header);

        if (hasEtagChanged || hasLastModifiedChanged) {
          const promise = supabaseAdmin
            .from('crawl_jobs')
            .update({ is_stale: true })
            .eq('target_url', job.target_url);
          
          updatePromises.push(promise);
          updatedCount++;
        }
      } catch (fetchError) {
        // Logging for individual fetch errors
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error(`Timeout checking URL (15s): ${job.target_url}`);
        } else {
          console.error(`Failed to check URL: ${job.target_url}`, fetchError);
        }
        // We will log the error but not stop the entire cron job.
      }
    }
    
    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, sitesChecked: recentJobs.length, sitesUpdated: updatedCount });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}