# ISB Medical Society Website

## Overview

A premium, Bang & Olufsen-inspired static website for the ISB Medical Society. This is a frontend-only application with Decap CMS for content management, designed for deployment on Vercel with zero backend dependencies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Wouter for client-side routing
- TailwindCSS with Shadcn/ui components
- Decap CMS for content management

**Design Pattern:**
- Pure static site - no backend
- Content stored as JSON files in `/client/public/content/`
- All data fetched client-side from JSON files
- Responsive, mobile-first design
- Glassmorphism UI with premium aesthetic

**Pages:**
- Home (hero carousel, mission, programs, news preview)
- About (member directory with profiles)
- News (articles and announcements)
- Contact (contact form)
- Terms & Privacy pages
- Admin panel at `/admin` (Decap CMS)

### Content Management

**Decap CMS Setup:**
- Admin UI accessible at `/admin`
- GitHub OAuth authentication via Vercel serverless functions
- Content stored in: `client/public/content/`
- Collections: Members, News, Hero Images, Programs, Member Classes

**Content Structure:**
- JSON-based content files
- No database required
- Portable across any static hosting

### OAuth Authentication

**Vercel Serverless Functions:**
- `/api/auth` - Initiates GitHub OAuth flow
- `/api/callback` - Handles OAuth callback and token exchange

**Environment Variables Required:**
- `OAUTH_GITHUB_CLIENT_ID` - GitHub OAuth app Client ID
- `OAUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth app Client Secret

### Deployment

**Platform:** Vercel
**Build Settings:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist/public`
- Node Version: 18.x

**Key Files:**
- `vercel.json` - Routing configuration (excludes static assets from SPA rewrites)
- `api/auth.ts` - OAuth start endpoint
- `api/callback.ts` - OAuth callback handler
- `client/public/admin/config.yml` - Decap CMS configuration

### Recent Changes (October 2025)

**Migration to Static Site:**
- Removed all backend dependencies (Express, PostgreSQL, sessions)
- Converted to pure frontend static site
- Implemented Decap CMS for content management
- Added Vercel serverless OAuth for admin authentication
- All content now in JSON files (portable, no database)

**OAuth Setup:**
- Replaced Netlify OAuth with self-hosted Vercel functions
- GitHub OAuth app callback: `https://[vercel-url]/api/callback`
- No Netlify dependency required

### Content Workflow

1. User edits content in `/admin` panel
2. Decap CMS commits changes to GitHub
3. Vercel auto-detects commit and rebuilds (1-2 minutes)
4. Updated content appears on live site

### SEO & Performance

- All meta tags (Open Graph, Twitter Cards)
- JSON-LD structured data
- Optimized images and lazy loading
- Responsive design with mobile-first approach
- Fast build times (~10 seconds)
