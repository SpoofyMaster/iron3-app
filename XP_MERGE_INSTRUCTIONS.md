# Iron3 XP Overhaul — merge into `~/Projects/iron3-app`

Automated edits could not write to your clone from this environment. **Copy the `iron3-app/` folder from this workspace over your repo** (replace/add files), then apply the manual edits below.

## 1. Copy files

From `.openclaw/workspace/iron3-app/` into your `iron3-app` repo root:

- `lib/ranks.ts`
- `lib/healthKit.ts`
- `lib/healthSync.ts`
- `lib/prepCorrelation.ts`
- `lib/prepSessionUi.ts`
- `lib/prepVerifications.ts`
- `lib/useAutoSync.ts` → replace `lib/useAutoSync.ts`
- `types/index.ts`
- `theme/index.ts`
- `lib/effects.ts`
- `components/RankBadge.tsx`
- `components/PrepSessionStatus.tsx`
- `components/RecentActivities.tsx`
- `components/HomePrepPlanWeek.tsx`
- `supabase/schema_xp_overhaul.sql` — run in Supabase SQL editor (or merge into `supabase/schema.sql`)

## 2. `lib/dataService.ts` — extend `createActivity`

Add optional fields to the `createActivity` argument type and pass through to `insert`:

```ts
prep_verified?: boolean;
compliance_bonus?: number;
```

## 3. `store/useAppStore.ts`

### `buildActivityFromRow`

Add:

```ts
source: row.source ?? undefined,
prepVerified: row.prep_verified ?? false,
complianceBonus: Number(row.compliance_bonus ?? 0),
```

### `logWorkout`

- Set `const points = 0` (remove effort/duration bonus math).
- For `newSwim` / `newBike` / `newRun`, do **not** add points (keep `+= 0` or skip increment).
- `activityForWorkout.pointsEarned = 0`, `createWorkoutLog` with `points_earned: 0`, `createActivity` with `points_earned: 0`, `prep_verified: false`, `compliance_bonus: 0`.
- `lastLoggedPoints: 0`.

Keep streak / workout_logs behavior as today.

## 4. `app/(tabs)/index.tsx`

- Import `HomePrepPlanWeek`, `RecentActivities`, `filterOffPlanWatchActivities` from `@/lib/prepSessionUi`.
- Inside the PREP `GlassCard`, replace the `.map` over `prepPlan.weeks[prepPlan.currentWeekIndex]?.sessions` with:

  ```tsx
  <HomePrepPlanWeek todayIdx={todayIdx} />
  ```

- Replace the bottom **Recent Activities** block with off-plan watch list:

  ```tsx
  <SectionHeader title="Off-plan (watch)" />
  <RecentActivities activities={filterOffPlanWatchActivities(activities)} />
  ```

- Optionally add a one-line note under the hero: “Connect your watch to earn XP.”

## 5. `components/index.ts`

Export:

```ts
export { PrepSessionStatus } from "./PrepSessionStatus";
export { RecentActivities } from "./RecentActivities";
export { HomePrepPlanWeek } from "./HomePrepPlanWeek";
```

## 6. `app/(tabs)/log.tsx`

Where XP is shown after logging, clarify: manual logs earn **0 XP**; suggest Apple Watch / Health.

## 7. `app/workout/live.tsx`

Set displayed “XP earned” preview to **0** or hide it (in-app GPS is not watch-synced).

## 8. `components/DisciplineScreen.tsx`

Change the “Diamond Rank” max label to **Legendary** when `getNextRankTier` is null and tier is Legendary (optional copy tweak).

## 9. `app/prep-plan.tsx` (optional)

Import `PrepSessionStatus` + `listPrepSessionVerifications` + `computePrepRowStatus` and show the same ✅/🔄/⬜ column as on home.

## 10. Database

Run `supabase/schema_xp_overhaul.sql` on Supabase before shipping a build that writes `prep_verified` / `prep_session_verifications`.

## 11. PR

```bash
git checkout -b feat/xp-overhaul-prep-watch
# copy files, apply edits, commit
gh pr create --title "feat: XP overhaul + watch-verified PREP plan" --body "See XP_OVERHAUL_SPEC.md"
```

## 12. Health sync upsert

If `prep_session_verifications` upsert fails (older API), ensure unique constraint exists: `(user_id, prep_week_number, session_day)`.
