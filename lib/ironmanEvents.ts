// ============================================================
// IRONMAN & IRONMAN 70.3 WORLD EVENTS — 2026/2027 Calendar
// Source: ironman.com/races (scraped March 31, 2026)
// Total events: 173
// ============================================================

export interface IronmanEvent {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  date: string;
  distance: "70.3" | "Full" | "5150";
  isWorldChampionship?: boolean;
}

export const IRONMAN_EVENTS_2026: IronmanEvent[] = [
  // ── APRIL 2026 ────────────────────────────────────────
  { id: "im-penghu-2026", name: "IRONMAN Penghu", location: "Penghu", country: "Chinese Taipei", flag: "🇹🇼", date: "2026-04-12", distance: "Full" },
  { id: "im703-puerto-varas-2026", name: "IRONMAN 70.3 Puerto Varas", location: "Puerto Varas", country: "Chile", flag: "🇨🇱", date: "2026-04-12", distance: "70.3" },
  { id: "5150-nelson-mandela-bay-2026", name: "5150 Nelson Mandela Bay", location: "Nelson Mandela Bay Metropolitan Municipality", country: "South Africa", flag: "🇿🇦", date: "2026-04-18", distance: "5150" },
  { id: "im-texas-2026", name: "IRONMAN Texas", location: "The Woodlands", country: "USA", flag: "🇺🇸", date: "2026-04-18", distance: "Full" },
  { id: "im-south-africa-2026", name: "IRONMAN South Africa", location: "Port Elizabeth", country: "South Africa", flag: "🇿🇦", date: "2026-04-19", distance: "Full" },
  { id: "im703-valencia-2026", name: "IRONMAN 70.3 Valencia", location: "Valencia", country: "Spain", flag: "🇪🇸", date: "2026-04-19", distance: "70.3" },
  { id: "im703-los-cabos-2026", name: "IRONMAN 70.3 Los Cabos", location: "Los Cabos", country: "Mexico", flag: "🇲🇽", date: "2026-04-26", distance: "70.3" },
  { id: "im703-peru-2026", name: "IRONMAN 70.3 Peru", location: "Lima", country: "Peru", flag: "🇵🇪", date: "2026-04-26", distance: "70.3" },
  { id: "im703-brasilia-2026", name: "IRONMAN 70.3 Brasilia", location: "DF", country: "Brazil", flag: "🇧🇷", date: "2026-04-26", distance: "70.3" },
  // ── MAY 2026 ──────────────────────────────────────────
  { id: "5150-camiguin-2026", name: "5150 Camiguin", location: "Camiguin", country: "Philippines", flag: "🇵🇭", date: "2026-05-03", distance: "5150" },
  { id: "im703-western-sydney-2026", name: "IRONMAN 70.3 Western Sydney", location: "Penrith", country: "Australia", flag: "🇦🇺", date: "2026-05-03", distance: "70.3" },
  { id: "im703-venice-jesolo-2026", name: "IRONMAN 70.3 Venice-Jesolo", location: "Jesolo", country: "Italy", flag: "🇮🇹", date: "2026-05-03", distance: "70.3" },
  { id: "5150-encarnacion-2026", name: "5150 Encarnación", location: "Encarnacion", country: "Paraguay", flag: "🇵🇾", date: "2026-05-03", distance: "5150" },
  { id: "im703-gulf-coast-2026", name: "IRONMAN 70.3 Gulf Coast", location: "Panama City Beach", country: "USA", flag: "🇺🇸", date: "2026-05-09", distance: "70.3" },
  { id: "im703-mallorca-2026", name: "IRONMAN 70.3 Alcúdia-Mallorca", location: "Alcúdia", country: "Spain", flag: "🇪🇸", date: "2026-05-09", distance: "70.3" },
  { id: "im-vietnam-2026", name: "IRONMAN Vietnam", location: "Da Nang", country: "Vietnam", flag: "🇻🇳", date: "2026-05-10", distance: "Full" },
  { id: "im703-danang-2026", name: "IRONMAN 70.3 Da Nang", location: "Danang", country: "Vietnam", flag: "🇻🇳", date: "2026-05-10", distance: "70.3" },
  { id: "im-jacksonville-2026", name: "IRONMAN Jacksonville", location: "Jacksonville", country: "USA", flag: "🇺🇸", date: "2026-05-16", distance: "Full" },
  { id: "im703-cap-cana-2026", name: "IRONMAN 70.3 Cap Cana", location: "Cap Cana", country: "Dominican Republic", flag: "🇩🇴", date: "2026-05-17", distance: "70.3" },
  { id: "im703-aix-en-provence-2026", name: "IRONMAN 70.3 Aix-en-Provence", location: "Aix en Provence", country: "France", flag: "🇫🇷", date: "2026-05-17", distance: "70.3" },
  { id: "im703-shanghai-chongming-2026", name: "IRONMAN 70.3 Shanghai Chongming", location: "Shanghai", country: "China", flag: "🇨🇳", date: "2026-05-17", distance: "70.3" },
  { id: "im703-chattanooga-2026", name: "IRONMAN 70.3 Chattanooga", location: "Chattanooga", country: "USA", flag: "🇺🇸", date: "2026-05-17", distance: "70.3" },
  { id: "im-lanzarote-2026", name: "IRONMAN Lanzarote", location: "Lanzarote", country: "Spain", flag: "🇪🇸", date: "2026-05-23", distance: "Full" },
  { id: "im703-victoria-2026", name: "IRONMAN 70.3 Victoria", location: "Victoria", country: "Canada", flag: "🇨🇦", date: "2026-05-24", distance: "70.3" },
  { id: "im703-hawaii-2026", name: "IRONMAN 70.3 Hawaii", location: "Kohala Coast", country: "USA", flag: "🇺🇸", date: "2026-05-30", distance: "70.3" },
  { id: "5150-kraichgau-2026", name: "5150 Kraichgau", location: "Kraichgau", country: "Germany", flag: "🇩🇪", date: "2026-05-31", distance: "5150" },
  { id: "im-brazil-2026", name: "IRONMAN Brazil", location: "SC", country: "Brazil", flag: "🇧🇷", date: "2026-05-31", distance: "Full" },
  // ── JUNE 2026 ─────────────────────────────────────────
  { id: "im703-bolton-2026", name: "IRONMAN 70.3 Bolton", location: "Bolton", country: "United Kingdom", flag: "🇬🇧", date: "2026-06-07", distance: "70.3" },
  { id: "im703-switzerland-2026", name: "IRONMAN 70.3 Switzerland", location: "Rapperswil-Jona", country: "Switzerland", flag: "🇨🇭", date: "2026-06-07", distance: "70.3" },
  { id: "im703-western-massachusetts-2026", name: "IRONMAN 70.3 Western Massachusetts", location: "Springfield", country: "USA", flag: "🇺🇸", date: "2026-06-07", distance: "70.3" },
  { id: "im703-barranquilla-2026", name: "IRONMAN 70.3 Barranquilla", location: "Barranquilla", country: "Colombia", flag: "🇨🇴", date: "2026-06-07", distance: "70.3" },
  { id: "im703-durban-2026", name: "IRONMAN 70.3 Durban", location: "Durban", country: "South Africa", flag: "🇿🇦", date: "2026-06-07", distance: "70.3" },
  { id: "im703-subic-bay-philippines-2026", name: "IRONMAN 70.3 Subic Bay Philippines", location: "Subic Bay", country: "Philippines", flag: "🇵🇭", date: "2026-06-07", distance: "70.3" },
  { id: "im703-omaha-2026", name: "IRONMAN 70.3 Omaha", location: "Omaha", country: "USA", flag: "🇺🇸", date: "2026-06-07", distance: "70.3" },
  { id: "im-hamburg-2026", name: "IRONMAN Hamburg", location: "Hamburg", country: "Germany", flag: "🇩🇪", date: "2026-06-07", distance: "Full" },
  { id: "im703-warsaw-2026", name: "IRONMAN 70.3 Warsaw", location: "Warsaw", country: "Poland", flag: "🇵🇱", date: "2026-06-07", distance: "70.3" },
  { id: "im-philippines-2026", name: "IRONMAN Subic Bay Philippines", location: "Subic Bay", country: "Philippines", flag: "🇵🇭", date: "2026-06-07", distance: "Full" },
  { id: "im703-alghero-2026", name: "IRONMAN 70.3 Alghero", location: "Alghero", country: "Italy", flag: "🇮🇹", date: "2026-06-07", distance: "70.3" },
  { id: "im703-boulder-2026", name: "IRONMAN 70.3 Boulder", location: "Boulder", country: "USA", flag: "🇺🇸", date: "2026-06-13", distance: "70.3" },
  { id: "im703-goseong-2026", name: "IRONMAN 70.3 Goseong", location: "Goseong", country: "South Korea", flag: "🇰🇷", date: "2026-06-14", distance: "70.3" },
  { id: "im-cairns-2026", name: "IRONMAN Cairns", location: "Cairns", country: "Australia", flag: "🇦🇺", date: "2026-06-14", distance: "Full" },
  { id: "im703-cairns-2026", name: "IRONMAN 70.3 Cairns", location: "Cairns", country: "Australia", flag: "🇦🇺", date: "2026-06-14", distance: "70.3" },
  { id: "im703-rockford-illinois-2026", name: "IRONMAN 70.3 Rockford - Illinois", location: "Rockford", country: "USA", flag: "🇺🇸", date: "2026-06-14", distance: "70.3" },
  { id: "im-austria-2026", name: "IRONMAN Kaernten-Klagenfurt, Austria", location: "Klagenfurt", country: "Austria", flag: "🇦🇹", date: "2026-06-14", distance: "Full" },
  { id: "im-tours-2026", name: "IRONMAN Tours Metropole - Loire Valley", location: "Tours", country: "France", flag: "🇫🇷", date: "2026-06-14", distance: "Full" },
  { id: "im703-pennsylvania-2026", name: "IRONMAN 70.3 Pennsylvania Happy Valley", location: "State College", country: "USA", flag: "🇺🇸", date: "2026-06-14", distance: "70.3" },
  { id: "im703-eagleman-2026", name: "IRONMAN 70.3 Eagleman", location: "Cambridge", country: "USA", flag: "🇺🇸", date: "2026-06-14", distance: "70.3" },
  { id: "4184-elsinore-2026", name: "4:18:4 Elsinore", location: "Elsinore", country: "Denmark", flag: "🇩🇰", date: "2026-06-19", distance: "Full" },
  { id: "5150-mont-tremblant-2026", name: "5150 Mont-Tremblant", location: "Mont-Tremblant", country: "Canada", flag: "🇨🇦", date: "2026-06-20", distance: "5150" },
  { id: "im703-westfriesland-2026", name: "IRONMAN 70.3 Westfriesland", location: "Hoorn", country: "Netherlands", flag: "🇳🇱", date: "2026-06-21", distance: "70.3" },
  { id: "im703-elsinore-2026", name: "IRONMAN 70.3 Elsinore", location: "Elsinore", country: "Denmark", flag: "🇩🇰", date: "2026-06-21", distance: "70.3" },
  { id: "im703-coeur-dalene-2026", name: "IRONMAN 70.3 Coeur d'Alene", location: "Coeur d'Alene", country: "USA", flag: "🇺🇸", date: "2026-06-21", distance: "70.3" },
  { id: "im703-mont-tremblant-2026", name: "IRONMAN 70.3 Mont-Tremblant", location: "Mont-Tremblant", country: "Canada", flag: "🇨🇦", date: "2026-06-21", distance: "70.3" },
  { id: "5150-westfriesland-2026", name: "5150 Westfriesland", location: "Hoorn", country: "Netherlands", flag: "🇳🇱", date: "2026-06-21", distance: "5150" },
  { id: "im-france-2026", name: "IRONMAN France", location: "Nice", country: "France", flag: "🇫🇷", date: "2026-06-28", distance: "Full" },
  { id: "im703-nice-2026", name: "IRONMAN 70.3 Nice", location: "Nice", country: "France", flag: "🇫🇷", date: "2026-06-28", distance: "70.3" },
  { id: "im-frankfurt-2026", name: "IRONMAN Frankfurt", location: "Frankfurt", country: "Germany", flag: "🇩🇪", date: "2026-06-28", distance: "Full" },
  // ── JULY 2026 ─────────────────────────────────────────
  { id: "4184-jonkoping-2026", name: "4:18:4 Jönköping", location: "Jönköping", country: "Sweden", flag: "🇸🇪", date: "2026-07-04", distance: "Full" },
  { id: "im-switzerland-2026", name: "IRONMAN Switzerland Thun", location: "Thun", country: "Switzerland", flag: "🇨🇭", date: "2026-07-05", distance: "Full" },
  { id: "im703-muskoka-2026", name: "IRONMAN 70.3 Muskoka", location: "Huntsville", country: "Canada", flag: "🇨🇦", date: "2026-07-05", distance: "70.3" },
  { id: "im703-les-sables-dolonne-2026", name: "IRONMAN 70.3 Les Sables d'Olonne", location: "Les Sables d'Olonne", country: "France", flag: "🇫🇷", date: "2026-07-05", distance: "70.3" },
  { id: "5150-ruidoso-new-mexico-2026", name: "5150 Ruidoso New Mexico", location: "Ruidoso", country: "USA", flag: "🇺🇸", date: "2026-07-11", distance: "5150" },
  { id: "im703-muncie-2026", name: "IRONMAN 70.3 Muncie", location: "Muncie", country: "USA", flag: "🇺🇸", date: "2026-07-11", distance: "70.3" },
  { id: "5150-desaru-coast-2026", name: "5150 Desaru Coast", location: "Desaru", country: "Malaysia", flag: "🇲🇾", date: "2026-07-11", distance: "5150" },
  { id: "im703-versailles-2026", name: "IRONMAN 70.3 Versailles", location: "Versailles", country: "France", flag: "🇫🇷", date: "2026-07-12", distance: "70.3" },
  { id: "im703-luxembourg-2026", name: "IRONMAN 70.3 Luxembourg", location: "Moselle", country: "Luxembourg", flag: "🇱🇺", date: "2026-07-12", distance: "70.3" },
  { id: "im703-vitoria-2026", name: "IRONMAN 70.3 Vitoria-Gasteiz", location: "Vitoria-Gasteiz", country: "Spain", flag: "🇪🇸", date: "2026-07-12", distance: "70.3" },
  { id: "im-vitoria-2026", name: "IRONMAN Vitoria-Gasteiz", location: "Vitoria-Gasteiz", country: "Spain", flag: "🇪🇸", date: "2026-07-12", distance: "Full" },
  { id: "im703-ruidoso-new-mexico-2026", name: "IRONMAN 70.3 Ruidoso New Mexico", location: "Ruidoso", country: "USA", flag: "🇺🇸", date: "2026-07-12", distance: "70.3" },
  { id: "5150-bohol-2026", name: "5150 Bohol Philippines", location: "Panglao", country: "Philippines", flag: "🇵🇭", date: "2026-07-12", distance: "5150" },
  { id: "im703-desaru-coast-2026", name: "IRONMAN 70.3 Desaru Coast", location: "Desaru", country: "Malaysia", flag: "🇲🇾", date: "2026-07-12", distance: "70.3" },
  { id: "im703-swansea-2026", name: "IRONMAN 70.3 Swansea", location: "Swansea Bay", country: "United Kingdom", flag: "🇬🇧", date: "2026-07-12", distance: "70.3" },
  { id: "5150-gdynia-2026", name: "5150 Gdynia", location: "Gdynia", country: "Poland", flag: "🇵🇱", date: "2026-07-19", distance: "5150" },
  { id: "im703-ohio-2026", name: "IRONMAN 70.3 Ohio", location: "Sandusky", country: "USA", flag: "🇺🇸", date: "2026-07-19", distance: "70.3" },
  { id: "im703-gdynia-2026", name: "IRONMAN 70.3 Gdynia", location: "Gdynia", country: "Poland", flag: "🇵🇱", date: "2026-07-19", distance: "70.3" },
  { id: "im703-oregon-2026", name: "IRONMAN 70.3 Oregon", location: "Salem", country: "USA", flag: "🇺🇸", date: "2026-07-19", distance: "70.3" },
  { id: "im-lake-placid-2026", name: "IRONMAN Lake Placid", location: "Lake Placid", country: "USA", flag: "🇺🇸", date: "2026-07-19", distance: "Full" },
  { id: "im703-ecuador-2026", name: "IRONMAN 70.3 Ecuador", location: "Manta", country: "Ecuador", flag: "🇪🇨", date: "2026-07-19", distance: "70.3" },
  { id: "im703-boise-2026", name: "IRONMAN 70.3 Boise", location: "Boise", country: "USA", flag: "🇺🇸", date: "2026-07-25", distance: "70.3" },
  { id: "im703-maine-2026", name: "IRONMAN 70.3 Maine", location: "Augusta", country: "USA", flag: "🇺🇸", date: "2026-07-26", distance: "70.3" },
  { id: "im703-calgary-2026", name: "IRONMAN 70.3 Calgary", location: "Calgary", country: "Canada", flag: "🇨🇦", date: "2026-07-26", distance: "70.3" },
  // ── AUGUST 2026 ───────────────────────────────────────
  { id: "im703-krakow-2026", name: "IRONMAN 70.3 Krakow", location: "Krakow", country: "Poland", flag: "🇵🇱", date: "2026-08-02", distance: "70.3" },
  { id: "im-canada-ottawa-2026", name: "IRONMAN Canada-Ottawa", location: "Ottawa", country: "Canada", flag: "🇨🇦", date: "2026-08-02", distance: "Full" },
  { id: "im703-rio-de-janeiro-2026", name: "IRONMAN 70.3 Rio de Janeiro", location: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷", date: "2026-08-09", distance: "70.3" },
  { id: "im703-cebu-philippines-2026", name: "IRONMAN 70.3 Philippines", location: "Lapu Lapu City", country: "Philippines", flag: "🇵🇭", date: "2026-08-09", distance: "70.3" },
  { id: "4184-kalmar-2026", name: "4:18:4 Kalmar", location: "Kalmar", country: "Sweden", flag: "🇸🇪", date: "2026-08-12", distance: "Full" },
  { id: "4184-copenhagen-2026", name: "4:18:4 Copenhagen", location: "Copenhagen", country: "Denmark", flag: "🇩🇰", date: "2026-08-14", distance: "Full" },
  { id: "im-kalmar-2026", name: "IRONMAN Kalmar-Sweden", location: "Kalmar", country: "Sweden", flag: "🇸🇪", date: "2026-08-15", distance: "Full" },
  { id: "5150-hradec-kralove-2026", name: "5150 Hradec Králové", location: "Hradec Králové", country: "Czechia", flag: "🇨🇿", date: "2026-08-16", distance: "5150" },
  { id: "im703-duisburg-2026", name: "IRONMAN 70.3 Duisburg", location: "Duisburg", country: "Germany", flag: "🇩🇪", date: "2026-08-16", distance: "70.3" },
  { id: "im703-hradec-kralove-2026", name: "IRONMAN 70.3 Hradec Králové", location: "Hradec Králové", country: "Czechia", flag: "🇨🇿", date: "2026-08-16", distance: "70.3" },
  { id: "im-leeds-2026", name: "IRONMAN Leeds", location: "Leeds", country: "United Kingdom", flag: "🇬🇧", date: "2026-08-16", distance: "Full" },
  { id: "im-copenhagen-2026", name: "IRONMAN Copenhagen", location: "Copenhagen", country: "Denmark", flag: "🇩🇰", date: "2026-08-16", distance: "Full" },
  { id: "im703-northern-california-2026", name: "IRONMAN 70.3 Northern California", location: "Redding", country: "USA", flag: "🇺🇸", date: "2026-08-16", distance: "70.3" },
  { id: "im-tallinn-2026", name: "IRONMAN Tallinn", location: "Tallinn", country: "Estonia", flag: "🇪🇪", date: "2026-08-22", distance: "Full" },
  { id: "im703-tallinn-2026", name: "IRONMAN 70.3 Tallinn", location: "Tallinn", country: "Estonia", flag: "🇪🇪", date: "2026-08-23", distance: "70.3" },
  { id: "im703-leipzig-2026", name: "IRONMAN 70.3 Leipzig", location: "Leipzig", country: "Germany", flag: "🇩🇪", date: "2026-08-23", distance: "70.3" },
  { id: "im-vichy-2026", name: "IRONMAN Vichy", location: "Vichy", country: "France", flag: "🇫🇷", date: "2026-08-23", distance: "Full" },
  { id: "im703-vichy-2026", name: "IRONMAN 70.3 Vichy", location: "Vichy", country: "France", flag: "🇫🇷", date: "2026-08-23", distance: "70.3" },
  { id: "5150-poznan-2026", name: "5150 Poznan", location: "Poznan", country: "Poland", flag: "🇵🇱", date: "2026-08-30", distance: "5150" },
  { id: "im703-poznan-2026", name: "IRONMAN 70.3 Poznan", location: "Poznan", country: "Poland", flag: "🇵🇱", date: "2026-08-30", distance: "70.3" },
  { id: "im703-zell-am-see-2026", name: "IRONMAN 70.3 Zell am See-Kaprun", location: "Zell am See", country: "Austria", flag: "🇦🇹", date: "2026-08-30", distance: "70.3" },
  // ── SEPTEMBER 2026 ────────────────────────────────────
  { id: "im703-baku-2026", name: "IRONMAN 70.3 Baku", location: "Baku", country: "Azerbaijan", flag: "🇦🇿", date: "2026-09-05", distance: "70.3" },
  { id: "5150-knokke-heist-2026", name: "5150 Knokke-Heist", location: "Knokke-Heist", country: "Belgium", flag: "🇧🇪", date: "2026-09-05", distance: "5150" },
  { id: "im703-knokke-heist-2026", name: "IRONMAN 70.3 Knokke-Heist", location: "Knokke-Heist", country: "Belgium", flag: "🇧🇪", date: "2026-09-06", distance: "70.3" },
  { id: "5150-cartagena-2026", name: "5150 Cartagena", location: "Cartagena", country: "Colombia", flag: "🇨🇴", date: "2026-09-06", distance: "5150" },
  { id: "5150-erkner-2026", name: "5150 Erkner", location: "Erkner", country: "Germany", flag: "🇩🇪", date: "2026-09-12", distance: "5150" },
  { id: "im703-wisconsin-2026", name: "IRONMAN 70.3 Wisconsin", location: "Madison", country: "USA", flag: "🇺🇸", date: "2026-09-12", distance: "70.3" },
  { id: "im703-world-championship-2026-2026", name: "IRONMAN 70.3 World Championship", location: "Nice", country: "France", flag: "🇫🇷", date: "2026-09-12", distance: "70.3", isWorldChampionship: true },
  { id: "im703-sunshine-coast-2026", name: "IRONMAN 70.3 Sunshine Coast", location: "Mooloolaba", country: "Australia", flag: "🇦🇺", date: "2026-09-13", distance: "70.3" },
  { id: "im-wales-2026", name: "IRONMAN Wales", location: "Pembrokeshire", country: "United Kingdom", flag: "🇬🇧", date: "2026-09-13", distance: "Full" },
  { id: "im703-santa-cruz-2026", name: "IRONMAN 70.3 Santa Cruz", location: "Santa Cruz", country: "USA", flag: "🇺🇸", date: "2026-09-13", distance: "70.3" },
  { id: "im-south-hokkaido-2026", name: "IRONMAN Japan South Hokkaido", location: "Hokkaido", country: "Japan", flag: "🇯🇵", date: "2026-09-13", distance: "Full" },
  { id: "im703-belgrade-2026", name: "IRONMAN 70.3 Belgrade", location: "Belgrade", country: "Serbia", flag: "🇷🇸", date: "2026-09-13", distance: "70.3" },
  { id: "im703-erkner-2026", name: "IRONMAN 70.3 Erkner", location: "Erkner", country: "Germany", flag: "🇩🇪", date: "2026-09-13", distance: "70.3" },
  { id: "im-wisconsin-2026", name: "IRONMAN Wisconsin", location: "Madison", country: "USA", flag: "🇺🇸", date: "2026-09-13", distance: "Full" },
  { id: "im703-dali-2026", name: "IRONMAN 70.3 Dali", location: "Dali", country: "China", flag: "🇨🇳", date: "2026-09-13", distance: "70.3" },
  { id: "im-maryland-2026", name: "IRONMAN Maryland", location: "Cambridge", country: "USA", flag: "🇺🇸", date: "2026-09-19", distance: "Full" },
  { id: "im-emilia-romagna-2026", name: "IRONMAN Italy Emilia Romagna", location: "Cervia", country: "Italy", flag: "🇮🇹", date: "2026-09-19", distance: "Full" },
  { id: "5150-samal-2026", name: "5150 Samal", location: "Samal", country: "Philippines", flag: "🇵🇭", date: "2026-09-20", distance: "5150" },
  { id: "im703-michigan-2026", name: "IRONMAN 70.3 Michigan", location: "Frankfort", country: "USA", flag: "🇺🇸", date: "2026-09-20", distance: "70.3" },
  { id: "im703-weymouth-2026", name: "IRONMAN 70.3 Weymouth", location: "Weymouth", country: "United Kingdom", flag: "🇬🇧", date: "2026-09-20", distance: "70.3" },
  { id: "im703-washington-tri-cities-2026", name: "IRONMAN 70.3 Washington Tri-Cities", location: "Richland", country: "USA", flag: "🇺🇸", date: "2026-09-20", distance: "70.3" },
  { id: "im703-emilia-romagna-2026", name: "IRONMAN 70.3 Emilia Romagna", location: "Cervia", country: "Italy", flag: "🇮🇹", date: "2026-09-20", distance: "70.3" },
  { id: "im703-cozumel-2026", name: "IRONMAN 70.3 Cozumel", location: "Cozumel", country: "Mexico", flag: "🇲🇽", date: "2026-09-20", distance: "70.3" },
  { id: "5150-cervia-2026", name: "5150 Cervia", location: "Cervia", country: "Italy", flag: "🇮🇹", date: "2026-09-20", distance: "5150" },
  { id: "im703-new-york-2026", name: "IRONMAN 70.3 New York", location: "Jones Beach", country: "USA", flag: "🇺🇸", date: "2026-09-26", distance: "70.3" },
  { id: "im-chattanooga-2026", name: "IRONMAN Chattanooga", location: "Chattanooga", country: "USA", flag: "🇺🇸", date: "2026-09-27", distance: "Full" },
  { id: "im703-augusta-2026", name: "IRONMAN 70.3 Augusta", location: "Augusta", country: "USA", flag: "🇺🇸", date: "2026-09-27", distance: "70.3" },
  // ── OCTOBER 2026 ──────────────────────────────────────
  { id: "im703-waco-2026", name: "IRONMAN 70.3 Waco", location: "Waco", country: "USA", flag: "🇺🇸", date: "2026-10-04", distance: "70.3" },
  { id: "5150-coquimbo-2026", name: "5150 Coquimbo", location: "Coquimbo", country: "Chile", flag: "🇨🇱", date: "2026-10-04", distance: "5150" },
  { id: "im-barcelona-2026", name: "IRONMAN Calella-Barcelona", location: "Calella", country: "Spain", flag: "🇪🇸", date: "2026-10-04", distance: "Full" },
  { id: "im-gurye-2026", name: "IRONMAN Gurye Korea", location: "Gurye", country: "South Korea", flag: "🇰🇷", date: "2026-10-04", distance: "Full" },
  { id: "im703-buenos-aires-2026", name: "IRONMAN 70.3 Buenos Aires Palermo", location: "Buenos Aires", country: "Argentina", flag: "🇦🇷", date: "2026-10-04", distance: "70.3" },
  { id: "im-world-championship-kona-2026", name: "IRONMAN World Championship", location: "Kona", country: "USA", flag: "🇺🇸", date: "2026-10-10", distance: "Full", isWorldChampionship: true },
  { id: "im703-encarnacion-2026", name: "IRONMAN 70.3 Encarnacion", location: "Encarnacion", country: "Paraguay", flag: "🇵🇾", date: "2026-10-11", distance: "70.3" },
  { id: "im703-sharm-el-sheikh-2026", name: "IRONMAN 70.3 Sharm El-Sheikh, Egypt", location: "Sharm El-Sheikh", country: "Egypt", flag: "🇪🇬", date: "2026-10-16", distance: "70.3" },
  { id: "im703-north-carolina-2026", name: "IRONMAN 70.3 North Carolina", location: "Wilmington", country: "USA", flag: "🇺🇸", date: "2026-10-17", distance: "70.3" },
  { id: "im-cascais-2026", name: "IRONMAN Portugal-Cascais", location: "Cascais", country: "Portugal", flag: "🇵🇹", date: "2026-10-17", distance: "Full" },
  { id: "im703-cascais-2026", name: "IRONMAN 70.3 Portugal-Cascais", location: "Cascais", country: "Portugal", flag: "🇵🇹", date: "2026-10-17", distance: "70.3" },
  { id: "im703-malaga-2026", name: "IRONMAN 70.3 Málaga", location: "Málaga", country: "Spain", flag: "🇪🇸", date: "2026-10-18", distance: "70.3" },
  { id: "im703-port-macquarie-2026", name: "IRONMAN 70.3 Port Macquarie", location: "Port Macquarie", country: "Australia", flag: "🇦🇺", date: "2026-10-18", distance: "70.3" },
  { id: "im-california-2026", name: "IRONMAN California", location: "Sacramento", country: "USA", flag: "🇺🇸", date: "2026-10-18", distance: "Full" },
  { id: "im703-florianopolis-2026", name: "IRONMAN 70.3 Florianopolis", location: "SC", country: "Brazil", flag: "🇧🇷", date: "2026-10-18", distance: "70.3" },
  { id: "im703-dhofar-2026", name: "IRONMAN 70.3 Dhofar", location: "Salalah", country: "Oman", flag: "🇴🇲", date: "2026-10-24", distance: "70.3" },
  { id: "im703-greece-2026", name: "IRONMAN 70.3 Costa Navarino, Peloponnese, Greece", location: "Peloponnese", country: "Greece", flag: "🇬🇷", date: "2026-10-25", distance: "70.3" },
  { id: "im703-agadir-2026", name: "IRONMAN 70.3 Agadir", location: "Agadir", country: "Morocco", flag: "🇲🇦", date: "2026-10-25", distance: "70.3" },
  { id: "5150-san-juan-2026", name: "5150 San Juan", location: "San Juan", country: "Argentina", flag: "🇦🇷", date: "2026-10-30", distance: "5150" },
  // ── NOVEMBER 2026 ─────────────────────────────────────
  { id: "im703-phu-quoc-2026", name: "IRONMAN 70.3 Phu Quoc", location: "Phu Quoc", country: "Vietnam", flag: "🇻🇳", date: "2026-11-01", distance: "70.3" },
  { id: "im703-kenting-2026", name: "IRONMAN 70.3 Kenting", location: "Kenting", country: "Chinese Taipei", flag: "🇹🇼", date: "2026-11-01", distance: "70.3" },
  { id: "im-san-juan-2026", name: "IRONMAN San Juan", location: "San Juan", country: "Argentina", flag: "🇦🇷", date: "2026-11-01", distance: "Full" },
  { id: "im-florida-2026", name: "IRONMAN Florida", location: "Panama City", country: "USA", flag: "🇺🇸", date: "2026-11-07", distance: "Full" },
  { id: "im703-campeche-2026", name: "IRONMAN 70.3 Campeche", location: "Campeche", country: "Mexico", flag: "🇲🇽", date: "2026-11-08", distance: "70.3" },
  { id: "im703-melbourne-2026", name: "IRONMAN 70.3 Melbourne", location: "St. Kilda", country: "Australia", flag: "🇦🇺", date: "2026-11-08", distance: "70.3" },
  { id: "im-malaysia-2026", name: "IRONMAN Malaysia", location: "Langkawi", country: "Malaysia", flag: "🇲🇾", date: "2026-11-21", distance: "Full" },
  { id: "im703-langkawi-2026", name: "IRONMAN 70.3 Langkawi", location: "Langkawi", country: "Malaysia", flag: "🇲🇾", date: "2026-11-21", distance: "70.3" },
  { id: "im-cozumel-2026", name: "IRONMAN Cozumel", location: "Cozumel", country: "Mexico", flag: "🇲🇽", date: "2026-11-22", distance: "Full" },
  { id: "im703-mossel-bay-2026", name: "IRONMAN 70.3 Mossel Bay", location: "Mossel Bay", country: "South Africa", flag: "🇿🇦", date: "2026-11-22", distance: "70.3" },
  { id: "im-valdivia-2026", name: "IRONMAN Valdivia", location: "Valdivia", country: "Chile", flag: "🇨🇱", date: "2026-11-29", distance: "Full" },
  { id: "im703-aracaju-sergipe-2026", name: "IRONMAN 70.3 Aracaju-Sergipe", location: "Aracaju", country: "Brazil", flag: "🇧🇷", date: "2026-11-29", distance: "70.3" },
  { id: "im703-cartagena-2026", name: "IRONMAN 70.3 Cartagena", location: "Cartagena", country: "Colombia", flag: "🇨🇴", date: "2026-11-29", distance: "70.3" },
  { id: "im703-valdivia-2026", name: "IRONMAN 70.3 Valdivia", location: "Valdivia", country: "Chile", flag: "🇨🇱", date: "2026-11-29", distance: "70.3" },
  // ── DECEMBER 2026 ─────────────────────────────────────
  { id: "im-oman-2026", name: "IRONMAN Oman", location: "Muscat", country: "Oman", flag: "🇴🇲", date: "2026-12-05", distance: "Full" },
  { id: "im-western-australia-2026", name: "IRONMAN Western Australia", location: "Busselton", country: "Australia", flag: "🇦🇺", date: "2026-12-06", distance: "Full" },
  { id: "im703-western-australia-2026", name: "IRONMAN 70.3 Western Australia", location: "Busselton", country: "Australia", flag: "🇦🇺", date: "2026-12-06", distance: "70.3" },
  { id: "im703-la-quinta-2026", name: "IRONMAN 70.3 La Quinta", location: "La Quinta", country: "USA", flag: "🇺🇸", date: "2026-12-06", distance: "70.3" },
  { id: "im703-florida-2026", name: "IRONMAN 70.3 Florida", location: "Haines City", country: "USA", flag: "🇺🇸", date: "2026-12-13", distance: "70.3" },
  // ── FEBRUARY 2027 ─────────────────────────────────────
  { id: "im703-oman-2027", name: "IRONMAN 70.3 Oman", location: "Muscat", country: "Oman", flag: "🇴🇲", date: "2027-02-06", distance: "70.3" },
  // ── MARCH 2027 ────────────────────────────────────────
  { id: "im703-san-juan-2027", name: "IRONMAN 70.3 San Juan", location: "San Juan", country: "Argentina", flag: "🇦🇷", date: "2027-03-01", distance: "70.3" },
  { id: "im703-new-zealand-2027", name: "IRONMAN 70.3 New Zealand", location: "Taupo", country: "New Zealand", flag: "🇳🇿", date: "2027-03-06", distance: "70.3" },
  { id: "im-new-zealand-2027", name: "IRONMAN New Zealand", location: "Taupo", country: "New Zealand", flag: "🇳🇿", date: "2027-03-06", distance: "Full" },
  { id: "im703-geelong-2027", name: "IRONMAN 70.3 Geelong", location: "Geelong", country: "Australia", flag: "🇦🇺", date: "2027-03-21", distance: "70.3" },
  { id: "im703-curitiba-2027", name: "IRONMAN 70.3 Curitiba", location: "Curitiba", country: "Brazil", flag: "🇧🇷", date: "2027-03-21", distance: "70.3" },
];


function parseDateLocal(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getUpcomingEvents(limit = 10): IronmanEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return IRONMAN_EVENTS_2026
    .filter(e => parseDateLocal(e.date) >= today)
    .sort((a, b) => parseDateLocal(a.date).getTime() - parseDateLocal(b.date).getTime())
    .slice(0, limit);
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = parseDateLocal(dateStr);
  return Math.round((event.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getNextEvent(): IronmanEvent | null {
  return getUpcomingEvents(1)[0] ?? null;
}

export function getEventsByDistance(distance: "70.3" | "Full" | "5150"): IronmanEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return IRONMAN_EVENTS_2026
    .filter(e => e.distance === distance && parseDateLocal(e.date) >= today)
    .sort((a, b) => parseDateLocal(a.date).getTime() - parseDateLocal(b.date).getTime());
}

export function formatEventDate(dateStr: string): string {
  const date = parseDateLocal(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
