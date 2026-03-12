-- ============================================================
-- LOCAL EXPERIENCES MVP — DATABASE SCHEMA
-- Run this in the Supabase SQL editor before running seed.sql
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- LOOKUP TABLE: talent_categories
-- The extensibility spine of the platform.
-- Adding a new talent type (e.g. DJ, Yoga Teacher) = one INSERT.
-- No schema changes needed.
-- ============================================================
create table public.talent_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  icon        text,
  description text,
  created_at  timestamptz default now()
);

-- ============================================================
-- PROFILES (extends auth.users 1:1)
-- Thin identity row. Type-specific data lives in separate tables.
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  user_type   text not null check (user_type in ('business', 'talent')),
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- TALENT PROFILES
-- ============================================================
create table public.talent_profiles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null unique references public.profiles(id) on delete cascade,
  category_id   uuid not null references public.talent_categories(id),
  bio           text,
  location      text,
  hourly_rate   numeric(10,2),
  media_urls    text[],
  is_available  boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- BUSINESS PROFILES
-- ============================================================
create table public.business_profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null unique references public.profiles(id) on delete cascade,
  business_name   text not null,
  business_type   text,
  location        text,
  description     text,
  logo_url        text,
  website_url     text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- EVENT REQUESTS (posted by businesses)
-- ============================================================
create table public.event_requests (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references public.profiles(id) on delete cascade,
  category_id     uuid not null references public.talent_categories(id),
  title           text not null,
  description     text,
  event_date      date not null,
  start_time      time,
  duration_hours  numeric(4,1),
  budget_min      numeric(10,2),
  budget_max      numeric(10,2),
  location        text,
  status          text not null default 'open'
                    check (status in ('open', 'closed', 'cancelled')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- APPLICATIONS (talent applying to event requests)
-- ============================================================
create table public.applications (
  id                uuid primary key default uuid_generate_v4(),
  event_request_id  uuid not null references public.event_requests(id) on delete cascade,
  talent_id         uuid not null references public.profiles(id) on delete cascade,
  message           text,
  proposed_rate     numeric(10,2),
  status            text not null default 'pending'
                      check (status in ('pending', 'shortlisted', 'rejected')),
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique (event_request_id, talent_id)
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger talent_profiles_updated_at
  before update on public.talent_profiles
  for each row execute procedure public.handle_updated_at();

create trigger business_profiles_updated_at
  before update on public.business_profiles
  for each row execute procedure public.handle_updated_at();

create trigger event_requests_updated_at
  before update on public.event_requests
  for each row execute procedure public.handle_updated_at();

create trigger applications_updated_at
  before update on public.applications
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE profile row on auth signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, user_type, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_type', 'talent'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles           enable row level security;
alter table public.talent_categories  enable row level security;
alter table public.talent_profiles    enable row level security;
alter table public.business_profiles  enable row level security;
alter table public.event_requests     enable row level security;
alter table public.applications       enable row level security;

-- talent_categories: public read only
create policy "Anyone can read categories"
  on public.talent_categories for select using (true);

-- profiles: public read, own update
create policy "Anyone can read profiles"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- talent_profiles: public read, own insert/update
create policy "Anyone can read talent profiles"
  on public.talent_profiles for select using (true);

create policy "Talent can insert own profile"
  on public.talent_profiles for insert
  with check (auth.uid() = user_id);

create policy "Talent can update own profile"
  on public.talent_profiles for update using (auth.uid() = user_id);

-- business_profiles: public read, own insert/update
create policy "Anyone can read business profiles"
  on public.business_profiles for select using (true);

create policy "Business can insert own profile"
  on public.business_profiles for insert
  with check (auth.uid() = user_id);

create policy "Business can update own profile"
  on public.business_profiles for update using (auth.uid() = user_id);

-- event_requests: open events + own events are readable; own insert/update
create policy "Anyone can read open event requests"
  on public.event_requests for select using (
    status = 'open' or auth.uid() = business_id
  );

create policy "Business can create event requests"
  on public.event_requests for insert
  with check (auth.uid() = business_id);

create policy "Business can update own event requests"
  on public.event_requests for update using (auth.uid() = business_id);

-- applications: talent sees own; business sees apps for their events
create policy "Talent can see own applications"
  on public.applications for select
  using (auth.uid() = talent_id);

create policy "Business can see applications for their events"
  on public.applications for select
  using (
    exists (
      select 1 from public.event_requests e
      where e.id = applications.event_request_id
        and e.business_id = auth.uid()
    )
  );

create policy "Talent can submit applications"
  on public.applications for insert
  with check (auth.uid() = talent_id);

create policy "Business can update application status"
  on public.applications for update
  using (
    exists (
      select 1 from public.event_requests e
      where e.id = applications.event_request_id
        and e.business_id = auth.uid()
    )
  );
