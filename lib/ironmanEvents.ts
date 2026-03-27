// ============================================================
// IRONMAN 70.3 WORLD EVENTS — 2026 Calendar
// Source: ironman.com/triathlon/events
// ============================================================

export interface IronmanEvent {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  date: string; // ISO format YYYY-MM-DD
  distance: "70.3" | "Full";
  isWorldChampionship?: boolean;
  registrationUrl?: string;
}

export const IRONMAN_EVENTS_2026: IronmanEvent[] = [
  // Q1
  { id: "703-oman-2026", name: "IRONMAN 70.3 Oman", location: "Muscat", country: "Oman", flag: "🇴🇲", date: "2026-01-17", distance: "70.3" },
  { id: "703-dubai-2026", name: "IRONMAN 70.3 Dubai", location: "Dubai", country: "UAE", flag: "🇦🇪", date: "2026-02-06", distance: "70.3" },
  { id: "703-buenos-aires-2026", name: "IRONMAN 70.3 Buenos Aires", location: "Buenos Aires", country: "Argentina", flag: "🇦🇷", date: "2026-02-08", distance: "70.3" },
  { id: "703-cape-town-2026", name: "IRONMAN 70.3 Cape Town", location: "Cape Town", country: "South Africa", flag: "🇿🇦", date: "2026-02-22", distance: "70.3" },
  { id: "703-aix-2026", name: "IRONMAN 70.3 Aix-en-Provence", location: "Aix-en-Provence", country: "France", flag: "🇫🇷", date: "2026-03-22", distance: "70.3" },
  { id: "703-vietnam-2026", name: "IRONMAN 70.3 Vietnam", location: "Da Nang", country: "Vietnam", flag: "🇻🇳", date: "2026-03-29", distance: "70.3" },

  // Q2
  { id: "703-mallorca-2026", name: "IRONMAN 70.3 Mallorca", location: "Mallorca", country: "Spain", flag: "🇪🇸", date: "2026-04-18", distance: "70.3" },
  { id: "703-lanzarote-2026", name: "IRONMAN Lanzarote", location: "Lanzarote", country: "Spain", flag: "🇪🇸", date: "2026-05-16", distance: "Full" },
  { id: "703-lisbon-2026", name: "IRONMAN 70.3 Lisbon", location: "Lisbon", country: "Portugal", flag: "🇵🇹", date: "2026-05-03", distance: "70.3" },
  { id: "703-st-george-2026", name: "IRONMAN 70.3 St. George", location: "St. George, Utah", country: "USA", flag: "🇺🇸", date: "2026-05-02", distance: "70.3" },
  { id: "703-texas-2026", name: "IRONMAN 70.3 Texas", location: "Galveston", country: "USA", flag: "🇺🇸", date: "2026-04-05", distance: "70.3" },
  { id: "703-italy-2026", name: "IRONMAN 70.3 Italy", location: "Pescara", country: "Italy", flag: "🇮🇹", date: "2026-05-17", distance: "70.3" },
  { id: "703-switzerland-2026", name: "IRONMAN 70.3 Switzerland", location: "Rapperswil", country: "Switzerland", flag: "🇨🇭", date: "2026-06-07", distance: "70.3" },
  { id: "703-eagleman-2026", name: "IRONMAN 70.3 Eagleman", location: "Cambridge, MD", country: "USA", flag: "🇺🇸", date: "2026-06-14", distance: "70.3" },
  { id: "703-hawaii-2026", name: "IRONMAN 70.3 Hawaii", location: "Hilo, Hawaii", country: "USA", flag: "🇺🇸", date: "2026-06-07", distance: "70.3" },
  { id: "703-kraichgau-2026", name: "IRONMAN 70.3 Kraichgau", location: "Kraichgau", country: "Germany", flag: "🇩🇪", date: "2026-06-07", distance: "70.3" },

  // Q3
  { id: "703-austria-2026", name: "IRONMAN Austria", location: "Klagenfurt", country: "Austria", flag: "🇦🇹", date: "2026-06-28", distance: "Full" },
  { id: "703-hamburg-2026", name: "IRONMAN 70.3 Hamburg", location: "Hamburg", country: "Germany", flag: "🇩🇪", date: "2026-07-12", distance: "70.3" },
  { id: "703-france-2026", name: "IRONMAN France", location: "Nice", country: "France", flag: "🇫🇷", date: "2026-06-28", distance: "Full" },
  { id: "703-coeur-dalene-2026", name: "IRONMAN 70.3 Coeur d'Alene", location: "Coeur d'Alene, ID", country: "USA", flag: "🇺🇸", date: "2026-07-19", distance: "70.3" },
  { id: "703-uk-2026", name: "IRONMAN UK", location: "Bolton", country: "UK", flag: "🇬🇧", date: "2026-07-19", distance: "Full" },
  { id: "703-finland-2026", name: "IRONMAN 70.3 Finland", location: "Lahti", country: "Finland", flag: "🇫🇮", date: "2026-07-26", distance: "70.3" },
  { id: "703-tallinn-2026", name: "IRONMAN 70.3 Tallinn", location: "Tallinn", country: "Estonia", flag: "🇪🇪", date: "2026-08-02", distance: "70.3" },
  { id: "703-oslo-2026", name: "IRONMAN 70.3 Oslo", location: "Oslo", country: "Norway", flag: "🇳🇴", date: "2026-08-09", distance: "70.3" },
  { id: "703-canada-2026", name: "IRONMAN Canada", location: "Whistler, BC", country: "Canada", flag: "🇨🇦", date: "2026-07-26", distance: "Full" },
  { id: "703-cascais-2026", name: "IRONMAN 70.3 Cascais", location: "Cascais", country: "Portugal", flag: "🇵🇹", date: "2026-09-06", distance: "70.3" },
  { id: "703-world-champ-2026", name: "IRONMAN 70.3 World Championship", location: "Taupo", country: "New Zealand", flag: "🇳🇿", date: "2026-09-05", distance: "70.3", isWorldChampionship: true },

  // Q4
  { id: "703-brazil-2026", name: "IRONMAN 70.3 Brazil", location: "Florianopolis", country: "Brazil", flag: "🇧🇷", date: "2026-10-04", distance: "70.3" },
  { id: "703-kona-2026", name: "IRONMAN World Championship", location: "Kailua-Kona, Hawaii", country: "USA", flag: "🇺🇸", date: "2026-10-10", distance: "Full", isWorldChampionship: true },
  { id: "703-barcelona-2026", name: "IRONMAN 70.3 Barcelona", location: "Barcelona", country: "Spain", flag: "🇪🇸", date: "2026-10-04", distance: "70.3" },
  { id: "703-miami-2026", name: "IRONMAN 70.3 Miami", location: "Miami", country: "USA", flag: "🇺🇸", date: "2026-10-25", distance: "70.3" },
  { id: "703-panama-2026", name: "IRONMAN 70.3 Panama", location: "Panama City", country: "Panama", flag: "🇵🇦", date: "2026-11-08", distance: "70.3" },
  { id: "703-cozumel-2026", name: "IRONMAN Cozumel", location: "Cozumel", country: "Mexico", flag: "🇲🇽", date: "2026-11-22", distance: "Full" },
  { id: "703-arizona-2026", name: "IRONMAN Arizona", location: "Tempe, AZ", country: "USA", flag: "🇺🇸", date: "2026-11-15", distance: "Full" },
  { id: "703-florida-2026", name: "IRONMAN Florida", location: "Panama City Beach", country: "USA", flag: "🇺🇸", date: "2026-11-07", distance: "Full" },
  { id: "703-curacao-2026", name: "IRONMAN 70.3 Curaçao", location: "Curaçao", country: "Netherlands Antilles", flag: "🇨🇼", date: "2026-12-06", distance: "70.3" },
];

/**
 * Get upcoming events sorted by date
 */
export function getUpcomingEvents(limit = 10): IronmanEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return IRONMAN_EVENTS_2026
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
}

/**
 * Get days until an event
 */
export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(dateStr);
  event.setHours(0, 0, 0, 0);
  return Math.ceil((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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
export function getEventsByDistance(distance: "70.3" | "Full"): IronmanEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return IRONMAN_EVENTS_2026
    .filter(e => e.distance === distance && new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Format event date nicely
 */
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
