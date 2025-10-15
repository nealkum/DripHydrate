# Drip Hydration IV Therapy Booking App

## Overview

Drip Hydration is a premium IV therapy booking platform that enables customers to schedule in-home IV hydration and wellness treatments with licensed nurses. The application provides a modern, mobile-first booking experience with treatments spanning vitamin wellness IVs and NAD+ therapy across 100+ cities. The platform also features a comprehensive membership program with four pricing tiers offering exclusive benefits and savings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React with TypeScript for type-safe component development
- Wouter for lightweight client-side routing
- Vite as the build tool and development server

**UI Component System**
- Shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for consistent theming (light mode only - clean white medical aesthetic)
- Drip Hydration brand colors: Teal primary (#00B8B0), white backgrounds, near-black text
- Treatment cards without product images for cleaner design aesthetic
- All CTAs styled with uppercase text and teal branding

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod resolvers for form state and validation
- Session storage for booking flow state persistence

**Design System**
- Typography: Inter (primary font) - clean, medical-grade readability
- Mobile-first responsive design approach
- Professional healthcare aesthetic matching driphydration.com branding
- Teal primary color (#00B8B0 / HSL 174 100% 36%) with white backgrounds
- Uppercase button styling for all CTAs with font-weight 600
- Custom button, card, and elevation variants for consistent UX

### Backend Architecture

**Server Framework**
- Express.js for RESTful API endpoints
- TypeScript for end-to-end type safety
- Custom middleware for request logging and error handling

**Data Layer**
- Drizzle ORM for type-safe database operations
- PostgreSQL via Neon serverless for production database
- In-memory storage implementation for development/testing
- Schema-first approach with Zod validation integration

**API Design**
- RESTful endpoints for categories, treatments, cities, and appointments
- Separation of concerns with storage abstraction layer (IStorage interface)
- Response formatting with consistent error handling

**Database Schema**
- Categories: Treatment groupings (Vitamin & Wellness, NAD+ Therapy)
- Treatments: Individual services with pricing, duration, benefits, and descriptions
- Cities: Service locations with region grouping
- Appointments: Customer bookings with address, scheduling, and contact information

**Note:** Injectable Boosters category has been removed from the application.

### Core Features

**Membership Program**
- Four membership tiers: Basic ($295), Premium ($550), Elite ($1000), Platinum ($1800)
- Exclusive member benefits: up to 40% off IVs, 15% off services, priority booking
- HSA/FSA eligible badge highlighting
- Dedicated membership page accessible from homepage hero and header navigation

**Treatment Selection Flow**
- Category overview page showing two main treatment categories
- Category detail pages displaying individual treatments within each category
- Click-through navigation from category cards to detailed treatment listings
- 2-column grid layout for better visual balance with two categories

**Core Booking Flow**
1. Treatment selection from categorized catalog
2. Location selection via free text input (city and address)
3. Schedule selection (date and time)
4. Payment and contact information
5. Confirmation with appointment details

**User Experience Features**
- Step indicator component for booking progress visualization
- Form validation at each step with error feedback
- Session-based state preservation across booking steps
- Responsive layout adapting to mobile and desktop viewports

### Build & Deployment

**Development**
- Hot module replacement via Vite
- TypeScript compilation with strict mode
- Path aliases for clean imports (@/, @shared/, @assets/)
- Replit-specific plugins for development tooling

**Production**
- Vite bundle optimization for client assets
- esbuild for server-side bundling
- Static asset serving from dist/public
- Environment-based configuration (NODE_ENV)

## External Dependencies

**Database**
- Neon Serverless PostgreSQL for production data storage
- Drizzle Kit for schema migrations and database management

**UI Libraries**
- Radix UI primitives (accordion, dialog, dropdown, popover, select, toast, etc.)
- Embla Carousel for image/content carousels
- React Day Picker for calendar/date selection
- Lucide React for icon system

**Development Tools**
- Vite plugins: runtime error modal, cartographer (Replit), dev banner
- TSX for TypeScript execution in development
- Autoprefixer for CSS vendor prefixing

**Utilities**
- date-fns for date formatting and manipulation
- clsx + tailwind-merge for conditional className composition
- class-variance-authority for component variant management
- nanoid for unique ID generation

**Forms & Validation**
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for integration between the two
- drizzle-zod for automatic schema-to-Zod conversion