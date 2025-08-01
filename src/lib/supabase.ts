import { createBrowserClient } from '@supabase/ssr';

/**
 * This is the singleton instance of the Supabase client for the browser.
 * It is created once and reused throughout the client-side of the application.
 */
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
