# Iron3 — XP Overhaul + Watch-Verified PREP Plan

## OVERVIEW

Two major changes to the Iron3 app:
1. **XP system rebalance** — Make progression harder, more meaningful, and level-dependent
2. **Watch-verified PREP plan** — Users earn XP ONLY from watch-synced activities (Garmin/Apple Watch), with smart correlation between planned PREP sessions and actual completed workouts

## PART 1: XP SYSTEM REBALANCE

### Current Problem
- Users can reach Bronze (1,000 XP) in a few days
- Points per workout don't decrease as rank increases
- Manual logging allows gaming the system — no verification
- No effort ceiling — everything could reach Legendary quickly

### New Rank Thresholds (harder progression)

| Rank | Min Points | Max Points | Time to reach (estimate) |
|------|-----------|-----------|------------------------|
| Iron | 0 | 2,999 | 0 (starting rank) |
| Bronze | 3,000 | 9,999 | ~1-2 months |
| Silver | 10,000 | 24,999 | ~3-5 months |
| Gold | 25,000 | 49,999 | ~6-10 months |
| Platinum | 50,000 | 99,999 | ~12-18 months |
| Diamond | 100,000 | 199,999 | ~2-3 years |
| Legendary | 200,000 | ∞ | ~3+ years |

### New XP Earning Rules

**Base XP per minute of activity (decreases by rank):**

| Rank | XP per minute |
|------|-------------|
| Iron | 3.0 |
| Bronze | 2.5 |
| Silver | 2.0 |
| Gold | 1.5 |
| Platinum | 1.0 |
| Diamond | 0.75 |
| Legendary | 0.5 |

**Distance bonus (also decreases by rank, multiplied by rank_factor):**
- `rank_factor`: Iron=1.0, Bronze=0.85, Silver=0.7, Gold=0.55, Platinum=0.4, Diamond=0.3, Legendary=0.2
- Swim: `distance_km * 20 * rank_factor`
- Bike: `distance_km * 2 * rank_factor`
- Run: `distance_km * 5 * rank_factor`

**Pace bonus remains the same** (already rewards effort)

**PREP plan compliance bonus (NEW):**
- Session matches plan exactly: +50% XP bonus
- Session matches plan discipline but differs in specifics: +25% XP bonus
- Session is off-plan but valid workout: no bonus

**Weekly consistency bonus (unchanged but tuned):**
- 3+ sessions/week: +30 XP (was 50)
- 7-day streak: +15/day (was 20)
- All 3 disciplines in a week: +80 XP (was 100)

### Key Point: NO MANUAL XP
- Remove ALL manual workout logging for XP purposes
- Users can still manually log for personal tracking, but **0 XP** from manual entries
- XP ONLY comes from watch-synced activities (Apple HealthKit or Garmin Connect)
- Display clear messaging: "Connect your watch to earn XP"

### Files to modify:
- `lib/ranks.ts` — New thresholds, rank_factor system, Legendary tier
- `lib/healthKit.ts` → `calculatePoints()` — Apply rank_factor
- `lib/healthSync.ts` — Add PREP compliance check before XP calculation
- `types/index.ts` — Add "Legendary" to RankTier type
- `theme/index.ts` — Add Legendary color
- `components/RankBadge.tsx` — Support Legendary
- `components/TriRankDisplay.tsx` — Support Legendary

## PART 2: WATCH-VERIFIED PREP PLAN

### How It Works

The PREP plan already generates weekly sessions (swim/bike/run with type, duration, notes). The new system:

1. **User follows their PREP plan** (created by app or custom)
2. **User completes a workout wearing their watch** (Garmin or Apple Watch)
3. **Watch syncs activity data to the app** (via HealthKit or Garmin API)
4. **App intelligently correlates** the incoming workout with today's planned session
5. **If it matches** → ✅ mark on the PREP plan + full XP with compliance bonus
6. **If it doesn't match** → placed in "Recent Activities" + base XP (no compliance bonus)

### Smart Correlation Engine

New file: `lib/prepCorrelation.ts`

The correlation must check:
1. **Date match**: Was the workout done on the day the session was planned?
2. **Discipline match**: Does the workout discipline match the planned discipline? (swim↔swim, bike↔bike, run↔run, brick→check both)
3. **Duration tolerance**: Is the workout duration within ±30% of planned duration?
4. **Type correlation** (smart, AI-assisted if needed):
   - If plan says "Threshold swim: 4-6 x 200m at CSS pace" → check if swim workout duration is ~16-20min
   - If plan says "Long ride: 2h easy" → check if bike workout is ~90-150min
   - If plan says "Brick: 45min bike + 15min run" → check if there's a bike AND run activity close together

