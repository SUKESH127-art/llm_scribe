# LLM Scribe

**Intelligent Web Content Monitoring & LLMs.txt Generation Platform**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)](https://llm-scribe.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20React%2019%20%7C%20Supabase-blue)](https://llm-scribe.vercel.app/)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-purple)](https://llm-scribe.vercel.app/)

> **Transform any website into structured LLMs.txt content with intelligent change detection and automated monitoring.**

## 🎯 **What is LLM Scribe?**

LLM Scribe is a production-ready web application that automatically crawls websites, generates LLMs.txt content, and intelligently monitors for content changes. Built for teams that need reliable, scalable web content processing with enterprise-grade security and real-time monitoring.

**🔗 [Try it live now](https://llm-scribe.vercel.app/)**

---

## 🚀 **Core Capabilities**

### **1. Intelligent Web Crawling**
- **Non-blocking job submission** - Submit URLs and get instant feedback
- **Real-time status tracking** - Watch jobs progress from pending → completed/failed
- **Automatic content extraction** - Generate LLMs.txt content from any website
- **Optimistic UI updates** - Seamless user experience with instant visual feedback

### **2. Smart Content Change Detection**
- **HTTP header monitoring** - Uses ETag and Last-Modified headers for efficient detection
- **Automated cron jobs** - Runs every 6 hours to detect content changes
- **Stale content management** - Automatically flags outdated content for re-crawling
- **Rate-limited requests** - Respectful to target servers with built-in delays

### **3. Enterprise Security & Compliance**
- **Google OAuth 2.0 authentication** - Secure, enterprise-grade login
- **Row Level Security (RLS)** - Database-level isolation ensuring users only access their data
- **Server-side validation** - All inputs validated on the server
- **Secure API endpoints** - Bearer token authentication for automated processes

### **4. Production-Ready Architecture**
- **Server Actions** - Secure, server-side logic with client-side calling
- **Real-time polling** - Automatic status updates without page refreshes
- **Error handling** - Comprehensive error management with user-friendly messages
- **Scalable design** - Built to handle multiple concurrent users and jobs

---

## 🎨 **User Experience**

### **Dashboard Overview**
- **Clean, modern interface** built with Tailwind CSS and ShadCN/UI
- **Responsive design** - Works perfectly on desktop and mobile
- **Real-time updates** - See job status changes as they happen
- **One-click operations** - Copy LLMs.txt content to clipboard instantly

### **Job Management**
- **Create jobs** - Submit any URL for processing
- **Track progress** - Real-time status updates with visual indicators
- **Manage history** - View your 8 most recent jobs with full details
- **Handle failures** - Retry failed jobs with a single click

### **Content Generation**
- **LLMs.txt creation** - Generate structured content from any website
- **Preview functionality** - View content before copying
- **Copy to clipboard** - One-click content extraction
- **Stale content detection** - Automatic re-crawling when content changes

---

## 🏗️ **Technical Architecture**

### **Modern Tech Stack**
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + ShadCN/UI components
- **Backend**: Next.js Server Actions + Supabase
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel with automatic CI/CD

### **Key Design Patterns**
- **Server Actions** - Secure backend operations
- **Optimistic Updates** - Instant UI feedback
- **Real-time Polling** - Automatic status synchronization
- **Content Change Detection** - HTTP header-based monitoring
- **Stale Job Management** - Intelligent re-crawling system

---

## 📊 **Performance & Scalability**

### **Efficient Processing**
- **Non-blocking operations** - Jobs don't block the UI
- **Optimistic updates** - Instant visual feedback
- **Real-time polling** - Automatic status synchronization
- **Batch processing** - Efficient database operations

### **Resource Management**
- **Automatic job culling** - Keeps only 8 most recent jobs per user
- **Rate limiting** - Respectful to target servers
- **Timeout protection** - Prevents hanging requests
- **Error recovery** - Robust error handling and recovery

---

## 🔒 **Security & Compliance**

### **Data Protection**
- **Row Level Security (RLS)** - Database-level data isolation
- **User authentication** - Secure Google OAuth 2.0 flow
- **Input validation** - Server-side validation for all inputs
- **Secure API endpoints** - Bearer token authentication

### **Privacy & Compliance**
- **User data isolation** - Users can only access their own data
- **Secure session management** - Proper session handling and cleanup
- **Audit trails** - Complete job history and status tracking
- **GDPR ready** - User data control and deletion capabilities

---

## 🚀 **Getting Started**

### **Live Demo**
Visit **[https://llm-scribe.vercel.app/](https://llm-scribe.vercel.app/)** to see LLM Scribe in action.

### **Key Features to Try**
1. **Authentication** - Sign in with your Google account
2. **Job Creation** - Submit a URL for processing
3. **Real-time Tracking** - Watch the job progress in real-time
4. **Content Generation** - Generate and copy LLMs.txt content
5. **Change Detection** - See how stale content is automatically detected

---

## 📈 **Business Value**

### **Time Savings**
- **Automated monitoring** - No manual checking required
- **Instant content generation** - Get LLMs.txt content in seconds
- **Real-time updates** - Always know the latest status
- **One-click operations** - Minimal user interaction required

### **Cost Efficiency**
- **No infrastructure management** - Fully managed deployment
- **Automatic scaling** - Handles traffic spikes automatically
- **Efficient resource usage** - Optimized for performance
- **Reduced manual work** - Automate repetitive tasks

### **Quality Assurance**
- **Consistent output** - Standardized LLMs.txt format
- **Error handling** - Robust error management
- **Data integrity** - Secure and reliable data processing
- **Audit trails** - Complete history and tracking

---

## 🔧 **Integration & API**

### **RESTful API**
- **Job management endpoints** - Create, read, update, delete jobs
- **Status checking** - Real-time job status updates
- **Content retrieval** - Get generated LLMs.txt content
- **Authentication** - Secure API access with OAuth tokens

### **Webhook Support**
- **Job completion notifications** - Get notified when jobs complete
- **Content change alerts** - Receive alerts when content changes
- **Error notifications** - Get notified of processing errors
- **Custom integrations** - Connect with your existing workflows

---

## 📞 **Support & Documentation**

### **Documentation**
- **API Reference** - Complete API documentation
- **User Guide** - Step-by-step usage instructions
- **Integration Guide** - How to integrate with your systems
- **Troubleshooting** - Common issues and solutions

### **Support Options**
- **Email Support** - Direct support for enterprise customers
- **Documentation** - Comprehensive guides and tutorials
- **Community** - User community for questions and tips
- **Professional Services** - Custom integration and consulting

---

**Ready to transform your web content processing? [Try LLM Scribe today](https://llm-scribe.vercel.app/)**

---

*Built with ❤️ using Next.js 15, React 19, and Supabase*
---

## 📸 **Implementation Showcase**

### **Database Architecture**
![Database Design](images/DB_design_for_crawl_jobs.png)
*Comprehensive database schema with Row Level Security (RLS) ensuring data isolation and security*

### **User Authentication**
![Google Authentication](images/google_auth.png)
*Secure Google OAuth 2.0 integration providing enterprise-grade authentication*

### **Dashboard Overview**
![Dashboard Interface](images/Dashboard.png)
*Modern, responsive dashboard with real-time job tracking and status updates*

### **Job Processing**
![Pending Job Status](images/pending_job.png)
*Real-time job status tracking with optimistic UI updates and progress indicators*

### **Content Generation**
![Generated LLMs.txt Content](images/generated_txt.png)
*One-click LLMs.txt content generation with copy-to-clipboard functionality*

---

