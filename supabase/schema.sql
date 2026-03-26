-- Iron3 Triathlon App - Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS / PROFILES
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  avatar_url text,
  experience_level text not null default 'beginner'
    check (experience_level in ('beginner', 'intermediate', 'advanced', 'pro')),
  goals text[] default '{}',
  is_premium boolean not null default false,
  premium_expires_at timestamptz,
  weekly_goal integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ACTIVITIES
-- ============================================================

create table public.activities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  discipline text not null check (discipline in ('swim', 'bike', 'run')),
  title text not null default '',
  date timestamptz not null default now(),
  distance numeric not null check (distance > 0),  -- meters for swim, km for bike/run
  duration integer not null check (duration > 0),   -- seconds
  pace numeric not null,                             -- sec/100m for swim, sec/km for bike/run
  points_earned integer not null default 0,
  distance_bonus integer not null default 0,
  pace_bonus integer not null default 0,
  source text default 'manual',
  external_id text,
  created_at timestamptz not null default now()
);

create index idx_activities_user_id on public.activities(user_id);
create index idx_activities_discipline on public.activities(user_id, discipline);
create index idx_activities_date on public.activities(user_id, date desc);

alter table public.activities enable row level security;

create policy "Users can view their own activities"
  on public.activities for select using (auth.uid() = user_id);

create policy "Users can insert their own activities"
  on public.activities for insert with check (auth.uid() = user_id);

create policy "Users can update their own activities"
  on public.activities for update using (auth.uid() = user_id);

create policy "Users can delete their own activities"
  on public.activities for delete using (auth.uid() = user_id);

-- ============================================================
-- RANK POINTS (materialized per discipline)
-- ============================================================

create table public.rank_points (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  discipline text not null check (discipline in ('swim', 'bike', 'run')),
  total_points integer not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, discipline)
);

create index idx_rank_points_user on public.rank_points(user_id);
create index idx_rank_points_leaderboard on public.rank_points(discipline, total_points desc);

alter table public.rank_points enable row level security;

create policy "Anyone can view rank points"
  on public.rank_points for select using (true);

create policy "System can manage rank points"
  on public.rank_points for all using (auth.uid() = user_id);

-- Trigger to update rank_points when an activity is inserted
create or replace function public.update_rank_points()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.rank_points (user_id, discipline, total_points, updated_at)
  values (new.user_id, new.discipline, new.points_earned, now())
  on conflict (user_id, discipline)
  do update set
    total_points = public.rank_points.total_points + new.points_earned,
    updated_at = now();
  return new;
end;
$$;

create trigger on_activity_created
  after insert on public.activities
  for each row execute function public.update_rank_points();

-- ============================================================
-- RANK HISTORY (monthly snapshots)
-- ============================================================

create table public.rank_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  snapshot_date date not null,
  swim_points integer not null default 0,
  bike_points integer not null default 0,
  run_points integer not null default 0,
  overall_points integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, snapshot_date)
);

create index idx_rank_history_user on public.rank_history(user_id, snapshot_date desc);

alter table public.rank_history enable row level security;

create policy "Users can view their own rank history"
  on public.rank_history for select using (auth.uid() = user_id);

-- ============================================================
-- PERSONAL BESTS
-- ============================================================

create table public.personal_bests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  discipline text not null check (discipline in ('swim', 'bike', 'run')),
  category text not null,         -- e.g., '5km', '100m', 'Half Marathon'
  value numeric not null,          -- seconds for time-based
  unit text not null default 'sec',
  activity_id uuid references public.activities(id),
  achieved_at date not null,
  created_at timestamptz not null default now(),
  unique(user_id, discipline, category)
);

alter table public.personal_bests enable row level security;

create policy "Users can view their own personal bests"
  on public.personal_bests for select using (auth.uid() = user_id);

create policy "System can manage personal bests"
  on public.personal_bests for all using (auth.uid() = user_id);

-- ============================================================
-- FRIENDSHIPS
-- ============================================================

create table public.friendships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  unique(user_id, friend_id)
);

create index idx_friendships_user on public.friendships(user_id, status);
create index idx_friendships_friend on public.friendships(friend_id, status);

