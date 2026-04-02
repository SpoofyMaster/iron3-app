-- XP Overhaul + PREP verifications — run in Supabase SQL editor after base schema.
-- Safe to run once; uses IF NOT EXISTS where supported.

-- Activities: watch verification + compliance bonus
alter table public.activities add column if not exists prep_verified boolean default false;
alter table public.activities add column if not exists compliance_bonus integer default 0;

-- PREP session ↔ watch activity correlation
create table if not exists public.prep_session_verifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prep_week_number integer not null,
  session_day text not null,
  session_discipline text not null,
  planned_duration integer not null,
  actual_activity_id uuid references public.activities(id) on delete set null,
  correlation_score numeric not null default 0,
  match_type text not null default 'none'
    check (match_type in ('exact_match', 'partial_match', 'no_match')),
  xp_bonus_applied integer not null default 0,
  verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(user_id, prep_week_number, session_day)
);

create index if not exists idx_prep_verifications_user_week
  on public.prep_session_verifications(user_id, prep_week_number);

alter table public.prep_session_verifications enable row level security;

create policy "Users can view own prep verifications"
  on public.prep_session_verifications for select
  using (auth.uid() = user_id);

create policy "Users can insert own prep verifications"
  on public.prep_session_verifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own prep verifications"
  on public.prep_session_verifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own prep verifications"
  on public.prep_session_verifications for delete
  using (auth.uid() = user_id);