**Correlation confidence levels:**
- `exact_match` (95%+): discipline, date, duration all match → ✅ + 50% XP bonus
- `partial_match` (60-94%): discipline and date match, duration off → ✅ + 25% XP bonus
- `no_match` (<60%): different discipline or wrong day → goes to "Recent Activities", base XP only

### PREP Plan UI Updates

#### Home Screen (Welcome Page)
Currently shows the PREP plan sessions. New behavior:

Each session row shows:
- ✅ Green checkmark → Session completed and verified by watch
- 🔄 Orange indicator → Watch data detected but doesn't match plan
- ⬜ Grey empty → Session not yet completed
- ⏭️ Skip indicator → Rest day or intentionally skipped

When a session is ✅ verified, show:
- Actual duration vs planned duration
- XP earned (including compliance bonus)
- Source: "Apple Watch" or "Garmin"

#### Recent Activities Section
Below the PREP plan, show:
- Activities synced from watch that **didn't match** the plan
- These still earn base XP but no compliance bonus
- Show discipline, duration, distance, XP earned

### Watch Integration Improvements

#### Apple Watch (HealthKit) — `lib/healthKit.ts`
Already implemented and working. Needs:
- Auto-sync: poll for new workouts every time app opens + every 15 min in background
- Better activity type mapping for triathlon-specific workouts

#### Garmin Connect — `lib/garmin.ts`
Currently a stub. Needs real implementation:
- Garmin Connect IQ API integration
- OAuth2 flow for Garmin Connect
- Webhook or polling for new activities
- Map Garmin activity types to swim/bike/run

**For V1**: Focus on Apple Watch (HealthKit) since it's already working.
**Garmin**: Keep as a "Coming Soon" option in settings with a waitlist.

### Database Changes (Supabase)

New table: `prep_session_verifications`
```sql
create table public.prep_session_verifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prep_week_number integer not null,
  session_day text not null, -- 'Mon', 'Tue', etc.
  session_discipline text not null,
  planned_duration integer not null, -- seconds
  actual_activity_id uuid references public.activities(id),
  correlation_score numeric not null default 0, -- 0.0 to 1.0
  match_type text not null default 'none' 
    check (match_type in ('exact_match', 'partial_match', 'no_match')),
  xp_bonus_applied integer not null default 0,
  verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(user_id, prep_week_number, session_day)
);
```

Add column to activities table:
```sql
alter table public.activities add column prep_verified boolean default false;
alter table public.activities add column compliance_bonus integer default 0;
```

### Files to Create/Modify

**New files:**
- `lib/prepCorrelation.ts` — Smart correlation engine
- `components/PrepSessionStatus.tsx` — ✅/🔄/⬜ status component
- `components/RecentActivities.tsx` — Non-plan activities display

**Modified files:**
- `lib/ranks.ts` — New thresholds + rank_factor + Legendary
- `lib/healthKit.ts` — Updated calculatePoints with rank_factor
- `lib/healthSync.ts` — Add correlation check, auto-sync logic
- `lib/garmin.ts` — "Coming Soon" UI stub (not full implementation)
- `app/(tabs)/index.tsx` — Home screen: PREP session verification status
- `app/prep-plan.tsx` — Show verification status on each session
- `store/useAppStore.ts` — Add verification state
- `types/index.ts` — New types for verification, Legendary rank
- `supabase/schema.sql` — New table + column additions

## IMPLEMENTATION ORDER

1. **XP rebalance** (ranks.ts, healthKit.ts) — Core math changes
2. **Database migration** — New table + columns
3. **Correlation engine** (prepCorrelation.ts) — The brain
4. **Health sync upgrade** (healthSync.ts) — Auto-sync + correlation
5. **PREP plan UI** — ✅ status on home screen
6. **Recent Activities UI** — Non-plan activities
7. **Manual logging XP removal** — Disable XP from manual entries
8. **Garmin "Coming Soon"** — Stub UI in settings

## IMPORTANT NOTES

- This is a React Native (Expo) app
- Backend is Supabase (Postgres + Auth + Storage)
- State management: Zustand (useAppStore.ts)
- Do NOT modify the PREP plan generator logic — only add verification layer on top
- Keep backward compatibility — existing users' XP should NOT be recalculated retroactively
- New XP rules apply only to NEW activities going forward
- The app runs on iOS via Expo Go (dev) and TestFlight (production)

When completely finished, run: `openclaw system event --text "Done: Iron3 XP overhaul + watch-verified PREP plan implemented" --mode now`
