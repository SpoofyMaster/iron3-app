import { DisciplineLevel, RaceDistanceGoal } from "@/types";
import { PrepPlan, PrepPlanWeek, PrepSession, PrepPhase } from "@/types";

type SessionDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// ── Phase distribution based on weeks remaining ─────────────────────────────

interface PhaseDistribution {
  base: number;
  build: number;
  peak: number;
  taper: number;
}

function getPhaseDistribution(weeksRemaining: number): PhaseDistribution {
  if (weeksRemaining >= 20) return { base: 0.60, build: 0.25, peak: 0.10, taper: 0.05 };
  if (weeksRemaining >= 12) return { base: 0.40, build: 0.35, peak: 0.15, taper: 0.10 };
  if (weeksRemaining >= 8)  return { base: 0.20, build: 0.40, peak: 0.25, taper: 0.15 };
  if (weeksRemaining >= 4)  return { base: 0.10, build: 0.30, peak: 0.35, taper: 0.25 };
  return { base: 0, build: 0, peak: 0, taper: 1.0 }; // pure taper
}

// ── Phase themes ────────────────────────────────────────────────────────────

const PHASE_THEMES: Record<PrepPhase, string[]> = {
  Base: [
    "Aerobic Foundation",
    "Building Endurance Base",
    "Long Slow Distance",
    "Aerobic Capacity",
    "Base Volume Build",
  ],
  Build: [
    "Threshold Development",
    "Race Pace Introduction",
    "Lactate Threshold",
    "Speed + Endurance",
    "Race-Specific Fitness",
  ],
  Peak: [
    "Race Simulation",
    "Race Sharpening",
    "Final Race Prep",
    "Race Intensity",
    "Peak Performance",
  ],
  Taper: [
    "Volume Reduction",
    "Freshening Up",
    "Rest & Sharpen",
    "Race Prep Rest",
    "Final Countdown",
  ],
  "Race Week": ["Race Week — Trust Your Training"],
};

// ── Base volume by race distance (hours/week) ────────────────────────────────

const BASE_WEEKLY_HOURS: Record<string, { beginner: number; intermediate: number; advanced: number }> = {
  Full: { beginner: 8, intermediate: 12, advanced: 16 },
  "70.3": { beginner: 5, intermediate: 8, advanced: 11 },
};

function getLevelCategory(swim: DisciplineLevel | null, bike: DisciplineLevel | null, run: DisciplineLevel | null): "beginner" | "intermediate" | "advanced" {
  const levels = [swim, bike, run].filter(Boolean) as DisciplineLevel[];
  if (levels.length === 0) return "beginner";
  const map: Record<DisciplineLevel, number> = { beginner: 0, intermediate: 1, advanced: 2 };
  const avg = levels.reduce((s, l) => s + map[l], 0) / levels.length;
  if (avg >= 1.5) return "advanced";
  if (avg >= 0.5) return "intermediate";
  return "beginner";
}

// ── Session templates by phase ───────────────────────────────────────────────

interface SessionTemplate {
  day: SessionDay;
  discipline: "swim" | "bike" | "run" | "rest" | "brick";
  type: PrepSession["type"];
  durationMin: number;
  notes: string;
}

