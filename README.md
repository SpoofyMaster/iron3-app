# Iron3 — Gamified Ranked Triathlon App

A gamified ranked triathlon app for swim, bike, and run built with React Native, Expo, TypeScript, Expo Router, Supabase, and Zustand.

## Features

- **Tri-Rank System** — Weighted average of three discipline ranks (Iron → Bronze → Silver → Gold → Elite → Legendary)
- **Discipline-specific ranks** — Earn points per swim, bike, and run session with pace and distance bonuses
- **Home Dashboard** — Tri-Rank display, discipline cards, weekly stats, recent activities
- **Discipline Tabs** — Detailed rank progress, personal bests, history chart, activity log
- **Leaderboard** — Global and friends, filter by discipline
- **Profile** — Rank history chart, stats, settings, subscription management
- **Onboarding** — Experience level, discipline selection, weekly goals
- **Paywall** — $4.99/week premium with free trial, comparison table

## Scoring

| Discipline | Base Rate | Distance Bonuses | Pace Bonuses |
|-----------|-----------|-------------------|--------------|
| Swim | 10 pts / 100m | 500m+ → 200+ | Sub 2:00/100m → 50+ |
| Bike | 5 pts / km | 20km+ → 350+ | Sub 2:30/km → 20+ |
| Run | 8 pts / km | 5km+ → 500+ | Sub 6:00/km → 20+ |

## Rank Tiers

| Rank | Points | Color |
|------|--------|-------|
| Iron | 0 – 999 | #8B8B8B |
| Bronze | 1,000 – 2,499 | #CD7F32 |
| Silver | 2,500 – 4,999 | #C0C0C0 |
| Gold | 5,000 – 9,999 | #FFD700 |
| Elite | 10,000 – 19,999 | #E5E4E2 |
| Legendary | 20,000+ | #FF4500 |

## Quick Start

```bash
npm install
npx expo start
```

## Project Structure

```
app/
  _layout.tsx          # Root layout
  onboarding.tsx       # Onboarding flow
  paywall.tsx          # Premium paywall
  (tabs)/
    _layout.tsx        # Tab navigation
    index.tsx          # Home dashboard
    swim.tsx           # Swim discipline
    bike.tsx           # Bike discipline
    run.tsx            # Run discipline
    leaderboard.tsx    # Leaderboard
    profile.tsx        # Profile & settings
components/            # Reusable UI components
lib/
  ranks.ts             # Rank calculation logic
  scoring.ts           # Points scoring engine
  supabase.ts          # Supabase client
  mockData.ts          # Mock data for development
store/
  useAppStore.ts       # Zustand state management
theme/
  index.ts             # Design tokens & colors
types/
  index.ts             # TypeScript type definitions
supabase/
  schema.sql           # Full database schema
```

## Tech Stack

- **React Native** + **Expo SDK 52**
- **Expo Router** (file-based routing)
- **TypeScript** (strict mode)
- **Zustand** (state management)
- **Supabase** (auth, database, RLS)
- **React Native SVG** (charts)

## Environment Variables

Create a `.env` file with:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL editor to create all tables, RLS policies, triggers, views, and helper functions.
