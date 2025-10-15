# Drip Hydration Design Guidelines

## Brand Identity
This design system matches the official Drip Hydration website (driphydration.com) - a premium, professional IV therapy and mobile wellness brand.

## Color Palette

### Light Mode (Primary Theme)
- **Primary Teal:** 174 100% 36% (Main brand color #00B8B0 for buttons, links, CTAs)
- **Primary Hover:** 174 100% 30% (Darker teal #009B94)
- **Background:** 0 0% 100% (White)
- **Card Background:** 0 0% 98% (Subtle off-white #FAFAFA)
- **Text Primary:** 0 0% 10% (Near-black #1A1A1A)
- **Text Secondary:** 210 12% 35% (Medium gray #4A5568)
- **Text Muted:** 210 12% 50% (Light gray #718096)
- **Border:** 210 20% 90% (Subtle #E5E7EB)
- **Border Muted:** 210 20% 95% (Very subtle #F3F4F6)
- **Success:** 150 60% 45% (#10B981)
- **Warning:** 38 92% 50% (#F59E0B)
- **Error:** 0 72% 51% (#EF4444)

### Dark Mode
Not implemented - Drip Hydration uses clean white theme exclusively for medical trust and clarity.

## Typography

**Font Stack:**
- **Primary Font:** 'Inter' (sans-serif) - Clean, medical-grade readability for all text
- No accent fonts - consistency and clarity prioritized

**Type Scale:**
- **Hero Heading:** text-5xl md:text-6xl font-bold (48-64px)
- **Page Heading (H1):** text-4xl md:text-5xl font-bold (36-48px)
- **Section Heading (H2):** text-3xl md:text-4xl font-semibold (30-36px)
- **Subsection (H3):** text-2xl font-semibold (24-28px)
- **Card Title:** text-xl font-semibold (20-24px)
- **Body Text:** text-base leading-relaxed (16px)
- **Small Text:** text-sm (14px)
- **Tiny Text:** text-xs (12px)

## Component Library

### Buttons
**Primary Button** (Main CTAs like "BOOK NOW"):
- Background: Primary Teal (#00B8B0)
- Text: White, font-weight 600, UPPERCASE
- Height: h-12 minimum
- Padding: px-8 py-3
- Border Radius: rounded-lg (8px)
- Hover: Darker teal with subtle shadow
- Active: Slightly darker

**Secondary Button**:
- Background: White
- Border: 2px solid Primary Teal
- Text: Primary Teal, font-weight 600, UPPERCASE
- Same sizing as primary

**Ghost Button**:
- Background: Transparent
- Text: Primary Text
- Hover: Light gray background

### Treatment Cards
**Card Structure** (Matches Drip Hydration):
1. **Product Image:** Full-width at top, IV bag image, aspect ratio 4:3
2. **Badge:** "MOST POPULAR" or "NEW" - teal background, white text, top-right corner
3. **Treatment Name:** text-xl font-semibold, primary text color
4. **Price:** text-2xl font-bold, primary teal color
5. **Description:** text-sm, muted text, 2-3 lines
6. **Ingredients List:** Bullet points with vitamin/ingredient names, text-sm
7. **Tagline:** text-sm italic, muted ("Rejuvenate & Restore", "Defend & Supercharge")
8. **CTA Button:** Primary button "BOOK NOW", full-width

**Card Styling:**
- Background: White
- Border: 1px solid border color
- Border Radius: rounded-xl (12px)
- Padding: p-0 (image full-width), p-6 for content
- Shadow: shadow-sm, hover:shadow-lg transition
- Hover: Subtle lift animation

### Navigation Header
- **Background:** White with subtle shadow (shadow-sm)
- **Logo:** "Drip Hydration" text, primary teal, text-2xl font-bold
- **Nav Links:** text-base, primary text, hover:text-primary-teal
- **Mobile:** Hamburger menu, teal color, full-screen overlay
- **Height:** h-16 minimum

### Layout & Spacing
- **Max Width:** max-w-7xl (1280px) for main content
- **Container Padding:** px-4 md:px-6 lg:px-8
- **Section Spacing:** py-16 md:py-20 lg:py-24 between major sections
- **Card Grid:** Grid cols-1 md:cols-2 lg:cols-3 gap-6

**Treatment Grid:**
- 1 column: Mobile (< 768px)
- 2 columns: Tablet (768-1024px)
- 3 columns: Desktop (> 1024px)

### Step Indicator (Booking Flow)
- **Progress Bar:** Horizontal with 3 steps
- **Steps:** Location → Schedule → Payment
- **Active Step:** Primary teal color, font-bold
- **Completed:** Success green with checkmark
- **Upcoming:** Gray muted
- **Mobile:** Show step number and name
- **Desktop:** Show all step names

### Form Inputs
- **Height:** h-12 consistent
- **Border Radius:** rounded-lg
- **Border:** 2px border, focus:ring-2 ring-primary
- **Labels:** Block, font-medium, text-sm, mb-2
- **Error States:** Red border with error message below

### Images & Visual Style
**Product Images (IV Bags):**
- Clean, professional photography
- White or very light backgrounds
- Consistent lighting
- Show IV bag clearly with branding

**Hero Images:**
- Professional medical setting
- Clean, bright, modern environments
- Warm and welcoming but professional
- 16:9 aspect ratio on desktop, 4:3 mobile

## Design Principles

### Clean & Professional
- Generous white space for clarity
- Clear visual hierarchy
- Medical-grade professionalism
- Approachable wellness aesthetic

### Conversion-Focused
- Clear, prominent CTAs ("BOOK NOW" buttons)
- Pricing displayed prominently on all treatment cards
- Trust indicators (patient count, reviews, certifications)
- Social proof (media logos: Yahoo, ABC, Vice, Rolling Stone, CNN)

### Mobile-First
- Touch-friendly button sizes (minimum 44px height)
- Readable text sizes on all devices
- Optimized images for fast loading
- Bottom-aligned primary CTAs for thumb accessibility

## Badges & Labels
- **MOST POPULAR:** Teal background, white text, rounded-full, text-xs uppercase, px-3 py-1
- **NEW:** Similar styling to MOST POPULAR
- **Position:** Absolute top-right corner of treatment card images

## Animations
**Subtle & Professional:**
- Card hover: Subtle shadow increase (duration-200)
- Button hover: Slight brightness increase
- Form focus: Ring animation
- Avoid: Complex animations that distract from medical professionalism

## Accessibility
- WCAG AA contrast ratios maintained
- Focus indicators for keyboard navigation
- Alt text for all images
- Loading states with skeletons
- Clear error messages