function getWeekSessions(
  phase: PrepPhase,
  weekHours: number,
  raceDistance: string,
  weekNumber: number,
  isDeloadWeek: boolean
): SessionTemplate[] {
  const factor = isDeloadWeek ? 0.6 : 1.0;
  const totalMin = weekHours * 60 * factor;

  if (phase === "Race Week") {
    return [
      { day: "Mon", discipline: "rest", type: "rest", durationMin: 0, notes: "Full rest day. Prepare gear." },
      { day: "Tue", discipline: "swim", type: "easy", durationMin: 20, notes: "Easy 10-15 min swim, just loosen up." },
      { day: "Wed", discipline: "bike", type: "easy", durationMin: 20, notes: "30 min easy ride, include 3×1 min at race pace." },
      { day: "Thu", discipline: "run", type: "easy", durationMin: 15, notes: "15 min easy jog. Stay calm, trust your training." },
      { day: "Fri", discipline: "rest", type: "rest", durationMin: 0, notes: "Rest. Check transition bags. Hydrate." },
      { day: "Sat", discipline: "rest", type: "rest", durationMin: 0, notes: "Race registration / bike check-in." },
      { day: "Sun", discipline: "rest", type: "rest", durationMin: 0, notes: "🏁 RACE DAY — You are ready." },
    ];
  }

  if (phase === "Taper") {
    const t = Math.max(0.5, factor);
    return [
      { day: "Mon", discipline: "rest", type: "rest", durationMin: 0, notes: "Rest day. Let your body absorb training." },
      { day: "Tue", discipline: "swim", type: "easy", durationMin: Math.round(totalMin * 0.12), notes: "Easy aerobic swim. Technique focus." },
      { day: "Wed", discipline: "bike", type: "tempo", durationMin: Math.round(totalMin * 0.20), notes: "Moderate ride with 2×10 min at race effort." },
      { day: "Thu", discipline: "run", type: "easy", durationMin: Math.round(totalMin * 0.12), notes: "Easy 20-30 min run. Keep it light." },
      { day: "Fri", discipline: "rest", type: "rest", durationMin: 0, notes: "Rest or light stretching." },
      { day: "Sat", discipline: "brick", type: "brick", durationMin: Math.round(totalMin * 0.25), notes: `Short brick: ${raceDistance === "Full" ? "45 min bike + 15 min run" : "30 min bike + 10 min run"}` },
      { day: "Sun", discipline: "swim", type: "easy", durationMin: Math.round(totalMin * 0.10), notes: "Easy open water or pool swim." },
    ];
  }

  if (phase === "Base") {
    return [
      { day: "Mon", discipline: "rest", type: "rest", durationMin: 0, notes: "Rest day. Recovery is training." },
      { day: "Tue", discipline: "swim", type: "easy", durationMin: Math.round(totalMin * 0.13), notes: "Aerobic swim. Focus on stroke efficiency." },
      { day: "Wed", discipline: "bike", type: "easy", durationMin: Math.round(totalMin * 0.20), notes: "Zone 2 ride. Conversational pace throughout." },
      { day: "Thu", discipline: "run", type: "easy", durationMin: Math.round(totalMin * 0.13), notes: "Easy run. If you can't talk, slow down." },
      { day: "Fri", discipline: "swim", type: "easy", durationMin: Math.round(totalMin * 0.10), notes: "Technique swim. Drills + easy laps." },
      { day: "Sat", discipline: "bike", type: "long", durationMin: Math.round(totalMin * 0.28), notes: `Long ride — build to ${raceDistance === "Full" ? "4-6 hours" : "2.5-4 hours"} in later base weeks.` },
      { day: "Sun", discipline: "run", type: "long", durationMin: Math.round(totalMin * 0.16), notes: `Long run — build to ${raceDistance === "Full" ? "2-3 hours" : "1.5-2 hours"} in later base weeks.` },
    ];
  }

  if (phase === "Build") {
    return [
      { day: "Mon", discipline: "rest", type: "rest", durationMin: 0, notes: "Rest day." },
      { day: "Tue", discipline: "swim", type: "intervals", durationMin: Math.round(totalMin * 0.12), notes: "Threshold swim. 4-6×200m at CSS pace, 30s rest." },
      { day: "Wed", discipline: "bike", type: "tempo", durationMin: Math.round(totalMin * 0.18), notes: "2×20 min at 75-80% FTP. Build race effort." },
      { day: "Thu", discipline: "run", type: "tempo", durationMin: Math.round(totalMin * 0.12), notes: "Tempo run: 20-30 min at race pace." },
      { day: "Fri", discipline: "swim", type: "easy", durationMin: Math.round(totalMin * 0.08), notes: "Recovery swim. Easy + drills." },
      { day: "Sat", discipline: "brick", type: "brick", durationMin: Math.round(totalMin * 0.28), notes: `Race simulation brick: ${raceDistance === "Full" ? "3-4h bike → 45 min run" : "2h bike → 30 min run"}` },
      { day: "Sun", discipline: "run", type: "long", durationMin: Math.round(totalMin * 0.14), notes: "Long easy run. Aerobic base maintenance." },
    ];
  }

  // Peak
  return [
    { day: "Mon", discipline: "rest", type: "rest", durationMin: 0, notes: "Full rest. You're peaking — recovery counts." },
    { day: "Tue", discipline: "swim", type: "race_sim", durationMin: Math.round(totalMin * 0.12), notes: `Race simulation swim: ${raceDistance === "Full" ? "3800m" : "1900m"} open water if possible.` },
    { day: "Wed", discipline: "bike", type: "intervals", durationMin: Math.round(totalMin * 0.18), notes: "4×10 min at race effort. Accumulate race fatigue." },
    { day: "Thu", discipline: "run", type: "race_sim", durationMin: Math.round(totalMin * 0.12), notes: "Race pace run off the bike. Train T2 transitions." },
    { day: "Fri", discipline: "swim", type: "easy", durationMin: Math.round(totalMin * 0.08), notes: "Short recovery swim." },
    { day: "Sat", discipline: "brick", type: "race_sim", durationMin: Math.round(totalMin * 0.32), notes: `Full race sim: ${raceDistance === "Full" ? "4-5h bike → 60 min run" : "2.5h bike → 40 min run"}` },
    { day: "Sun", discipline: "run", type: "easy", durationMin: Math.round(totalMin * 0.10), notes: "Easy recovery run. Shake the legs out." },
  ];
}

