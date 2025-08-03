# Vercel Configuration Documentation

This document explains the `vercel.json` configuration file for the LLM Scribe project.

## Overview

The `vercel.json` file configures deployment settings for Vercel, including scheduled cron jobs for content change detection.

## Configuration Breakdown

### Schema
```json
"$schema": "https://openapi.vercel.sh/vercel.json"
```
- Provides IDE support and validation for Vercel configuration
- Enables autocomplete and error checking in supported editors

### Cron Jobs
```json
"crons": [
    {
        "path": "/api/cron/check-sites",
        "schedule": "0 5 * * *"
    }
]
```

#### Content Change Detection Cron Job
- **Path**: `/api/cron/check-sites`
- **Purpose**: Monitors websites for content changes using HTTP headers (ETag, Last-Modified)
- **Schedule**: `0 5 * * *` = Run at 5:00 AM UTC every day

#### Cron Expression Format
```
minute hour day month day-of-week
```

#### Schedule Examples
- `"0 5 * * *"` = Every day at 5:00 AM UTC
- `"0 */6 * * *"` = Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
- `"0 9 * * 1"` = Every Monday at 9:00 AM UTC
- `"*/30 * * * *"` = Every 30 minutes
- `"0 0 * * 0"` = Every Sunday at midnight UTC

## Additional Configuration Options

### Function-Specific Settings
```json
"functions": {
    "src/app/api/cron/check-sites/route.ts": {
        "maxDuration": 60
    }
}
```

### Custom Headers
```json
"headers": [
    {
        "source": "/api/cron/(.*)",
        "headers": [
            {
                "key": "X-Robots-Tag",
                "value": "noindex"
            }
        ]
    }
]
```

### URL Rewrites
```json
"rewrites": [
    {
        "source": "/cron-check",
        "destination": "/api/cron/check-sites"
    }
]
```

## Deployment Notes

1. **Timezone**: All cron schedules run in UTC
2. **Authentication**: Cron jobs require the `CRON_SECRET` environment variable
3. **Monitoring**: Check Vercel dashboard for cron job execution logs
4. **Rate Limits**: Vercel has limits on cron job frequency and duration

## Environment Variables Required

Make sure these are set in your Vercel project:
- `CRON_SECRET` - Secure token for cron job authentication
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## Testing

Test the cron job endpoint locally:
```bash
curl -X GET http://localhost:3000/api/cron/check-sites \
-H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Troubleshooting

1. **Cron job not running**: Check Vercel dashboard for execution logs
2. **Authentication errors**: Verify `CRON_SECRET` is set correctly
3. **Timeout issues**: Ensure `maxDuration` is sufficient for your use case
4. **Database errors**: Check Supabase connection and permissions 