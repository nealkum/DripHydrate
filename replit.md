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
- Drip Hydration brand colors: Dark teal primary (#367588 / HSL 194 43% 37%), white backgrounds, near-black text
- Treatment cards without product images, with ingredient tags and Book Now + Details buttons
- All CTAs styled with uppercase text and brand teal styling
- Sticky bottom CTA bar on all pages (hidden during booking flow)

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod resolvers for form state and validation
- Session storage for booking flow state persistence

**Design System**
- Typography: Inter (primary font) - clean, medical-grade readability
- Mobile-first responsive design approach
- Professional healthcare aesthetic matching driphydration.com branding
- Dark teal primary color (#367588 / HSL 194 43% 37%) with white backgrounds
- Uppercase button styling for all CTAs with font-weight 600
- Custom button, card, and elevation variants for consistent UX
- Logo-only header (no text next to logo), larger logo size (h-14)

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
- Three membership tiers: Essential ($149/mo), Performance ($259/mo, featured), VIP Unlimited ($449/mo)
- Per-session pricing and savings vs. single booking prominently displayed
- Side-by-side comparison table (Single Session vs. Membership)
- Multi-step signup modal: Personal Info → Health & Preferences → Review & Confirm → Success
- Membership FAQ accordion covering billing, cancellation, plan changes, drip selection, delivery
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

**Homepage Sections**
- Simplified hero with clear value proposition and trust badge
- Trust bar with 4.9 star rating, 100,000+ treatments, 100+ cities, Doctor-Owned & Directed, Celebrating 10 Years
- Symptom-based navigation ("What do you need help with?") linking to treatments
- Category cards for browsing Vitamin & Wellness IVs and NAD+ Therapy
- How It Works 4-step visual section (Choose, Book, Relax, Feel Better)
- Client testimonials with star ratings
- Membership upsell card with savings info
- FAQ accordion section with common questions
- Footer with trust/safety badges, contact info, certifications

**Treatment Card CRO Enhancements**
- "Best For" colored badges (amber/green/blue/etc.) mapping treatments to use cases
- Dual pricing display: one-time price + member price with savings badge
- Star ratings with review counts on every treatment card
- Centralized treatment-data.ts module for ingredients, reviews, member pricing, add-ons

**Treatment Detail Enhancements**
- Ingredient tags/badges showing IV contents
- Mini "How It Works" section
- FAQ accordion for treatment-specific questions
- "Customers Also Booked" related treatments section with member pricing
- Sticky CTA with dynamic price (includes add-ons)
- Star ratings with review counts
- Evidence-based positioning card (100% bioavailability, physician-formulated)
- Add-ons section: selectable vitamin boosts (+$20-35 each) with dynamic total
- Treatment-specific customer reviews (3 per treatment with name, city, rating)
- Membership upsell card with savings calculation
- Treatment trust bar (painless treatment, nurse monitors vitals, session length)

**Checkout CRO Enhancements**
- Full membership upsell card: side-by-side price comparison (single vs member), savings breakdown, benefit bullets
- Dismiss/restore behavior: "No thanks" hides card, shows mini reminder to re-expand
- "Switch to Membership" applies member pricing at checkout with visual confirmation
- Checkout trust bar: 256-bit SSL, Licensed Nurses, 4.9 stars
- Price updates dynamically when membership is applied

**Confirmation Page Upsells**
- Membership upsell card with plans link
- Group booking upsell card
- Refer-a-friend card ($25 give/$25 get)

**Group Booking**
- Dedicated group booking page at /group-booking
- Group size selector with tiered discounts (10-20% off)
- Event type selector (bachelorette, corporate, sports team, etc.)
- Inquiry form with contact details, city, date, guest count
- Trust signals and group-specific messaging
- Footer link to group booking page

**User Experience Features**
- Bottom tab bar navigation on mobile (Home, Treatments, Book, Membership, Account)
- Tab bar hidden during booking flow and confirmation page
- Sticky bottom CTA bar on all non-booking pages
- Step indicator component for booking progress visualization
- Form validation at each step with error feedback
- Session-based state preservation across booking steps
- Responsive layout adapting to mobile and desktop viewports
- Scroll-to-top on all page navigations

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