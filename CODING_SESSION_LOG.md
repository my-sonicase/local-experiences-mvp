# Coding Session Log — Popli MVP

**Date:** 7 March 2026
**Agent:** Claude Sonnet 4.6 (Claude Code)
**Duration:** Single session
**Outcome:** Full MVP built, production build passing ✓

---

## Initial Prompt

> I want to build an MVP for a startup idea.
>
> The product is a marketplace that helps small local businesses book live experiences.
>
> **Initial wedge:** musicians who can perform at small venues such as cafes, wine bars, gelato shops, boutiques, hotels, and coworking spaces.
>
> **Future expansion:** the platform should later support other types of creators such as influencers, popup chefs, photographers, workshop hosts, and other local talent.
>
> **Important product idea:** Small businesses want to host experiences that bring customers into their space, and local creators want paid opportunities. The platform connects the two.
>
> Requirements:
> - Two user types: businesses and talent
> - Businesses can create profiles and post an event request
> - Talent can create profiles with category, location, rates, and media
> - Talent can browse and apply to event requests
> - Businesses can review applicants and shortlist them
>
> Technical requirements: React frontend, Supabase for auth and database, clean relational schema, database must be designed around "talent categories" so it can support more than just musicians later, seed demo data so the product can be demonstrated easily.
>
> Tasks: propose a development plan, design the database schema, explain the main user flows, build a simple MVP, generate seed data, write a README, produce a SESSION_REPORT.md.

---

## Phase 1 — Initial Plan

The agent entered plan mode and explored the (empty) project directory before producing a plan covering:

- **File structure**: `src/lib/`, `src/context/`, `src/components/`, `src/pages/`, `supabase/`
- **Database schema**: 6 tables — `talent_categories`, `profiles`, `talent_profiles`, `business_profiles`, `event_requests`, `applications`
- **User flows**: business (post → receive applications → shortlist) and talent (browse → apply → track status)
- **Build order**: auth → profiles → event marketplace → application flow → talent directory → landing
- **Seed data**: 3 categories (Musician, Popup Chef, Photographer), 10 users, 6 events, 10 applications

---

## Phase 2 — Plan Iteration: Adding Influencers

Before implementation began, the founder requested changes:

> Please revise the plan. I want the MVP to stay focused on musicians as the initial wedge, but the product architecture and demo data should explicitly support future expansion to influencers and popups, which are more important to the vision than photographers.
>
> Changes:
> 1. Describe this as a marketplace for local business experiences, starting with musicians
> 2. Categories: Musician, Influencer, Popup Chef, Workshop Host — remove Photographer
> 3. Make sure the schema and naming stay generic enough to support all creator/talent categories
> 4. In SESSION_REPORT.md, explicitly explain why the system can expand from musicians to influencers and popups without changing the core data model
> 5. Optimize the MVP for a founder demo
> 6. Keep UI polish low priority. No payments or advanced messaging.
>
> Also: briefly explain whether any schema changes are needed to better support influencers and popups.

**Agent's schema analysis (before any code was written):**

No breaking changes needed. The existing design handles all four categories cleanly:

- `talent_categories` is a lookup table — adding Influencer, Popup Chef, Workshop Host is one SQL `INSERT` each, zero migrations
- `talent_profiles.media_urls` (text array) works for all categories: SoundCloud for musicians, Instagram/TikTok handles for influencers, portfolio sites for chefs
- `talent_profiles.hourly_rate` (numeric) stores any rate regardless of unit — the bio field carries the context ("per post", "per event", "per hour")
- `event_requests.category_id` lets businesses target any talent type precisely

**Optional future enhancement (noted but not implemented):** a `metadata JSONB` column on `talent_profiles` for category-specific structured fields (influencer follower count, chef cuisine type and max guest count).

The plan was updated with:
- 4 categories: Musician 🎵, Influencer 📱, Popup Chef 👨‍🍳, Workshop Host 🎨
- 12 demo users (8 talent × 2 per category, 4 businesses)
- 8 events covering all four categories
- 11 applications with realistic messages and mixed statuses

---

## Phase 3 — Implementation

### Environment Setup

Node.js was not installed. Installed via Homebrew (`brew install node`, v25.8.0), then added to `~/.zshrc`.