// ── Main generator ───────────────────────────────────────────────────────────

export function generatePrepPlan(
  raceId: string,
  raceName: string,
  raceDate: string,
  raceDistance: RaceDistanceGoal,
  swimLevel: DisciplineLevel | null,
  bikeLevel: DisciplineLevel | null,
  runLevel: DisciplineLevel | null,
): PrepPlan {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  // Start on nearest Monday
  const dayOfWeek = startDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
  startDate.setDate(startDate.getDate() + daysToMonday);

  const [ry, rm, rd] = raceDate.split("-").map(Number);
  const raceDateObj = new Date(ry, rm - 1, rd);
  raceDateObj.setHours(0, 0, 0, 0);

  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const totalWeeks = Math.max(1, Math.ceil((raceDateObj.getTime() - startDate.getTime()) / msPerWeek));

  const dist = raceDistance ?? "70.3";
  const levelCat = getLevelCategory(swimLevel, bikeLevel, runLevel);
  const baseHours = BASE_WEEKLY_HOURS[dist]?.[levelCat] ?? BASE_WEEKLY_HOURS["70.3"].beginner;
  const phaseDist = getPhaseDistribution(totalWeeks);

  // How many weeks per phase
  const raceWeek = 1;
  const remainingWeeks = totalWeeks - raceWeek;
  const taperWeeks = Math.max(1, Math.round(remainingWeeks * phaseDist.taper));
  const peakWeeks  = Math.max(1, Math.round(remainingWeeks * phaseDist.peak));
  const buildWeeks = Math.max(1, Math.round(remainingWeeks * phaseDist.build));
  const baseWeeks  = Math.max(0, remainingWeeks - taperWeeks - peakWeeks - buildWeeks);

  // Build phase sequence
  const phases: PrepPhase[] = [
    ...Array(baseWeeks).fill("Base"),
    ...Array(buildWeeks).fill("Build"),
    ...Array(peakWeeks).fill("Peak"),
    ...Array(taperWeeks).fill("Taper"),
    "Race Week",
  ].slice(0, totalWeeks) as PrepPhase[];

  // Find current week index
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentWeekIndex = Math.max(0, Math.min(
    totalWeeks - 1,
    Math.floor((today.getTime() - startDate.getTime()) / msPerWeek)
  ));

  const weeks: PrepPlanWeek[] = phases.map((phase, i) => {
    const weekStart = new Date(startDate.getTime() + i * msPerWeek);
    const weekOf = weekStart.toISOString().split("T")[0];

    // Progressive volume: 10% increase per week, deload every 4th week
    const isDeloadWeek = (i + 1) % 4 === 0;
    const progressFactor = phase === "Taper" ? 0.6
      : phase === "Race Week" ? 0.2
      : Math.min(1.5, 1 + (i * 0.05)); // cap at 150% of base
    const weekHours = baseHours * progressFactor * (isDeloadWeek ? 0.65 : 1.0);

    const themesForPhase = PHASE_THEMES[phase];
    const theme = isDeloadWeek ? "Recovery Week — Deload" : themesForPhase[i % themesForPhase.length];

    const sessionTemplates = getWeekSessions(phase, weekHours, dist, i + 1, isDeloadWeek);

    const sessions: PrepSession[] = sessionTemplates.map((t, si) => ({
      id: `w${i + 1}-s${si + 1}`,
      day: t.day,
      discipline: t.discipline,
      type: t.type,
      durationMin: Math.max(0, t.durationMin),
      notes: t.notes,
      completed: false,
      isEditable: true,
    }));

    return {
      weekNumber: i + 1,
      weekOf,
      phase,
      theme: isDeloadWeek ? "Recovery Week — Deload" : theme,
      totalHours: Math.round(weekHours * 10) / 10,
      sessions,
    };
  });

  return {
    id: `prep-${raceId}-${Date.now()}`,
    raceId,
    raceName,
    raceDate,
    createdAt: new Date().toISOString(),
    totalWeeks,
    weeks,
    isAutoGenerated: true,
    currentWeekIndex,
  };
}
