// ============================================================
// IRONMAN & IRONMAN 70.3 WORLD EVENTS — 2026 Calendar
// Source: ironman.com/races (updated March 28, 2026)
// ============================================================

export interface IronmanEvent {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  date: string; // ISO format YYYY-MM-DD
  distance: "70.3" | "Full" | "5150";
  isWorldChampionship?: boolean;
  swimType?: string;
  bikeType?: string;
  runType?: string;
  registrationStatus?: string;
}

export const IRONMAN_EVENTS_2026: IronmanEvent[] = [
  // ── APRIL 2026 ─────────────────────────────────────────
  { id: "im-south-africa-2026", name: "IRONMAN South Africa", location: "Port Elizabeth", country: "South Africa", flag: "🇿🇦", date: "2026-04-19", distance: "Full", runType: "Rolling" },
  { id: "703-valencia-2026", name: "IRONMAN 70.3 Valencia", location: "Valencia", country: "Spain", flag: "🇪🇸", date: "2026-04-19", distance: "70.3", swimType: "Ocean", bikeType: "Rolling", runType: "Flat", registrationStatus: "Sold Out" },
  { id: "703-los-cabos-2026", name: "IRONMAN 70.3 Los Cabos", location: "Los Cabos, BCS", country: "Mexico", flag: "🇲🇽", date: "2026-04-26", distance: "70.3", swimType: "Ocean", bikeType: "Rolling", runType: "Flat" },
  { id: "703-brasilia-2026", name: "IRONMAN 70.3 Brasilia", location: "Brasilia, DF", country: "Brazil", flag: "🇧🇷", date: "2026-04-26", distance: "70.3", swimType: "Lake", bikeType: "Flat", runType: "Flat", registrationStatus: "Sold Out" },
  { id: "703-peru-2026", name: "IRONMAN 70.3 Peru", location: "Lima", country: "Peru", flag: "🇵🇪", date: "2026-04-26", distance: "70.3", swimType: "Ocean", bikeType: "Flat", runType: "Flat", registrationStatus: "Sold Out" },

  // ── MAY 2026 ───────────────────────────────────────────
  { id: "5150-camiguin-2026", name: "5150 Camiguin", location: "Camiguin", country: "Philippines", flag: "🇵🇭", date: "2026-05-03", distance: "5150", swimType: "Ocean", bikeType: "Rolling", runType: "Flat" },
  { id: "703-western-sydney-2026", name: "IRONMAN 70.3 Western Sydney", location: "Penrith, NSW", country: "Australia", flag: "🇦🇺", date: "2026-05-03", distance: "70.3", swimType: "Lake", bikeType: "Flat", runType: "Flat" },
  { id: "703-venice-jesolo-2026", name: "IRONMAN 70.3 Venice-Jesolo", location: "Jesolo", country: "Italy", flag: "🇮🇹", date: "2026-05-03", distance: "70.3", swimType: "Ocean", bikeType: "Flat", runType: "Flat", registrationStatus: "Sold Out" },
  { id: "5150-encarnacion-2026", name: "5150 Encarnación", location: "Encarnación", country: "Paraguay", flag: "🇵🇾", date: "2026-05-03", distance: "5150", swimType: "River", bikeType: "Flat", runType: "Flat" },
  { id: "703-gulf-coast-2026", name: "IRONMAN 70.3 Gulf Coast", location: "Panama City Beach, FL", country: "USA", flag: "🇺🇸", date: "2026-05-09", distance: "70.3", swimType: "Ocean", bikeType: "Flat", runType: "Flat" },
  { id: "703-mallorca-2026", name: "IRONMAN 70.3 Alcúdia-Mallorca", location: "Alcúdia", country: "Spain", flag: "🇪🇸", date: "2026-05-09", distance: "70.3", swimType: "Ocean", bikeType: "Hilly", runType: "Flat", registrationStatus: "Sold Out" },
  { id: "im-vietnam-2026", name: "IRONMAN Vietnam", location: "Da Nang", country: "Vietnam", flag: "🇻🇳", date: "2026-05-10", distance: "Full", swimType: "Ocean", bikeType: "Flat", runType: "Flat" },
  { id: "703-da-nang-2026", name: "IRONMAN 70.3 Da Nang", location: "Da Nang", country: "Vietnam", flag: "🇻🇳", date: "2026-05-10", distance: "70.3", swimType: "Ocean", bikeType: "Flat", runType: "Flat", registrationStatus: "Sold Out" },
  { id: "im-jacksonville-2026", name: "IRONMAN Jacksonville", location: "Jacksonville, FL", country: "USA", flag: "🇺🇸", date: "2026-05-16", distance: "Full", swimType: "River", bikeType: "Flat", runType: "Rolling" },
  { id: "703-cap-cana-2026", name: "IRONMAN 70.3 Cap Cana", location: "Cap Cana", country: "Dominican Republic", flag: "🇩🇴", date: "2026-05-17", distance: "70.3", swimType: "Ocean", bikeType: "Flat", runType: "Flat" },
  { id: "703-aix-2026", name: "IRONMAN 70.3 Aix-en-Provence", location: "Aix-en-Provence", country: "France", flag: "🇫🇷", date: "2026-05-17", distance: "70.3", swimType: "Lake", bikeType: "Hilly", runType: "Rolling", registrationStatus: "Sold Out" },
  { id: "703-shanghai-2026", name: "IRONMAN 70.3 Shanghai Chongming", location: "Shanghai", country: "China", flag: "🇨🇳", date: "2026-05-17", distance: "70.3", swimType: "Lake", bikeType: "Flat", runType: "Flat" },
  { id: "703-chattanooga-2026", name: "IRONMAN 70.3 Chattanooga", location: "Chattanooga, TN", country: "USA", flag: "🇺🇸", date: "2026-05-17", distance: "70.3", swimType: "River", bikeType: "Rolling", runType: "Rolling" },
  { id: "im-lanzarote-2026", name: "IRONMAN Lanzarote", location: "Lanzarote", country: "Spain", flag: "🇪🇸", date: "2026-05-23", distance: "Full", swimType: "Ocean", bikeType: "Hilly", runType: "Rolling" },
  { id: "703-victoria-2026", name: "IRONMAN 70.3 Victoria", location: "Victoria, BC", country: "Canada", flag: "🇨🇦", date: "2026-05-24", distance: "70.3", swimType: "Lake", bikeType: "Rolling", runType: "Flat" },

  // ── JUNE 2026 ──────────────────────────────────────────
  { id: "703-switzerland-2026", name: "IRONMAN 70.3 Switzerland", location: "Rapperswil", country: "Switzerland", flag: "🇨🇭", date: "2026-06-07", distance: "70.3" },
  { id: "703-kraichgau-2026", name: "IRONMAN 70.3 Kraichgau", location: "Kraichgau", country: "Germany", flag: "🇩🇪", date: "2026-06-07", distance: "70.3" },
  { id: "703-hawaii-2026", name: "IRONMAN 70.3 Hawaii", location: "Hilo, Hawaii", country: "USA", flag: "🇺🇸", date: "2026-06-07", distance: "70.3" },
  { id: "703-eagleman-2026", name: "IRONMAN 70.3 Eagleman", location: "Cambridge, MD", country: "USA", flag: "🇺🇸", date: "2026-06-14", distance: "70.3" },
  { id: "im-austria-2026", name: "IRONMAN Austria", location: "Klagenfurt", country: "Austria", flag: "🇦🇹", date: "2026-06-28", distance: "Full" },
  { id: "im-france-2026", name: "IRONMAN France", location: "Nice", country: "France", flag: "🇫🇷", date: "2026-06-28", distance: "Full" },

  // ── JULY 2026 ──────────────────────────────────────────
  { id: "703-hamburg-2026", name: "IRONMAN 70.3 Hamburg", location: "Hamburg", country: "Germany", flag: "🇩🇪", date: "2026-07-12", distance: "70.3" },
  { id: "703-coeur-dalene-2026", name: "IRONMAN 70.3 Coeur d'Alene", location: "Coeur d'Alene, ID", country: "USA", flag: "🇺🇸", date: "2026-07-19", distance: "70.3" },
  { id: "im-uk-2026", name: "IRONMAN UK", location: "Bolton", country: "United Kingdom", flag: "🇬🇧", date: "2026-07-19", distance: "Full" },
  { id: "703-finland-2026", name: "IRONMAN 70.3 Finland", location: "Lahti", country: "Finland", flag: "🇫🇮", date: "2026-07-26", distance: "70.3" },
  { id: "im-canada-2026", name: "IRONMAN Canada", location: "Whistler, BC", country: "Canada", flag: "🇨🇦", date: "2026-07-26", distance: "Full" },

  // ── AUGUST 2026 ────────────────────────────────────────
  { id: "703-tallinn-2026", name: "IRONMAN 70.3 Tallinn", location: "Tallinn", country: "Estonia", flag: "🇪🇪", date: "2026-08-02", distance: "70.3" },
  { id: "703-oslo-2026", name: "IRONMAN 70.3 Oslo", location: "Oslo", country: "Norway", flag: "🇳🇴", date: "2026-08-09", distance: "70.3" },

  // ── SEPTEMBER 2026 ─────────────────────────────────────
  { id: "703-cascais-2026", name: "IRONMAN 70.3 Cascais", location: "Cascais", country: "Portugal", flag: "🇵🇹", date: "2026-09-06", distance: "70.3" },
  { id: "703-world-champ-2026", name: "IRONMAN 70.3 World Championship", location: "Taupo", country: "New Zealand", flag: "🇳🇿", date: "2026-09-05", distance: "70.3", isWorldChampionship: true },

  // ── OCTOBER 2026 ───────────────────────────────────────
  { id: "703-brazil-2026", name: "IRONMAN 70.3 Brazil", location: "Florianópolis", country: "Brazil", flag: "🇧🇷", date: "2026-10-04", distance: "70.3" },
  { id: "703-barcelona-2026", name: "IRONMAN 70.3 Barcelona", location: "Barcelona", country: "Spain", flag: "🇪🇸", date: "2026-10-04", distance: "70.3" },
  { id: "im-kona-2026", name: "IRONMAN World Championship", location: "Kailua-Kona, Hawaii", country: "USA", flag: "🇺🇸", date: "2026-10-10", distance: "Full", isWorldChampionship: true },
  { id: "703-miami-2026", name: "IRONMAN 70.3 Miami", location: "Miami, FL", country: "USA", flag: "🇺🇸", date: "2026-10-25", distance: "70.3" },

  // ── NOVEMBER 2026 ──────────────────────────────────────
  { id: "im-florida-2026", name: "IRONMAN Florida", location: "Panama City Beach, FL", country: "USA", flag: "🇺🇸", date: "2026-11-07", distance: "Full" },
  { id: "703-panama-2026", name: "IRONMAN 70.3 Panama", location: "Panama City", country: "Panama", flag: "🇵🇦", date: "2026-11-08", distance: "70.3" },
  { id: "im-arizona-2026", name: "IRONMAN Arizona", location: "Tempe, AZ", country: "USA", flag: "🇺🇸", date: "2026-11-15", distance: "Full" },
  { id: "im-cozumel-2026", name: "IRONMAN Cozumel", location: "Cozumel", country: "Mexico", flag: "🇲🇽", date: "2026-11-22", distance: "Full" },

  // ── DECEMBER 2026 ──────────────────────────────────────
  { id: "703-curacao-2026", name: "IRONMAN 70.3 Curaçao", location: "Willemstad", country: "Curaçao", flag: "🇨🇼", date: "2026-12-06", distance: "70.3" },
];

/**
 * Get upcoming events sorted by date
 */
export function getUpcomingEvents(limit = 10): IronmanEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return IRONMAN_EVENTS_2026
    .filter(e => parseDateLocal(e.date) >= today)
    .sort((a, b) => parseDateLocal(a.date).getTime() - parseDateLocal(b.date).getTime())
    .slice(0, limit);
}

/**
 * Parse a YYYY-MM-DD string as a LOCAL date (avoids UTC midnight → day-off timezone bug)
 */
function parseDateLocal(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

/**
 * Get days until an event
 */
export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = parseDateLocal(dateStr);
  return Math.round((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get the next upcoming event
 */
export function getNextEvent(): IronmanEvent | null {
  return getUpcomingEvents(1)[0] ?? null;
}

/**
 * Get events by distance type
 */
export function getEventsByDistance(distance: "70.3" | "Full" | "5150"): IronmanEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return IRONMAN_EVENTS_2026
    .filter(e => e.distance === distance && parseDateLocal(e.date) >= today)
    .sort((a, b) => parseDateLocal(a.date).getTime() - parseDateLocal(b.date).getTime());
}

/**
 * Format event date nicely
 */
export function formatEventDate(dateStr: string): string {
  const date = parseDateLocal(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