```bash
npm create vite@latest . -- --template react
npm install @supabase/supabase-js react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

Note: Tailwind v4 uses `@tailwindcss/vite` (not the postcss plugin) and `@import "tailwindcss"` in CSS — no `tailwind.config.js` needed.

### Files Created

**Foundation**
- `src/lib/supabase.js` — `createClient` singleton
- `src/lib/constants.js` — `USER_TYPE`, `EVENT_STATUS`, `APPLICATION_STATUS`, `BUSINESS_TYPES`
- `vite.config.js` — Tailwind v4 + React plugin

**Auth & Context**
- `src/context/AuthContext.jsx` — session, profiles, talentProfile/businessProfile, loading, signOut, refreshProfile
- `src/components/layout/ProtectedRoute.jsx` — redirects unauthenticated users; optional `requiredUserType` prop

**Layout**
- `src/components/layout/Navbar.jsx` — auth-aware links (3 states: logged out, business, talent)
- `src/components/layout/Footer.jsx`

**UI Primitives**
- `Button` (primary / secondary / ghost / danger variants)
- `Badge` (open / closed / pending / shortlisted / rejected colour variants)
- `Card`, `Input`, `Select`, `Textarea`

**Event Components**
- `EventCard` — grid card with category, business name, date, budget, location
- `EventFilters` — category select + location text filter
- `ApplicationCard` — dual-mode: business view (shortlist/reject actions) and talent view (status display)

**Talent Components**
- `TalentCard` — grid card with category, availability badge, rate, bio excerpt

**Pages (10 total)**

| Route | Page | Notes |
|-------|------|-------|
| `/` | `Landing` | Hero, two-column value props, category pills |
| `/login` | `Login` | Email + password |
| `/signup` | `Signup` | Step 1: choose type; Step 2: credentials |
| `/profile/setup` | `ProfileSetup` | Different fields for business vs talent |
| `/dashboard` | `Dashboard` | Different content for business vs talent |
| `/events` | `EventsList` | Filterable grid of open events |
| `/events/new` | `NewEvent` | Business-only (protected route) |
| `/events/:id` | `EventDetail` | Bifurcated: apply form (talent) or applicant list (business) |
| `/talent` | `TalentDirectory` | Filterable grid with availability toggle |
| `/talent/:id` | `TalentProfile` | Full profile with media link chips |

**Supabase SQL**
- `supabase/schema.sql` — full DDL, triggers, RLS policies
- `supabase/seed.sql` — 4 categories, 12 auth users, 12 profile rows, 8 talent/business profiles, 8 events, 11 applications

**Docs**
- `README.md` — setup instructions, demo accounts table, demo flow walkthrough
- `SESSION_REPORT.md` — architecture decisions, extensibility explanation, build rationale
- `.env.local.example` — env var template

### Build Result

```
✓ 105 modules transformed
dist/assets/index.css   18.97 kB │ gzip: 4.51 kB
dist/assets/index.js   449.56 kB │ gzip: 128.56 kB
✓ built in 542ms
```

Zero errors. Zero warnings.

---

## Key Architecture Decisions

### `talent_categories` as the extensibility spine

The single most important decision. All marketplace flows — event posting, talent browsing, filtering, applying — are category-agnostic. They query `talent_categories` dynamically at runtime. Expanding from musicians to influencers to popup chefs requires one SQL `INSERT` per new category and zero code changes.

### Thin `profiles` + type-specific tables

`profiles` is a minimal identity row (id, user_type, full_name). Richer data lives in `talent_profiles` and `business_profiles`. Adding a new user type in the future means adding a new table — no migrations to existing tables.

### Single `AuthContext` for all auth + profile state

Loads session → profiles row → type-specific profile on mount. Every page reads from `useAuth()`. The `loading` flag prevents flash-of-wrong-content. No component re-fetches identity data.

### Supabase RLS replaces a backend

Row Level Security enforces all access control at the database level:
- Open events are publicly readable (no login required to browse)
- Writes are restricted to record owners
- Businesses can only update application statuses for their own events
- The unique constraint on `(event_request_id, talent_id)` prevents duplicate applications at the DB level

### No backend, no email verification, no payments

The right trade-offs for a founder demo. The entire stack is: React → Supabase client SDK → PostgreSQL. Deploy is a static build to Vercel or Netlify with two environment variables.

---

## Demo Accounts

All passwords: **`password123`**

| Email | Role | Category / Type |
|-------|------|-----------------|
| theroastery@demo.com | Business | Cafe, Paddington Sydney |
| cellar@demo.com | Business | Wine Bar, East Melbourne |
| thegrand@demo.com | Business | Boutique Hotel, Fitzroy Melbourne |
| nodework@demo.com | Business | Coworking Space, Surry Hills Sydney |
| maya@demo.com | Talent | Musician — acoustic guitar/vocals |
| luca@demo.com | Talent | Musician — jazz piano |
| zara@demo.com | Talent | Influencer — 42k IG, Sydney |
| mia@demo.com | Talent | Influencer — 28k TikTok, Melbourne |
| sofia@demo.com | Talent | Popup Chef — Vietnamese-Australian |
| james@demo.com | Talent | Popup Chef — Korean BBQ |
| priya@demo.com | Talent | Workshop Host — ceramics |
| dan@demo.com | Talent | Workshop Host — cocktail masterclasses |

---

## To Run

```bash
# 1. Create Supabase project at supabase.com
# 2. Run supabase/schema.sql in SQL editor
# 3. Run supabase/seed.sql in SQL editor
# 4. Add credentials to .env.local
cp .env.local.example .env.local

npm install
npm run dev
# → http://localhost:5173
```
