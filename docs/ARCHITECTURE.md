# Iron3 — Technical Architecture

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React Native 0.76 | Cross-platform iOS + Android |
| Platform | Expo SDK 52 | Fastest RN dev experience, OTA updates |
| Language | TypeScript 5.3 (strict) | Type safety, better DX |
| Routing | Expo Router 4 | File-based routing, deep links |
| State | Zustand 5 | Lightweight, no boilerplate, selector-based |
| Backend | Supabase | Auth, PostgreSQL, real-time, RLS |
| Subscriptions | RevenueCat | Cross-platform IAP, analytics |
| Notifications | Expo Notifications | Push notifications |
| Charts | react-native-svg | Custom chart components |
| Animations | React Native Reanimated 3 | 60fps native animations |
| UI | Custom component library | No external UI kit — premium feel |

## Folder Structure

```
iron3-app/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (auth guard, theme)
│   ├── (auth)/
│   │   ├── login.tsx             # Login / Sign Up
│   │   └── forgot-password.tsx   # Password reset
│   ├── onboarding.tsx            # 11-step onboarding flow
│   ├── paywall.tsx               # Subscription paywall
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigator
│   │   ├── index.tsx             # Home Dashboard
│   │   ├── log.tsx               # Workout Logging
│   │   ├── ranks.tsx             # Ranks Overview + Leaderboard
│   │   ├── progress.tsx          # Analytics / Progress
│   │   └── profile.tsx           # Profile / Settings
│   ├── discipline/
│   │   ├── swim.tsx              # Swim rank detail
│   │   ├── bike.tsx              # Bike rank detail
│   │   └── run.tsx               # Run rank detail
│   └── workout/
│       ├── [id].tsx              # Workout detail
│       └── history.tsx           # Workout history
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── GlassCard.tsx
│   │   ├── Button.tsx
│   │   ├── FilterChip.tsx
│   │   └── PremiumLock.tsx
│   ├── rank/                     # Rank-related components
│   │   ├── RankBadge.tsx
│   │   ├── RankProgressBar.tsx
│   │   ├── TriRankDisplay.tsx
│   │   └── DisciplineCard.tsx
│   ├── workout/                  # Workout components
│   │   ├── WorkoutLogger.tsx
│   │   ├── ActivityRow.tsx
│   │   └── WorkoutTypeSelector.tsx
│   ├── charts/                   # Chart components
│   │   ├── MiniChart.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── ConsistencyHeatmap.tsx
│   │   └── BalancePieChart.tsx
│   ├── retention/                # Retention components
│   │   ├── StreakBadge.tsx
│   │   ├── MilestoneCard.tsx
│   │   ├── RaceCountdown.tsx
│   │   └── MotivationalPrompt.tsx
│   └── premium/
│       ├── PaywallModal.tsx
│       ├── PremiumBanner.tsx
│       └── LockedOverlay.tsx
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── ranks.ts                  # Rank calculation engine
│   ├── scoring.ts                # Points scoring logic
│   ├── streaks.ts                # Streak calculation
│   ├── milestones.ts             # Milestone detection
│   ├── subscription.ts           # RevenueCat integration
│   ├── notifications.ts          # Push notification helpers
│   └── mockData.ts               # Development mock data
├── store/
│   └── useAppStore.ts            # Zustand global store
├── theme/
│   └── index.ts                  # Colors, typography, spacing
├── types/
│   └── index.ts                  # All TypeScript interfaces
├── supabase/
│   └── schema.sql                # Full database schema
├── docs/
│   ├── PRD.md                    # Product Requirements
│   ├── ARCHITECTURE.md           # This file
│   ├── DESIGN_SYSTEM.md          # Design tokens & components
│   └── TASKS.md                  # Development task tracker
├── app.config.ts                 # Expo configuration
├── package.json
└── tsconfig.json
```

## State Management

### Zustand Store Architecture

