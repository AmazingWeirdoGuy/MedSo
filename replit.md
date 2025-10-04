# ISB Medical Society Website

## Overview

This is a full-stack web application for the ISB Medical Society, built as a modern React frontend with an Express.js backend. The application serves as a comprehensive platform for a medical student organization, featuring sections for their mission, programs, news, and contact information. The site showcases the society's healthcare education initiatives, advocacy for healthcare equity, and global impact goals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with routes for programs and news management
- **Data Layer**: In-memory storage implementation with interfaces designed for easy database migration
- **Validation**: Zod schemas for request/response validation and type safety

### Data Storage Solutions
- **Current**: In-memory storage using Maps for development and testing
- **Prepared**: Drizzle ORM configuration ready for PostgreSQL with Neon database integration
- **Schema**: Well-defined database schemas for users, programs, and news with UUID primary keys
- **Migration Strategy**: Drizzle Kit configured for schema migrations when moving to persistent storage

### Development Tooling
- **Build System**: Vite with hot module replacement and development server
- **Package Management**: npm with lockfile for reproducible builds
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Code Quality**: ESLint and Prettier integration through Vite plugins
- **Development Experience**: Replit-specific plugins for enhanced development workflow

### UI/UX Design System
- **Design Tokens**: CSS custom properties for colors, spacing, typography, and shadows
- **Component Library**: Comprehensive set of accessible components including forms, navigation, data display, and feedback components
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Typography**: Inter font family with multiple weights for clean, professional appearance
- **Color Scheme**: Blue and teal primary colors with neutral grays, designed for medical/healthcare branding

## External Dependencies

### UI and Component Libraries
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives (@radix-ui/react-*)
- **Lucide React**: Modern icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing

### Data Management
- **TanStack React Query**: Server state management, caching, and synchronization
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support
- **Neon Database**: Serverless PostgreSQL service (@neondatabase/serverless)
- **Zod**: Schema validation and type inference library

### Development and Build Tools
- **Vite**: Frontend build tool with React plugin and TypeScript support
- **Wouter**: Lightweight routing library for React applications
- **React Hook Form**: Performant forms library with minimal re-renders
- **Date-fns**: Modern JavaScript date utility library

### Backend Infrastructure
- **Express.js**: Web application framework for Node.js
- **Connect-pg-simple**: PostgreSQL session store (prepared for future session management)
- **ESBuild**: Fast JavaScript bundler for production builds

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Enhanced debugging and development features