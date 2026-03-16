# ZK REZK - Luxury Jewelry E-commerce Platform

## Overview

ZK REZK is a full-stack luxury jewelry e-commerce platform with a modern monorepo architecture. It features a React frontend and a Node.js/Express backend, using PostgreSQL (via Neon) for data. The platform offers an elegant design, smooth user experience, and a comprehensive admin dashboard. It serves as both a customer-facing storefront and an administrative content management system for products, collections, journal posts, and customer orders, implementing session-based authentication with role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript
- **Vite** for build and development
- **Wouter** for client-side routing
- **TanStack Query** for server state management

**UI Component Strategy**
- **shadcn/ui** built on Radix UI
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Custom design system** with a luxury aesthetic (serif/display fonts, brutalist modern design)

**State Management Approach**
- **React Context API** for global state (ProductContext, AuthContext)
- TanStack Query for server state caching

**Key Design Decisions**
- Monolithic context providers
- Custom hooks (useProducts, useAuth, useToast)
- Mobile-first responsive design

### Backend Architecture

**Server Framework**
- **Express.js** REST API with TypeScript
- **Session-based authentication** using `express-session` with `connect-pg-simple`
- **Passport.js** for authentication
- **bcrypt** for password hashing

**Database Layer**
- **Drizzle ORM** for type-safe queries and schema management
- **Neon Serverless PostgreSQL**
- Shared schema (`shared/schema.ts`)

**Authentication & Authorization**
- Session cookies with HttpOnly settings
- Role-based middleware (`requireAuth`, `requireAdmin`)
- Email verification and password reset via secure tokens

**API Design**
- RESTful endpoints under `/api`
- Organized by resource
- CRUD operations for entities
- Validation using Zod schemas

**Code Organization**
- `server/routes.ts`: API endpoint registration
- `server/storage.ts`: Database abstraction
- `server/db.ts`: Database connection
- `shared/schema.ts`: Shared schemas

### Build & Deployment

**Development Workflow**
- `npm run dev`: Express server with Vite middleware
- Custom Vite plugins for runtime error overlay

**Production Build**
- `npm run build`: `esbuild` for server code bundling
- Client assets built with Vite to `dist/public`

**Build Strategy Rationale**
- `esbuild` for fast server bundling
- Selective dependency bundling for serverless environments
- Monolithic server bundle for improved cold start performance

### Data Schema

**Core Entities**
- **Users**: Admin/customer roles, email verification, profile fields (fullName, cpfCnpj, phone, address fields)
- **Categories, Collections, Products**: Core e-commerce entities
- **Journal Posts**: Editorial content
- **Subscribers, Customers, Orders**: User and transactional data (orders linked to userId and paymentId)
- **Branding**: Configurable site content
- **EmailVerificationTokens, PasswordResetTokens**: For secure authentication flows
- **AsaasCustomers, AsaasPayments**: Payment gateway records (payments linked to userId)

**Schema Design Decisions**
- Relational structure with foreign keys
- Boolean flags for product features
- Denormalized branding table
- Serial IDs for primary keys
- User profile fields use camelCase JS properties mapping to snake_case DB columns (Drizzle convention)

### Security & LGPD Compliance

**Security Features**
- **Helmet Security Headers**: HSTS, X-Frame-Options, CSP
- **Rate Limiting**: For login, registration, password recovery
- **CSRF Protection**: Session-based tokens
- **Input Validation**: Zod schemas with Portuguese error messages
- **Password Strength**: Minimum 8 characters with complexity
- **Secure Token Hashing**: SHA256 hashes stored for tokens
- **bcrypt Cost Factor**: Uniform cost 12 across all password hashing
- **Session Invalidation**: All active sessions are deleted after password reset (fail-closed)
- **Password Reset Token Expiry**: 3 hours
- **Email Verification Token Expiry**: 48 hours
- **Admin Email Failure Alerts**: Admin notified via email when verification emails fail to send

**User Profile & Purchase Flow**
- **Profile Management**: GET/PATCH /api/users/profile endpoints for viewing and updating user data
- **Account Page**: "Meus Dados" section with editable profile form (personal info + address)
- **Cart Auth Gate**: Modal prompts unauthenticated users to login/register before checkout
- **Checkout Pre-fill**: Profile data auto-fills checkout form for authenticated users
- **Silent Profile Save**: Checkout data silently saved to profile when advancing to payment step
- **Order Creation**: Payment routes create order records linked to userId with generated orderId (ZK-{timestamp}-{random})
- **Admin Order Notifications**: Admin notified via email on new orders
- **ASAAS Webhook**: POST /api/webhooks/asaas processes PAYMENT_CONFIRMED and PAYMENT_RECEIVED events with idempotency, updates payment/order status, sends customer confirmation email. Auth via `asaas-access-token` header matched against `ASAAS_WEBHOOK_TOKEN` env var (optional in dev). Always returns HTTP 200 to ASAAS.

**LGPD Compliance**
- **Consent Management**: Required consent for Terms and Privacy Policy, optional for marketing
- **Data Export**: User data export in JSON format
- **Account Deletion**: Anonymization or soft deletion with retention period
- **Audit Logging**: Sensitive actions logged to `audit_logs` table

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **drizzle-orm**: Type-safe ORM
- **drizzle-kit**: CLI for migrations

### UI & Styling
- **@radix-ui/***: Unstyled component primitives
- **tailwindcss**: Utility-first CSS
- **framer-motion**: Animations
- **lucide-react**: Icon library

### Forms & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation
- **drizzle-zod**: Zod schemas from Drizzle tables

### Authentication
- **passport**: Authentication middleware
- **passport-local**: Username/password strategy
- **bcrypt**: Password hashing
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Frontend tooling
- **esbuild**: JavaScript bundler
- **tsx**: TypeScript execution
- **@replit/vite-plugin-***: Replit-specific plugins

### Routing & State
- **wouter**: Minimalist router
- **@tanstack/react-query**: Async state management

### Carousel
- **embla-carousel-react**: Lightweight carousel
- **embla-carousel-autoplay**: Autoplay plugin

### Asset Management
- Custom Vite plugin for OpenGraph image URL generation
- Static asset serving
- Image imports from `attached_assets`

### Notable Third-Party Services
- **Neon Database**: Serverless Postgres
- **Resend**: Email service for transactional emails and admin notifications