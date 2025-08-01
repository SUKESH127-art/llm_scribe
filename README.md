# LLM Scribe

A modern web application for managing and tracking web crawling jobs with user authentication and real-time status updates.

## 🚀 Features

- **Secure Google Authentication**: Robust user login powered by Supabase Auth, using a secure, server-side OAuth 2.0 callback flow.
- **Non-Blocking Job Submission**: Utilizes a "Fire and Forget" pattern with Next.js Server Actions, providing an instantaneous UI response when submitting new crawl jobs.
- **Real-Time Status Polling**: The dashboard automatically polls for the status of pending jobs, updating the UI in real-time from `pending` to `completed` or `failed` without requiring a page refresh.
- **Optimistic UI Updates**: Creating and deleting jobs feels instantaneous thanks to optimistic UI updates on the client-side.
- **On-Demand Content Generation**: Completed jobs feature a "Generate LLMs.txt" button that displays the final text content in a dialog with a one-click "copy to clipboard" feature.
- **Automatic Job Culling**: A PostgreSQL trigger automatically maintains the job history, keeping only the 8 most recent jobs per user to manage database size.
- **Database-Level Security**: Leverages Supabase's Row Level Security (RLS) to ensure users can only ever access or modify their own jobs.
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Responsive Design**: Desktop & Mobile Friendly!

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: **Tailwind CSS** with **ShadCN/UI** for components.
- **Authentication & DB**: **Supabase** (Auth, Postgres, RLS)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: **Sonner** for toast notifications.
- **Deployment**: **Vercel**

### Architectural Patterns
- **Server Actions**: Used for all backend mutations (`create`, `delete`, `retry`), providing secure, server-side logic that can be called directly from client components.
- **Client-Side State Management**: The main dashboard is a client component that manages all application state, including the job list and polling logic, using React hooks (`useState`, `useEffect`, `useCallback`).
- **Client/Server "Firewall"**: Supabase clients are separated into `lib/supabase.ts` (for the browser) and `lib/supabase-server.ts` to ensure server-only code is never bundled on the client.

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