```
useAppStore
├── User State
│   ├── user: UserProfile
│   ├── isPremium: boolean
│   └── hasCompletedOnboarding: boolean
├── Training State
│   ├── activities: Activity[]
│   ├── personalBests: PersonalBest[]
│   └── weeklyStats: WeeklyStats
├── Rank State
│   ├── swimPoints: number
│   ├── bikePoints: number
│   ├── runPoints: number
│   └── rankHistory: RankHistoryEntry[]
├── Streak State
│   ├── currentStreak: number
│   ├── longestStreak: number
│   └── lastActivityDate: string
├── Milestone State
│   └── milestones: Milestone[]
├── Leaderboard State
│   ├── leaderboard: LeaderboardEntry[]
│   ├── leaderboardFilter: LeaderboardFilter
│   └── leaderboardScope: LeaderboardScope
├── Onboarding State
│   └── onboarding: OnboardingState
└── Actions
    ├── logWorkout()
    ├── setLeaderboardFilter()
    ├── togglePremium()
    └── completeOnboarding()
```

### Critical Zustand Rule
**NEVER call functions inside Zustand selectors.** This causes infinite re-render loops.

```typescript
// ❌ WRONG — creates new object every render
const triRank = useAppStore((s) => s.getTriRank());

// ✅ CORRECT — select primitives, compute outside
const swimPoints = useAppStore((s) => s.swimPoints);
const bikePoints = useAppStore((s) => s.bikePoints);
const runPoints = useAppStore((s) => s.runPoints);
const triRank = useMemo(
  () => getTriRank(swimPoints, bikePoints, runPoints),
  [swimPoints, bikePoints, runPoints]
);
```

## Data Flow

```
User Action (Log Workout)
    ↓
Component dispatches Zustand action
    ↓
Zustand store updates local state
    ↓
Scoring engine recalculates points
    ↓
Rank engine determines new ranks
    ↓
Streak engine updates streak
    ↓
Milestone engine checks for unlocks
    ↓
UI re-renders with new data
    ↓
(Async) Supabase sync in background
```

## Rank Engine Architecture

### V1 (Current)
Points-based system with bonuses:

```
Base Points:
  Swim: 10 pts / 100m
  Bike: 5 pts / km
  Run: 8 pts / km

Bonuses:
  Pace bonus: up to 2x multiplier for fast sessions
  Distance bonus: extra points for long sessions
  Consistency bonus: +50 pts for 3+ sessions/week
  Streak bonus: +20 pts per day of active streak
  Balance bonus: +100 pts for all 3 disciplines in a week
```

### V2 (Future)
Real performance data:

```
Pace-weighted scoring
Heart rate zone analysis
Power-based cycling metrics
Race result integration
Age-group percentile ranking
Predictive readiness score
```

The V1 architecture stores raw activity data that V2 can retroactively re-score.

## Subscription Architecture

```
RevenueCat SDK
    ↓
App checks entitlement on launch
    ↓
Store isPremium in Zustand
    ↓
PremiumLock component checks isPremium
    ↓
If free: show blur + upgrade CTA
If premium: show full content
```

Premium is checked at the component level, not the screen level. This allows granular gating:
- Show overall rank (free) but lock discipline ranks (premium)
- Show top 5 leaderboard (free) but lock full list (premium)
- Show 7-day progress (free) but lock full history (premium)

## Database Architecture

### Supabase Tables
- `users` — Auth users
- `profiles` — Extended user profile + onboarding data
- `workout_logs` — All workout entries
- `rank_snapshots` — Daily rank calculations
- `leaderboard_entries` — Computed leaderboard positions
- `race_goals` — User race targets
- `streaks` — Streak tracking
- `milestones` — Achieved milestones
- `subscriptions` — Subscription state
- `notification_preferences` — Push notification settings

### Row Level Security
All tables use RLS policies:
- Users can only read/write their own data
- Leaderboard entries are read-accessible to all authenticated users
- Admin functions for rank computation run as service role

### Sync Strategy
V1: Local-first with periodic Supabase sync
V2: Real-time subscriptions for leaderboard + social features

## API Architecture

No custom API server in V1. All data flows through:
1. **Supabase Auth** — Authentication
2. **Supabase Database** — PostgreSQL with RLS
3. **Supabase Edge Functions** — Rank computation, leaderboard refresh
4. **RevenueCat** — Subscription management
5. **Expo Push** — Notifications

## Performance Targets

| Metric | Target |
|--------|--------|
| App launch to dashboard | <2s |
| Workout log to confirmation | <500ms |
| Tab switch | <100ms |
| Rank recalculation | <200ms |
| Bundle size (iOS) | <25MB |
| Bundle size (Android) | <20MB |

## Security

- All API keys in environment variables (never committed)
- Supabase RLS on all tables
- RevenueCat receipt validation server-side
- No sensitive data stored on device
- Expo SecureStore for auth tokens
