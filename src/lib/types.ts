/** @format */
/**
 * Defines the shape of a single crawl job object used throughout the application.
 */
export type CrawlJob = {
    id: string;
    user_id: string;
    target_url: string;
    job_id?: string | null;
    status: 'pending' | 'completed' | 'failed';
    result: string | null;
    created_at: string;
    is_stale: boolean;
    etag_header?: string | null;
    last_modified_header?: string | null;
    idx?: number;
};
