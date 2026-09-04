# Recipe Sharing Platform

## Overview

A community-driven recipe sharing platform where home chefs can create, discover, and organize culinary creations. The platform emphasizes visual storytelling and community engagement, allowing users to share recipes with detailed instructions, images, and videos, while organizing them through tags, categories, and weekly meal planning.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript/JavaScript (dual support)
- Single-page application (SPA) using Wouter for client-side routing
- Vite as the build tool and development server
- React Query (@tanstack/react-query) for server state management and data fetching

**UI Component System**: shadcn/ui with Radix UI primitives
- Pre-built accessible components using Radix UI headless primitives
- Tailwind CSS for styling with custom design tokens
- Class variance authority (CVA) for component variant management
- Custom theme system supporting light/dark modes with CSS variables

**Design System**:
- Typography: DM Sans (primary), Playfair Display/Merriweather (accent for recipe titles)
- Spacing: Tailwind's standardized spacing scale (2, 4, 6, 8, 12, 16, 24)
- Component styling: "New York" shadcn style variant with rounded corners and subtle shadows
- Responsive grid layouts for recipe cards (1-4 columns based on viewport)

**State Management Pattern**:
- Server state: React Query with aggressive caching (staleTime: Infinity)
- Client state: React hooks and component state
- Authentication state: Custom useAuth hook wrapping React Query

### Backend Architecture

**Framework**: Express.js with TypeScript/JavaScript (dual support)
- HTTP server with JSON middleware
- Session-based authentication using express-session
- Request/response logging middleware with timestamp formatting

**API Design**:
- RESTful API endpoints under `/api` prefix
- Middleware-based authentication guards (isAuthenticated)
- Structured error handling with HTTP status codes
- Raw body capture for webhook validation support

**Data Access Layer**:
- Repository pattern via `DatabaseStorage` class
- Separation of database operations from route handlers
- Consistent async/await error handling
- Type-safe database queries using Drizzle ORM

**Authentication System**:
- Replit Auth (OIDC) integration via Passport.js
- Session management with PostgreSQL session store (connect-pg-simple)
- Token refresh logic with automatic session updates
- User profile synchronization on authentication

### Data Storage

**Database**: PostgreSQL (via Neon serverless)
- Drizzle ORM for type-safe database access
- Schema-first approach with Zod validation integration
- Connection pooling for optimal performance

**Database Schema**:
- **users**: Profile data (email, name, bio, profile image)
- **recipes**: Core recipe data (title, description, instructions, images, difficulty, timing, servings)
- **categories**: Organizational buckets (Breakfast, Lunch, Dinner, Desserts, etc.)
- **tags**: Cross-cutting labels (Vegan, Gluten-Free, Quick Meal, etc.)
- **recipeTags**: Many-to-many relationship between recipes and tags
- **favorites**: User bookmarks for recipes
- **ratings**: User ratings (1-5 stars) for recipes
- **comments**: User comments and reviews on recipes
- **mealPlans**: Weekly meal planning containers
- **mealPlanItems**: Individual meal assignments (recipe + day + meal type)
- **sessions**: OIDC session storage

**Data Relationships**:
- One-to-many: User → Recipes, Recipes → Comments, Recipes → Ratings
- Many-to-many: Recipes ↔ Tags (via recipeTags junction table)
- Structured meal planning: MealPlan → MealPlanItems → Recipes

### Build and Deployment

**Build Process**:
- Client: Vite bundler producing optimized static assets to `dist/public`
- Server: esbuild bundling TypeScript to CommonJS in `dist/index.cjs`
- Selective dependency bundling (allowlist) to reduce cold start times
- Static file serving in production mode

**Development Workflow**:
- Hot module replacement (HMR) via Vite middleware in development
- Automatic TypeScript compilation with tsx
- Database migration via Drizzle Kit (`db:push` command)
- Seeding script for default categories and tags

**Environment Configuration**:
- `NODE_ENV` for development/production switching
- `DATABASE_URL` for PostgreSQL connection string
- `SESSION_SECRET` for session encryption
- `ISSUER_URL` and `REPL_ID` for Replit Auth
- Replit-specific plugins for development (cartographer, dev banner, error overlay)

## External Dependencies

### Third-Party Services

**Authentication**: Replit Auth (OIDC)
- OpenID Connect discovery
- OAuth 2.0 token flow
- Automatic user provisioning and profile sync

**Database Hosting**: Neon Serverless PostgreSQL
- WebSocket-based connections (@neondatabase/serverless)
- Connection pooling for serverless environments
- Drizzle ORM compatibility

### Key Libraries and APIs

**Frontend**:
- React Query: Server state synchronization with 401 handling
- Radix UI: 20+ accessible headless components (dialog, dropdown, popover, etc.)
- Tailwind CSS: Utility-first styling framework
- date-fns: Date formatting and manipulation
- Wouter: Lightweight client-side routing

**Backend**:
- Passport.js: Authentication middleware with OIDC strategy
- Drizzle ORM: Type-safe SQL query builder
- express-session: Session management with PostgreSQL persistence
- Zod: Runtime schema validation
- memoizee: OIDC configuration caching

**Development**:
- Vite: Frontend build tool and dev server
- esbuild: Server-side bundling
- TypeScript: Type checking (configured for incremental builds)
- tsx: TypeScript execution for development server

### Design Assets

**Fonts** (Google Fonts):
- DM Sans: Primary interface font
- Playfair Display/Merriweather: Recipe title accent font
- Fira Code: Monospace font for code elements

**Icons**: Lucide React (icon library integrated with shadcn/ui components)