alter table public.friendships enable row level security;

create policy "Users can view their friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can create friendships"
  on public.friendships for insert with check (auth.uid() = user_id);

create policy "Users can update their friendships"
  on public.friendships for update
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- ============================================================
-- CHALLENGES
-- ============================================================

create table public.challenges (
  id uuid primary key default uuid_generate_v4(),
  challenger_id uuid not null references public.profiles(id) on delete cascade,
  challenged_id uuid not null references public.profiles(id) on delete cascade,
  discipline text not null check (discipline in ('swim', 'bike', 'run')),
  target_distance numeric,
  target_duration integer,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'completed', 'cancelled')),
  winner_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "Users can view their challenges"
  on public.challenges for select
  using (auth.uid() = challenger_id or auth.uid() = challenged_id);

create policy "Users can create challenges"
  on public.challenges for insert with check (auth.uid() = challenger_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null,
  status text not null default 'active'
    check (status in ('active', 'cancelled', 'expired', 'trial')),
  platform text not null check (platform in ('ios', 'android', 'web')),
  store_transaction_id text,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_subscriptions_user on public.subscriptions(user_id, status);

alter table public.subscriptions enable row level security;

create policy "Users can view their subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- LEADERBOARD VIEW
-- ============================================================

create or replace view public.leaderboard_overall as
select
  p.id as user_id,
  p.display_name,
  p.avatar_url,
  coalesce(
    (select total_points from public.rank_points where user_id = p.id and discipline = 'swim'), 0
  ) * 0.3 +
  coalesce(
    (select total_points from public.rank_points where user_id = p.id and discipline = 'bike'), 0
  ) * 0.4 +
  coalesce(
    (select total_points from public.rank_points where user_id = p.id and discipline = 'run'), 0
  ) * 0.3 as overall_points,
  row_number() over (
    order by (
      coalesce((select total_points from public.rank_points where user_id = p.id and discipline = 'swim'), 0) * 0.3 +
      coalesce((select total_points from public.rank_points where user_id = p.id and discipline = 'bike'), 0) * 0.4 +
      coalesce((select total_points from public.rank_points where user_id = p.id and discipline = 'run'), 0) * 0.3
    ) desc
  ) as rank
from public.profiles p;

create or replace view public.leaderboard_by_discipline as
select
  rp.user_id,
  p.display_name,
  p.avatar_url,
  rp.discipline,
  rp.total_points,
  row_number() over (
    partition by rp.discipline
    order by rp.total_points desc
  ) as rank
from public.rank_points rp
join public.profiles p on p.id = rp.user_id;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Recalculate overall points for a user
create or replace function public.get_overall_points(p_user_id uuid)
returns integer
language sql
stable
as $$
  select floor(
    coalesce((select total_points from public.rank_points where user_id = p_user_id and discipline = 'swim'), 0) * 0.3 +
    coalesce((select total_points from public.rank_points where user_id = p_user_id and discipline = 'bike'), 0) * 0.4 +
    coalesce((select total_points from public.rank_points where user_id = p_user_id and discipline = 'run'), 0) * 0.3
  )::integer;
$$;

-- Monthly rank snapshot cron (call via pg_cron or edge function)
create or replace function public.snapshot_ranks()
returns void
language plpgsql
security definer
as $$
declare
  v_date date := date_trunc('month', current_date)::date;
begin
  insert into public.rank_history (user_id, snapshot_date, swim_points, bike_points, run_points, overall_points)
  select
    p.id,
    v_date,
    coalesce((select total_points from public.rank_points where user_id = p.id and discipline = 'swim'), 0),
    coalesce((select total_points from public.rank_points where user_id = p.id and discipline = 'bike'), 0),
    coalesce((select total_points from public.rank_points where user_id = p.id and discipline = 'run'), 0),
    public.get_overall_points(p.id)
  from public.profiles p
  on conflict (user_id, snapshot_date) do update set
    swim_points = excluded.swim_points,
    bike_points = excluded.bike_points,
    run_points = excluded.run_points,
    overall_points = excluded.overall_points;
end;
$$;
