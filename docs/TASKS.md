# Iron3 — Development Task Tracker

## Phase 1: Foundation ✅ COMPLETE
- [x] Initialize Expo + TypeScript project
- [x] Set up Expo Router file-based navigation
- [x] Create theme system (colors, typography, spacing)
- [x] Create TypeScript types
- [x] Build GlassCard component
- [x] Build RankBadge component
- [x] Build RankProgressBar component
- [x] Build DisciplineCard component
- [x] Build LeaderboardRow component
- [x] Build TriRankDisplay component
- [x] Build StatCard component
- [x] Build ActivityRow component
- [x] Build MiniChart component
- [x] Build PremiumBanner component
- [x] Build FilterChip component
- [x] Set up Zustand store with mock data
- [x] Implement rank calculation engine (lib/ranks.ts)
- [x] Implement scoring engine (lib/scoring.ts)
- [x] Create Supabase schema (basic)
- [x] Build Home Dashboard screen
- [x] Build Swim/Bike/Run discipline screens
- [x] Build Leaderboard screen
- [x] Build Profile screen
- [x] Build basic Onboarding (4 steps)
- [x] Build Paywall screen
- [x] Build Auth/Login screen
- [x] Fix Zustand infinite loop bugs

## Phase 2: Core Features ✅ COMPLETE
- [x] Restructure to 5 tabs (Home, Log, Ranks, Progress, Profile)
- [x] Build Workout Logging screen (<20 sec flow)
- [x] Build Workout History screen
- [x] Build unified Ranks screen (overview + leaderboard)
- [x] Move discipline screens to stack navigation
- [x] Build Progress/Analytics screen
- [x] Expand to 8 rank tiers (add Platinum + Diamond)
- [x] Implement consistency/streak/balance scoring bonuses
- [x] Build streak tracking system
- [x] Build milestone system + milestone cards
- [x] Upgrade Home Dashboard (streak, countdown, motivation)
- [x] Expand onboarding to 11 steps
- [x] Implement PremiumLock gating component
- [x] Add premium locks throughout app
- [x] Expand Supabase schema (race_goals, streaks, milestones)

## Phase 3: Visual Overhaul ✅ COMPLETE
- [x] SVG shield rank badges with wings + glow
- [x] Purple/blue/cyan gradient backgrounds
- [x] Neon glow effects, podium leaderboard
- [x] Gaming-style rank aesthetic (League/Valorant inspired)
- [x] Rank emblem PNG assets (all 8 tiers)

## Phase 4: Mobile Features ✅ COMPLETE
- [x] Live GPS workout tracking (app/workout/live.tsx)
- [x] Activity detail screen with laps (app/workout/[id].tsx)
- [x] Training plan / availability scheduler (app/settings/)
- [x] Share to Instagram (app/workout/share.tsx)
- [x] Friends leaderboard with podium photos
- [x] Apple HealthKit integration architecture (lib/healthkit.ts)
- [x] Garmin integration architecture (lib/garmin.ts)
- [x] Level/XP/streak top bar (components/LevelStreakBar.tsx)
- [x] Enhanced profile with social features
- [x] Enhanced home dashboard with level bar

## Phase 5: Auth & Backend 📋 NEXT UP
- [ ] Supabase auth integration (email + social)
- [ ] Password reset flow
- [ ] Profile data persistence to Supabase
- [ ] Workout data sync to Supabase
- [ ] Rank snapshot daily computation
- [ ] Leaderboard refresh Edge Function
- [ ] RevenueCat subscription integration
- [ ] Receipt validation

## Phase 6: Polish & Retention 📋 PLANNED
- [ ] Rank-up celebration animation
- [ ] Milestone unlock animation
- [ ] Workout confirmation animation (points count-up)
- [ ] Weekly consistency ring on dashboard
- [ ] Push notification architecture
- [ ] Missed-session recovery prompts
- [ ] Weekly summary generation
- [ ] Motivational message rotation
- [ ] Rank-down warning system
- [ ] Today's training focus suggestion

## Phase 7: Launch Prep 📋 PLANNED
- [ ] App icon + splash screen
- [ ] App Store screenshots
- [ ] App Store description + metadata
- [ ] TestFlight build
- [ ] Google Play internal testing build
- [ ] Landing page deployment
- [ ] Instagram content launch (@iron3app)
- [ ] Beta tester recruitment
- [ ] Performance optimization pass
- [ ] Accessibility audit

## Phase 8: V2 Features 📋 FUTURE
- [ ] Strava integration
- [ ] Garmin Connect full integration
- [ ] Apple HealthKit full sync
- [ ] Pace-weighted scoring
- [ ] Race finish time prediction
- [ ] Age-group percentile comparison
- [ ] Friend challenges
- [ ] Shareable rank cards
- [ ] Community feed
- [ ] Apple Watch companion
- [ ] AI training suggestions

---

## Notes
- Weekly sub at $4.99/week is the primary monetization
- Cursor Cloud Agents API key: stored in .env
- GitHub repo: https://github.com/SpoofyMaster/iron3-app
- Instagram: @iron3app (created)
- Landing page: iron3-landing/ in workspace
