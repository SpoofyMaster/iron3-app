# Iron3 — Design System

## Design Philosophy

Iron3 looks like an elite endurance sports product, not a generic fitness app.

**Core principles:**
- Dark, premium, disciplined
- Apple-quality polish
- Sharp contrast, clean typography
- Elegant glassmorphism cards
- Rank colors as the emotional palette
- Minimal chrome, maximum content
- Every pixel earns its place

**Avoid:**
- Generic gym aesthetics
- Childish gamification (no cartoon badges)
- Cluttered UX
- Cheap gradients or neon colors
- Over-animated interfaces

---

## Color System

### Backgrounds
```
background:       #0A0A0F    — Deep black, primary bg
surface:          #141419    — Card backgrounds
surfaceGlass:     rgba(255, 255, 255, 0.04)  — Glassmorphism fill
surfaceGlassBorder: rgba(255, 255, 255, 0.08) — Glassmorphism border
surfaceHover:     rgba(255, 255, 255, 0.06)  — Interactive hover
```

### Text
```
text:             #F5F5F7    — Primary text (near-white)
textSecondary:    rgba(255, 255, 255, 0.55)  — Secondary text
textMuted:        rgba(255, 255, 255, 0.30)  — Muted/disabled text
```

### Rank Colors (The Soul of the Brand)
```
iron:       #8B8B8B    — Neutral grey, starting point
bronze:     #CD7F32    — Warm copper, first achievement
silver:     #C0C0C0    — Cool metallic, dedicated
gold:       #FFD700    — Bright gold, competitive
platinum:   #B0C4DE    — Light steel blue, serious
diamond:    #B9F2FF    — Ice blue, rare
elite:      #E5E4E2    — Platinum white, top tier
legendary:  #FF4500    — Burning orange-red, iconic
```

### Discipline Colors
```
swim:       #00B4D8    — Ocean blue
bike:       #80ED99    — Electric green
run:        #FFB347    — Warm amber
```

### Accent & Semantic
```
primary:        #FF4500    — Brand accent (legendary orange)
primaryLight:   #FF6B35    — Lighter variant
success:        #22C55E    — Positive actions
warning:        #F59E0B    — Caution states
error:          #EF4444    — Error states
```

---

## Typography

### Font Family
```
Primary:  System font (SF Pro on iOS, Roboto on Android)
Display:  System bold — for headings and rank names
Mono:     System monospace — for numbers and stats
```

We use system fonts for performance and native feel. The typography authority comes from weight and size, not novelty fonts.

### Scale
```
xs:     11px    — Captions, badges
sm:     13px    — Secondary labels
md:     15px    — Body text
lg:     17px    — Section headers
xl:     20px    — Screen titles
xxl:    24px    — Major headings
xxxl:   32px    — Hero numbers
display: 48px   — Rank display, feature numbers
```

### Weights
```
regular:    400
medium:     500
semibold:   600
bold:       700
heavy:      800    — Display numbers only
```

---

## Spacing

### Scale (4px base)
```
xxs:    2px
xs:     4px
sm:     8px
md:     12px
lg:     16px
xl:     20px
xxl:    24px
xxxl:   32px
```

### Layout Rules
- Screen horizontal padding: 16px
- Card internal padding: 16-20px
- Section gap: 20-24px
- Element gap within section: 8-12px
- Bottom tab safe area: auto (SafeAreaView)

---

## Border Radius

```
sm:     8px     — Small chips, badges
md:     12px    — Buttons, inputs
lg:     16px    — Cards
xl:     20px    — Large cards, modals
full:   9999px  — Pills, avatars
```

---

## Component Library

### GlassCard
The primary container component. Used for all content blocks.

```
Background:   rgba(255, 255, 255, 0.04)
Border:       1px solid rgba(255, 255, 255, 0.08)
Radius:       16px
Padding:      16px
Backdrop:     blur(10px) on supported platforms
```

Variants:
- `default` — Standard glass card
- `highlighted` — Slightly brighter border for emphasis
- `interactive` — Adds hover/press state

### RankBadge
Circular badge showing a rank tier.

```
Size:         48px (default), 32px (small), 64px (large)
Background:   rank color at 15% opacity
Border:       2px solid rank color at 30% opacity
Icon:         Centered emoji or custom icon
Shadow:       Subtle glow matching rank color
```

Rank icons:
```
Iron:       ⚙️
Bronze:     🛡️
Silver:     ⚔️
Gold:       👑
Platinum:   ⭐
Diamond:    💎
Elite:      🏆
Legendary:  🔥
```

### RankProgressBar
Horizontal progress bar showing advancement to next rank.

```
Track:        rgba(255, 255, 255, 0.06)
Fill:         Gradient from current rank color to next rank color
Height:       6px (thin), 10px (standard)
Radius:       full
Label:        "2,340 / 5,000 to Gold" below bar
```

### DisciplineCard
Tappable card showing a discipline's rank status.

```
Layout:       Horizontal — icon left, rank info center, chevron right
Icon:         Discipline emoji in colored circle
Title:        "Swim Rank" / "Bike Rank" / "Run Rank"
Rank:         RankBadge + rank name
Subtitle:     Points + progress percentage
Background:   GlassCard
Border left:  3px solid discipline color (accent)
```

