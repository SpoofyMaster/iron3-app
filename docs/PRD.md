# Iron3 — Product Requirements Document

## Product Vision

Iron3 is the first gamified ranking system for triathletes. It transforms training from a chore into an obsession by giving athletes a ranked identity across swim, bike, and run.

Iron3 is not a training log. It is not a coaching app. It is a **ranked progression system** that makes every session count, every week measurable, and every athlete competitive — whether they're training for their first Sprint or chasing a Kona slot.

**One-liner:** "Know Your Rank. Swim. Bike. Run."

---

## Target Users

### Primary: The Aspiring First-Timer
- Training for their first 70.3 or full Ironman
- Intimidated by the scope of triathlon
- Needs structure, motivation, and a sense of progress
- Doesn't know what "good" looks like yet
- **Job to be done:** Make me feel like I'm becoming a triathlete

### Secondary: The Competitive Age-Grouper
- Has completed 2+ races, wants to improve
- Knows their FTP, pace zones, and race splits
- Wants to compare, compete, and validate improvement
- Data-driven and achievement-oriented
- **Job to be done:** Show me where I stand and help me climb

### Market Context
- Ironman 2025: 250,000+ registrations (25% increase YoY)
- Under-30 athletes growing 35%, women 25-29 up 44%
- 20 new Ironman events confirmed for 2026
- Average athlete getting younger every year
- No "Liftoff for triathlon" exists — Iron3 fills this gap

---

## Product Pillars

### 1. RANK IDENTITY
Every triathlete gets a rank. It defines them. They share it. They chase the next tier. The rank IS the product.

### 2. VISIBLE PROGRESS
Every session moves the needle. Charts go up. Streaks grow. Milestones unlock. The user can SEE themselves getting better.

### 3. HEALTHY COMPETITION
Leaderboards, friend challenges, age-group comparison. Competition drives retention. Iron3 makes training social and competitive.

### 4. PREMIUM FEEL
This is for athletes who spend $5,000 on race fees and $3,000 on a bike. The app must feel as premium as their gear.

### 5. FAST ENGAGEMENT
Log a workout in <20 seconds. See your rank instantly. No friction, no complexity. Open → Log → See Progress → Close.

---

## Emotional Hooks

| Hook | Trigger | Example |
|------|---------|---------|
| Identity | Rank badge | "I'm a Gold triathlete" |
| Progress | Rank-up animation | "I just hit Silver in swim!" |
| Competition | Leaderboard position | "I'm #47 globally" |
| Consistency | Streak counter | "14-day streak 🔥" |
| Fear of Loss | Rank-down warning | "Your run rank may drop" |
| Pride | Milestone unlock | "100 sessions completed" |
| Urgency | Race countdown | "32 days to Ironman 70.3" |
| Belonging | Community rank | "Top 5% of age group" |

---

## Jobs To Be Done

1. **Track my training** across all 3 disciplines in one place
2. **Know where I stand** compared to other triathletes
3. **Feel motivated** to train consistently, even when I don't want to
4. **See my progress** over weeks and months
5. **Prepare for my race** with confidence
6. **Share my achievement** with my training community
7. **Stay accountable** through streaks and social pressure
8. **Identify weaknesses** across my 3 disciplines

---

## MVP Scope

### In V1 (Launch)
- Authentication (email + social)
- 11-step personalized onboarding
- Home dashboard (rank, streak, race countdown, motivation)
- Workout logging (<20 sec, all disciplines)
- Workout history
- 8-tier rank system (Iron → Legendary)
- 3 discipline ranks + 1 overall Tri-Rank
- Scoring engine with consistency/balance/volume bonuses
- Unified Ranks screen with discipline drill-downs
- Global leaderboard
- Progress/Analytics screen
- Streak tracking + milestone system
- Paywall + premium gating
- Push notification architecture

### NOT in V1 (V2 Roadmap)
- Strava/Garmin integration
- Apple Watch companion
- AI coach / pace recommendations
- Race finish time prediction
- Age-group percentile comparison
- Social friend challenges
- Shareable rank cards for Instagram
- Community feed
- Coach mode
- Nutrition tracking
- Recovery score
- Real pace/power-based ranking

---

## User Flows

### New User Journey
```
Download → Splash → Sign Up → Onboarding (11 steps) →
Personalized Dashboard → First Workout Log → 
See Points Earned → See Rank (Iron) → 
Get Motivated → Come Back Tomorrow
```

### Returning User Journey
```
Open App → See Dashboard (streak, rank, today's focus) →
Log Workout → See Points + Streak Update →
Check Rank Progress → Check Leaderboard →
Close App → Get Push Notification Tomorrow
```

### Conversion Journey (Free → Premium)
```
See Overall Rank (free) → Tap Swim Rank Card →
See Lock + "Unlock with Premium" →
View Paywall → See Feature Comparison →
Start Free Trial → Convert to Weekly Sub
```

---

## Monetization Model

### Free Tier
- Basic workout logging (all disciplines)
- Overall Tri-Rank only
- Limited progress history (last 7 days)
- Leaderboard preview (top 5 only)
- Basic streak tracking

### Premium Tier — $4.99/week
- Full Swim, Bike, Run discipline ranks
- Complete Tri-Rank analytics
- Full global leaderboard
- Rank history + progression charts
- Advanced milestones
- Age-group comparison (V2)
- Friend challenges (V2)
- Priority feature requests

### Pricing Options
| Plan | Price | Annual Equivalent |
|------|-------|-------------------|
| Weekly | $4.99/week | $259/year |
| Monthly | $14.99/month | $180/year |
| Annual | $99.99/year | $100/year |

Weekly subscription has highest conversion rate on iOS (low commitment).

### Premium Triggers (contextual upsell moments)
1. Tapping a locked discipline rank card
2. Scrolling past position 5 on leaderboard
3. Trying to view progress charts beyond 7 days
4. After logging 3rd workout (user is engaged)
5. After first rank-up (emotional high)
6. Weekly summary email with blurred detailed stats

---

## Success Metrics

### North Star
**Weekly Active Users who log 3+ workouts**

### Key Metrics
| Metric | Target (Month 3) |
|--------|-------------------|
| DAU/MAU | >40% |
| D7 Retention | >50% |
| D30 Retention | >30% |
| Free → Trial Conversion | >15% |
| Trial → Paid Conversion | >60% |
| Avg Sessions/Week | >4 |
| Avg Workout Logs/Week | >3 |
| Weekly Sub Revenue/User | $4.99 |

---

## V2 Roadmap (Post-Launch)

### V2.0 — Connected (Month 2-3)
- Strava automatic sync
- Garmin Connect integration
- Apple HealthKit sync
- Real pace/power data in scoring

### V2.1 — Social (Month 3-4)
- Friend system
- Head-to-head challenges
- Shareable rank cards (Instagram stories)
- Community feed

### V2.2 — Intelligence (Month 4-6)
- AI training suggestions
- Race finish time prediction
- Pacing recommendations
- Recovery score
- Age-group percentile rankings

### V2.3 — Platform (Month 6+)
- Coach mode
- Team/club features
- Race calendar integration
- Nutrition tracking
- Apple Watch companion app
