# Session Report — Popli MVP

## What Was Built

A full-stack marketplace MVP connecting small local businesses with local talent. Built with React (Vite), Supabase (auth + PostgreSQL), and Tailwind CSS.

**Scope:** 10 pages, 15+ components, complete Supabase schema with RLS, seed data with 12 users / 4 categories / 8 events / 11 applications.

---

## Architecture Decisions

### 1. Single AuthContext as the source of truth

Every page needs to know: is the user logged in? Are they a business or talent? What does their profile look like? Rather than fetching this in every component, `AuthContext` loads the full profile tree on mount (session → profiles row → business_profiles or talent_profiles) and exposes it via `useAuth()`.

This means pages never re-fetch identity data, and the `loading` flag prevents flash-of-wrong-content between auth states.

### 2. Thin `profiles` table + type-specific tables

`profiles` is a minimal identity row (id, user_type, full_name). Type-specific data lives in `talent_profiles` and `business_profiles`. This means:

- Adding a new user type (e.g. `influencer_agency`) = one new table. No changes to `profiles`.
- The auth trigger (`handle_new_user`) populates `profiles` automatically on signup — no race conditions.
- RLS policies on `profiles` are simple (public read, own update) and don't need to know about talent vs business distinctions.

### 3. `talent_categories` as the extensibility spine

This is the single most important architectural decision for the platform's future.

The initial product is built around musicians. But the platform's ambition is to support influencers, popup chefs, workshop hosts, yoga teachers, and other local talent. If categories were hardcoded (e.g. an enum in the schema), adding a new type would require a schema migration, code changes in every filter/form, and redeployment.

Instead, `talent_categories` is a lookup table. All marketplace flows — browsing events, filtering talent, posting requests, applying — query the categories table dynamically. Adding "DJ" or "Yoga Teacher" to the platform is:

```sql
insert into public.talent_categories (name, slug, icon, description) values
  ('DJ', 'dj', '🎧', 'DJs for events, parties, and venue nights');
```

That's it. No code changes. The filter dropdowns, profile setup form, and event request form all populate from this table at runtime.

### 4. No custom backend — Supabase as the entire data layer

The app uses the Supabase JavaScript client directly from the browser. RLS (Row Level Security) policies on every table enforce all data access rules:

- Talent can only see and edit their own profiles
- Businesses can only update their own event requests
- Only the business who owns an event can update application statuses
- Open events are publicly readable; a business's own events (regardless of status) are also readable to them

This eliminates the need for a backend API entirely, which is the right trade-off for an MVP: less surface area, fewer moving parts, faster iteration.

### 5. Why influencers and popup chefs need no schema changes

When the platform expands to influencers and popup chefs, the core schema requires zero changes:

- `talent_categories`: add one row per new category
- `talent_profiles.media_urls`: already a text array — stores Instagram/TikTok handles for influencers, just as it stores SoundCloud links for musicians
- `talent_profiles.hourly_rate`: a generic numeric field — an influencer's rate per post, a chef's per-event fee, or a musician's hourly rate all fit in the same column. The bio/description field provides the context ("rate per post", "per event", "per hour").
- `event_requests.category_id`: FK to talent_categories — already category-agnostic
- `applications`: entirely category-agnostic

**Optional future enhancement (not in MVP):** a `metadata JSONB` column on `talent_profiles` for category-specific structured data — e.g. influencer follower count per platform, chef's cuisine type and max guest count, or workshop host's list of workshop types. This would enable structured filtering ("show influencers with >10k Instagram followers") without requiring separate tables per category.

### 6. RLS policy design

The RLS design balances marketplace openness with data integrity:

- **Public reads on open events and all talent profiles**: The core marketplace experience (browsing) requires no login. This maximises top-of-funnel exposure.
- **Protected writes everywhere**: You can only write to records you own. The unique constraint on `(event_request_id, talent_id)` in `applications` prevents duplicate applications at the database level — no application-layer checks needed.
- **Business sees applicants, talent sees own applications**: Two separate SELECT policies on `applications` handle the bifurcated view. This is the most nuanced RLS in the schema.

---

## Development Steps

1. Node.js installed via Homebrew (not pre-installed)
2. Vite React project scaffolded in the existing git repo
3. `@supabase/supabase-js` and `react-router-dom` installed
4. Tailwind CSS v4 installed with `@tailwindcss/vite` plugin
5. Foundation built: `lib/supabase.js`, `lib/constants.js`, Tailwind config
6. `AuthContext.jsx` built as the auth + profile state manager
7. Layout components: `Navbar`, `Footer`, `ProtectedRoute`
8. UI primitives: `Button`, `Badge`, `Card`, `Input`, `Select`, `Textarea`
9. Auth pages: `Login`, `Signup` (two-step: choose type → enter credentials)
10. `ProfileSetup` — bifurcated form for business vs talent onboarding
11. `Dashboard` — bifurcated view showing events (business) or applications (talent)
12. Event marketplace: `EventsList`, `EventCard`, `EventFilters`, `NewEvent`
13. `EventDetail` — most complex page: bifurcated business/talent view, apply flow, shortlist flow
14. `ApplicationCard` — used in both business (shortlist actions) and talent (status view) contexts
15. Talent directory: `TalentDirectory`, `TalentCard`, `TalentProfile`
16. `Landing` page — hero, value props, category pills
17. `App.jsx` routing — React Router v6 with protected routes
18. `supabase/schema.sql` — full DDL, triggers, RLS
19. `supabase/seed.sql` — 4 categories, 12 users, 8 events, 11 applications
20. `README.md` and `SESSION_REPORT.md`

---

## Build Order Rationale

The build order was chosen to maximise demo readiness at each step:

1. **Auth before anything else** — nothing works without identity
2. **Business profile + event posting before talent flows** — the supply side (events) must exist before the demand side (applications) is meaningful
3. **EventDetail last among core pages** — it's the most complex (bifurcated views + apply/shortlist actions) and benefits from all the simpler components being built first
4. **Landing page last** — it's mostly static and links into everything else; it's more impressive to build it once the full product exists

---

## What Was Intentionally Excluded

- **Payments** — not needed for MVP; the platform's value is in the match, not the transaction
- **Messaging** — shortlisting + an application message is sufficient for founders to demo the workflow; direct messaging adds complexity
- **Email notifications** — Supabase Auth sends confirmation emails by default; disabled for demo by setting `email_confirmed_at = now()` in seed data
- **File uploads** — profile photos and media are stored as URLs; avoids Supabase Storage setup
- **Search** — the filter-by-category + location text filter is sufficient for MVP scale