### StreakBadge
Prominent streak display for the dashboard.

```
Layout:       🔥 + number + "day streak"
Size:         Large on dashboard, compact in profile
Animation:    Flame flicker when streak is active
Color:        Orange gradient when active, grey when broken
```

### MilestoneCard
Celebration card for achieved milestones.

```
Layout:       Icon + title + description + date
Background:   GlassCard with subtle shimmer
Icon:         Milestone-specific emoji
State:        Achieved (full color) vs Locked (dimmed + lock icon)
```

### PremiumLock
Overlay component that gates premium content.

```
Overlay:      Gaussian blur (8px) on content
Badge:        "🔒 Premium" centered
CTA:          "Unlock with Iron3 Pro" button below
Background:   Semi-transparent dark overlay
```

### FilterChip
Selectable filter pills for leaderboards and lists.

```
Default:      Glass background, muted text
Selected:     Accent background, white text
Size:         Compact (28px height), Standard (36px height)
Radius:       full (pill shape)
```

### StatCard
Compact statistic display.

```
Layout:       Icon + Label + Value + Subtitle (vertical stack)
Background:   GlassCard
Size:         Flexible, used in grid layouts
```

### Button
Primary action button.

```
Primary:      #FF4500 background, white text, 12px radius
Secondary:    Glass background, border, white text
Ghost:        Transparent, text only
Destructive:  Error color background
Sizes:        sm (36px), md (44px), lg (52px)
```

---

## Chart Styles

### Line Chart (Rank History)
```
Line:         2px, gradient from start rank color to current
Area:         Subtle fill below line at 10% opacity
Grid:         Horizontal lines only, rgba(255,255,255,0.04)
Labels:       textMuted color, xs size
Dots:         6px circles at data points, rank-colored
```

### Bar Chart (Weekly Volume)
```
Bars:         Discipline-colored, rounded top corners
Width:        60% of available space
Background:   rgba(255,255,255,0.04)
Labels:       Day abbreviations below, volume above
```

### Progress Ring (Consistency)
```
Track:        rgba(255,255,255,0.06)
Fill:         Gradient (primary → primaryLight)
Width:        8px stroke
Size:         120px diameter on dashboard
Center:       Fraction text "4/6"
```

### Balance Chart (Discipline Mix)
```
Type:         Donut chart or 3-segment horizontal bar
Colors:       swim, bike, run discipline colors
Labels:       Percentage per discipline
```

---

## Animation Guidelines

### Principles
1. Purposeful — animations communicate state changes
2. Fast — most transitions <300ms
3. Native — use Reanimated for 60fps
4. Restrained — no gratuitous motion

### Key Animations
```
Rank-up celebration:    Scale bounce (1.0 → 1.2 → 1.0) + confetti particles
Streak increment:       Fire emoji scale pulse + number count-up
Workout logged:         Check mark draw + points count-up
Tab switch:             Cross-fade, 150ms
Card press:             Scale to 0.98, 100ms
Page transition:        Slide from right, 250ms
Milestone unlock:       Slide up + shimmer effect
```

### Micro-interactions
```
Button press:           Haptic feedback (light) + scale 0.97
Chip select:            Haptic feedback (selection) + color fill
Rank badge:             Subtle glow pulse every 3 seconds
Progress bar:           Animated fill on mount, 600ms ease-out
```

---

## Paywall Design

### Layout
```
1. Headline:        "Unlock Your Full Rank"
2. Feature grid:    3x2 grid of premium features with icons
3. Pricing cards:   Weekly / Monthly / Annual options
4. CTA button:      Full-width primary button
5. Free tier note:  "Continue with free tier" text link
6. Legal:           Terms + Restore purchases
```

### Visual Treatment
- Top accent bar: gradient (primary → gold)
- Feature icons: discipline colors
- Selected plan: highlighted border + checkmark
- Background: slightly elevated from standard (surface color)

---

## Iconography

### System Icons
Use Ionicons (included via @expo/vector-icons) for consistency.

```
Home:           home / home-outline
Log:            add-circle / add-circle-outline
Ranks:          trophy / trophy-outline
Progress:       stats-chart / stats-chart-outline
Profile:        person / person-outline
Swim:           water
Bike:           bicycle
Run:            walk
Streak:         flame
Settings:       settings-outline
Notification:   notifications-outline
Lock:           lock-closed
Premium:        diamond
```

### Custom Elements
- Rank badges use emoji for V1 (fast to ship)
- V2 will introduce custom SVG rank insignias

---

## Responsive Behavior

### Phone (Primary)
- Single column layout
- Bottom tab navigation
- Full-width cards

### Tablet (Supported)
- Two-column layout for dashboard
- Side-by-side discipline cards
- Wider chart areas

### Web (Development)
- Phone-width centered container
- For preview/development only
- Not a priority for V1

---

## Dark Mode

Iron3 is dark-mode only in V1. The premium sports aesthetic requires a dark canvas.

Light mode may be considered in V2 based on user feedback, but the brand identity is fundamentally dark.
