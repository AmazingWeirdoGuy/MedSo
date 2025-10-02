# ISB Medical Society Website

## Overview

This is a full-stack web application for the ISB Medical Society, a student organization focused on healthcare education, medical advocacy, and promoting equity in medicine. The application features a modern React frontend with a Node.js/Express backend, PostgreSQL database, and content management capabilities through an admin panel.

The system provides public-facing pages for showcasing the society's mission, programs, news, and member profiles, while offering authenticated administrators the ability to manage all website content including members, news articles, and hero images.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query for server state management and data fetching
- TailwindCSS with Shadcn/ui component library for consistent, accessible UI components

**Design Patterns:**
- Component-based architecture with reusable UI components
- Custom hooks for shared logic (authentication, mobile detection, toast notifications)
- Optimized image loading component with modern format support (AVIF, WebP, JPEG)
- Responsive design with mobile-first approach
- Smooth scroll behavior and loading states for enhanced UX

**Key Features:**
- Public pages: Home, About (member directory), News, Contact
- Admin dashboard with tabs for managing members, news, and hero images
- Image cropping functionality for member photos
- Form validation using React Hook Form with Zod schemas
- SEO optimization with meta tags and structured data

### Backend Architecture

**Technology Stack:**
- Node.js with Express for the web server
- TypeScript for type safety across the codebase
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database
- Express sessions with PostgreSQL store for authentication

**API Design:**
- RESTful API endpoints under `/api` prefix
- Session-based authentication (no token-based auth currently)
- Role-based access control with admin middleware
- JSON request/response format with appropriate error handling

**Authentication & Authorization:**
- Simple username/password login system
- Session management using `express-session` with PostgreSQL store
- Middleware functions for authentication (`isAuthenticated`) and admin access (`isAdmin`)
- User and AdminUser tables for managing access levels
- 7-day session expiration

**Database Schema:**
- `users` - User authentication data (compatible with Replit Auth structure)
- `adminUsers` - Admin role and permissions mapping
- `memberClasses` - Categories for organizing members (Officer, Active Member, etc.)
- `members` - Society member profiles with photo support
- `news` - News articles and announcements
- `heroImages` - Carousel images for homepage hero section
- `programs` - Educational programs and initiatives
- `sessions` - Express session storage

**Image Processing:**
- Sharp library for server-side image optimization
- Images stored as base64 data URLs directly in database (fully portable, no file system dependencies)
- Automatic thumbnail generation (256x256) for performance
- Original images resized to max 1200px to optimize storage
- JPEG format with quality optimization (90% original, 85% thumbnail)

### External Dependencies

**Third-Party Services:**
- **SendGrid** - Email delivery service for contact form submissions
  - API key required via `SENDGRID_API_KEY` environment variable
  - Sends emails to `info@isbmedicalsociety.org`

**Database:**
- **PostgreSQL** - Primary data store
  - Connection via `DATABASE_URL` environment variable
  - Managed through Drizzle ORM
  - Session store integration for authentication

**Major NPM Packages:**
- `@radix-ui/*` - Accessible component primitives (20+ packages)
- `drizzle-orm` & `drizzle-kit` - Database ORM and migrations
- `@neondatabase/serverless` - PostgreSQL driver
- `sharp` - Image processing
- `react-easy-crop` - Image cropping UI
- `zod` - Schema validation
- `@sendgrid/mail` - Email service
- `connect-pg-simple` - PostgreSQL session store

**Development Tools:**
- `tsx` - TypeScript execution for development
- `esbuild` - Backend bundling for production
- `tailwindcss` - Utility-first CSS framework
- `autoprefixer` & `postcss` - CSS processing

**Environment Variables Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session encryption
- `SENDGRID_API_KEY` - SendGrid API key (optional for development)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (defaults to 5000)