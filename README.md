# LLM Scribe

A modern web application for managing and tracking web crawling jobs with user authentication and real-time status updates.

## 🚀 Features

- **User Authentication**: Secure login system powered by Supabase Auth
- **Job Management**: Create and track web crawling jobs
- **Real-time Updates**: Optimistic UI updates for better user experience
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase](https://supabase.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SUKESH127-art/llm_scribe.git
cd llm_scribe
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# External API Configuration (if needed)
INTERNAL_API_KEY=your_external_api_key_here
```

You can find these values in your [Supabase dashboard](https://supabase.com/dashboard/project/_/settings/api).

### 4. Database Setup

Make sure your Supabase project has the following table structure:

```sql
-- Create the crawl_jobs table
CREATE TABLE crawl_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  job_id TEXT,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE crawl_jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own jobs
CREATE POLICY "Users can view own jobs" ON crawl_jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own jobs
CREATE POLICY "Users can insert own jobs" ON crawl_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
llm_scribe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   │   └── components/    # Dashboard-specific components
│   │   ├── login/             # Login page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   └── lib/                   # Utility functions and configurations
├── public/                    # Static assets
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Usage

1. **Authentication**: Users must sign in to access the dashboard
2. **Create Jobs**: Submit URLs for web crawling through the job form
3. **Track Progress**: Monitor job status and results in the job history table
4. **Real-time Updates**: See immediate feedback when jobs are submitted

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Import your project to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `INTERNAL_API_KEY` (if needed)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/SUKESH127-art/llm_scribe/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainers

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
