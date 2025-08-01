# AI-Powered Social Media Management Platform

## Overview

This is a comprehensive AI-powered social media management platform built with a modern full-stack architecture. The application enables users to create, schedule, and manage social media content across multiple platforms using AI-generated content tailored to specific business types.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management and React Context for local state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **API Pattern**: RESTful API with standardized error handling
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC (OpenID Connect)
- **Session Storage**: PostgreSQL sessions table with automatic cleanup
- **Security**: JWT tokens with secure HTTP-only cookies
- **User Management**: Automatic user creation and profile management

### AI Content Generation
- **AI Provider**: OpenAI GPT-4o (latest model)
- **Content Types**: Social posts, faceless videos, before/after content, educational tips
- **Customization**: Business type-specific prompts and tone adjustment
- **Platform Optimization**: Content variations for different social media platforms

### Content Management
- **Post Creation**: Multi-step wizard with business type and content type selection
- **Scheduling**: Calendar-based post scheduling with timezone support
- **Media Handling**: File upload system with local storage (cloud-ready architecture)
- **Analytics**: Post performance tracking and engagement metrics

### User Interface
- **Design System**: Custom design tokens with semantic color variables
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Component Library**: Reusable UI components with consistent styling
- **Dark Mode**: CSS variables-based theming system ready for dark mode

## Data Flow

### User Authentication Flow
1. User accesses protected route
2. Replit Auth middleware validates session
3. User data retrieved from PostgreSQL users table
4. Frontend receives user context and navigation permissions

### Content Creation Flow
1. User selects business type and content preferences
2. Frontend sends request to AI content generation service
3. OpenAI GPT-4o generates tailored content with platform variations
4. Content stored in PostgreSQL with scheduling metadata
5. Background job system handles scheduled posting

### Data Management Flow
1. All database operations use Drizzle ORM for type safety
2. Shared schema definitions between frontend and backend
3. Query optimization with connection pooling
4. Real-time updates using TanStack Query cache invalidation

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o for content generation with JSON response formatting
- **Content Optimization**: Platform-specific content variations and hashtag generation

### Authentication
- **Replit Auth**: OIDC-based authentication with automatic user provisioning
- **Session Management**: PostgreSQL-backed sessions with configurable TTL

### Database Services
- **Neon Database**: Serverless PostgreSQL with WebSocket connections
- **Connection Pooling**: Optimized for serverless environments

### Development Tools
- **Vite**: Fast development server with HMR and optimized production builds
- **TypeScript**: Full-stack type safety with shared type definitions
- **Tailwind CSS**: Utility-first styling with custom design system

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to dist/public
- **Backend**: esbuild bundles Node.js server with ESM format
- **Shared Code**: TypeScript definitions shared between client and server

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **AI Services**: OpenAI API key configuration
- **Authentication**: Replit-specific environment variables for OIDC

### Development Workflow
- **Hot Reload**: Vite middleware for frontend changes
- **Server Restart**: tsx for TypeScript server execution with file watching
- **Database Migrations**: Drizzle Kit for schema changes and version control

### Recent Changes
- **2025-01-27**: Fixed "View Calendar" button visibility and other link button contrast issues  
  - Changed "View Calendar" and "View All" buttons from invisible primary colors to visible blue text
  - Enhanced empty state sections with clear call-to-action buttons
  - Fixed scheduled post status indicators to use standard orange colors instead of custom warning colors
  - All link-style buttons now use consistent blue-600/blue-700 color scheme for optimal visibility
- **2025-01-27**: Fixed dashboard color contrast and visibility issues
  - Enhanced welcome message with stronger blue gradient background and white text
  - Improved button contrast with white backgrounds and dark text for better readability
  - Updated metric cards and quick action cards with consistent blue, green, and orange color schemes
  - Ensured all text elements meet accessibility standards with proper color contrast ratios
  - Added stronger shadows and borders for better visual separation
- **2025-01-27**: Fixed stuck loading screen after sign out
  - Fixed authentication loop causing repeated 401 requests after logout
  - Updated useAuth hook to properly handle 401 errors without infinite retries
  - Added proper cache clearing on logout to prevent authentication state issues
  - Sign out now works smoothly and returns users to homepage without getting stuck
- **2025-01-27**: Added sticky header to homepage for consistent navigation
  - Homepage now has sticky navigation that remains at top during scrolling
  - Added glass-morphism effect with semi-transparent background and backdrop blur
  - Login/signup buttons always accessible throughout homepage experience
  - Consistent sticky header behavior across all pages (homepage and dashboard)
- **2025-01-27**: Made header sticky and improved navigation UX
  - Header now remains fixed at top of page during scrolling (sticky positioning)
  - Added z-index to ensure header appears above all page content
  - Navigation and sign out always accessible regardless of scroll position
- **2025-01-27**: Added homepage navigation and fixed sidebar Dashboard link
  - Added homepage navigation button to Layout header for easy navigation back to landing page
  - Fixed Dashboard navigation in sidebar (was pointing to "/" instead of "/dashboard")
  - Added header with logo/brand that serves as homepage navigation button
  - Users can now navigate back to homepage from any protected page within the app
- **2025-01-27**: Fixed homepage access to allow all users to view landing page
  - Updated routing logic to make homepage (/) accessible to both authenticated and unauthenticated users
  - Modified Landing page to show context-aware navigation based on authentication status
  - Authenticated users see welcome message and "Go to Dashboard" button
  - Unauthenticated users see standard "Sign In" and "Get Started" options
  - Protected routes redirect unauthenticated users back to homepage
- **2025-01-27**: Fixed home page loading/routing issue that caused brief Landing page flash before redirecting to Dashboard
  - Separated loading state from authentication logic in App.tsx
  - Added proper loading spinner during auth verification
  - Eliminated content flashing by preventing premature route rendering

### Scalability Considerations
- **Database**: Connection pooling ready for horizontal scaling
- **File Storage**: Local storage with cloud migration path prepared
- **Caching**: TanStack Query provides intelligent client-side caching
- **Session Storage**: PostgreSQL sessions support distributed deployments