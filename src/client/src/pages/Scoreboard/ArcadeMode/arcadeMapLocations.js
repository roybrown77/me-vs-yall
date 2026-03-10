import L from "leaflet";

const hashStringToInt = (value = "") => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const USA_BOUNDS = L.latLngBounds(
  L.latLng(24.396308, -125.0),
  L.latLng(49.384358, -66.93457)
);

// Expanded play bounds: includes the Caribbean down to Trinidad.
// (Used for panning/zoom limits + for validating jittered marker locations.)
const ARCADE_BOUNDS = L.latLngBounds(
  L.latLng(9.5, -125.0),
  L.latLng(49.384358, -55.0)
);

const USA_CENTER = [39.5, -98.35];

// Simple island "dots" (arcade-style) so the Caribbean appears on the map.
// Radius is in meters.
const CARIBBEAN_ISLANDS = [
  { name: "Bahamas", latLng: [24.3, -76.0], radius: 70000 },
  { name: "Cuba", latLng: [21.8, -79.5], radius: 110000 },
  { name: "Jamaica", latLng: [18.1, -77.3], radius: 60000 },
  { name: "Hispaniola", latLng: [19.0, -70.7], radius: 90000 },
  { name: "Puerto Rico", latLng: [18.2, -66.4], radius: 55000 },
  // Lesser Antilles chain down to Trinidad.
  { name: "Antigua", latLng: [17.1, -61.8], radius: 28000 },
  { name: "Guadeloupe", latLng: [16.2, -61.6], radius: 30000 },
  { name: "Dominica", latLng: [15.4, -61.3], radius: 24000 },
  { name: "Martinique", latLng: [14.6, -61.0], radius: 26000 },
  { name: "St Lucia", latLng: [13.9, -60.98], radius: 24000 },
  { name: "St Vincent", latLng: [13.25, -61.2], radius: 23000 },
  { name: "Grenada", latLng: [12.1, -61.7], radius: 23000 },
  { name: "Trinidad", latLng: [10.65, -61.35], radius: 50000 },
];

// Rough polygon for the contiguous US (coarse on purpose, "arcade" style).
// This is not a traced outline; it's a simplified shape to read like the US.
const USA_POLYGON = [
  [48.8, -124.5],
  [46.5, -124.0],
  [42.0, -124.0],
  [39.0, -122.5],
  [34.5, -120.0],
  // Southern CA corner
  [32.6, -117.1],
  [32.7, -114.7],
  // Southwest / Mexico border bend
  [31.3, -111.0],
  [31.3, -106.5],
  // Texas bottom + Gulf bend
  [29.8, -104.5],
  [28.6, -101.5],
  [26.0, -97.4],
  [27.8, -97.0],
  [29.4, -94.8],
  // Gulf coast across to Florida
  [29.2, -90.2],
  [28.7, -85.5],
  [27.5, -82.7],
  // Florida peninsula + Keys
  [25.8, -82.0],
  [24.4, -81.8],
  [25.2, -80.6],
  [27.2, -80.3],
  [29.5, -80.0],
  [32.0, -79.0],
  [34.5, -77.0],
  [36.5, -75.5],
  [39.0, -74.5],
  // New England / Cape Cod hint
  [41.0, -73.5],
  [41.3, -72.7],
  [41.7, -71.8],
  [41.6, -70.9],
  [41.8, -69.95],
  [42.5, -70.7],
  [45.5, -69.0],
  [47.5, -70.5],
  [48.6, -78.0],
  [48.8, -90.0],
  [49.0, -104.0],
  [48.8, -116.0],
  [48.8, -124.5],
];

const MARKER_ANCHORS = [
  [47.6, -122.3],
  [45.5, -122.7],
  [37.8, -122.4],
  [34.0, -118.2],
  [36.2, -115.1],
  [39.7, -104.9],
  [33.4, -112.1],
  [32.8, -96.8],
  [29.8, -95.4],
  [41.9, -87.6],
  [44.9, -93.3],
  [38.6, -90.2],
  [36.2, -86.8],
  [33.7, -84.4],
  [28.5, -81.4],
  [25.8, -80.2],
  [35.2, -80.8],
  [39.1, -84.5],
  [40.4, -79.9],
  [38.9, -77.0],
  [40.7, -74.0],
  [42.36, -71.06],
];

const STATE_NAME_TO_ABBREV = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  "District of Columbia": "DC",
};

// Key format: "city,st" lowercased with spaces normalized.
const toCityKey = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const city = (parts[0] || "").toLowerCase().replace(/\s+/g, " ");
  const stateRaw = parts[1] || "";
  const stateAbbrev =
    STATE_NAME_TO_ABBREV[stateRaw] ||
    STATE_NAME_TO_ABBREV[stateRaw.replace(/\s+/g, " ")] ||
    stateRaw.toUpperCase();
  const state = stateAbbrev ? stateAbbrev.toLowerCase() : "";
  return state ? `${city},${state}` : city;
};

// Approx city centers for NFL stadium cities.
// Falls back to deterministic anchors if unknown.
const CITY_KEY_TO_LATLNG = {
  "glendale,az": [33.5387, -112.186],
  "atlanta,ga": [33.749, -84.388],
  "baltimore,md": [39.2904, -76.6122],
  "orchard park,ny": [42.7676, -78.7443],
  "charlotte,nc": [35.2271, -80.8431],
  "chicago,il": [41.8781, -87.6298],
  "cincinnati,oh": [39.1031, -84.512],
  "cleveland,oh": [41.4993, -81.6944],
  "arlington,tx": [32.7357, -97.1081],
  "denver,co": [39.7392, -104.9903],
  "detroit,mi": [42.3314, -83.0458],
  "green bay,wi": [44.5133, -88.0133],
  "houston,tx": [29.7604, -95.3698],
  "indianapolis,in": [39.7684, -86.1581],
  "jacksonville,fl": [30.3322, -81.6557],
  "kansas city,mo": [39.0997, -94.5786],
  "paradise,nv": [36.0972, -115.1467],
  "inglewood,ca": [33.9617, -118.3531],
  "miami gardens,fl": [25.942, -80.2456],
  "minneapolis,mn": [44.9778, -93.265],
  "foxborough,ma": [42.0654, -71.2478],
  "new orleans,la": [29.9511, -90.0715],
  "east rutherford,nj": [40.833, -74.097],
  "philadelphia,pa": [39.9526, -75.1652],
  "pittsburgh,pa": [40.4406, -79.9959],
  "santa clara,ca": [37.3541, -121.9552],
  "seattle,wa": [47.6062, -122.3321],
  "tampa,fl": [27.9506, -82.4572],
  "nashville,tn": [36.1627, -86.7816],
  "landover,md": [38.934, -76.888],
};

const CITY_KEY_ALIASES = {
  "los angeles,ca": "inglewood,ca",
  "las vegas,nv": "paradise,nv",
  "washington,dc": "landover,md",
  "new york,ny": "east rutherford,nj",
  "new york,nj": "east rutherford,nj",
  "san francisco,ca": "santa clara,ca",
};

const getLatLngForGame = (game, index, stadiumCity) => {
  const seed = hashStringToInt(`${game?._id || ""}-${index}`);

  const derivedCity =
    stadiumCity ||
    game?.stadiumCity ||
    game?.competitors?.[1]?.stadiumCity ||
    game?.competitors?.[0]?.stadiumCity ||
    game?.venue?.city ||
    game?.stadium?.city ||
    "";

  const cityKey = toCityKey(derivedCity);
  const mappedKey = CITY_KEY_ALIASES[cityKey] || cityKey;
  const mapped = CITY_KEY_TO_LATLNG[mappedKey];

  if (Array.isArray(mapped) && mapped.length === 2) {
    const jitterLat = ((seed % 5) - 2) * 0.06;
    const jitterLng = (((seed >> 2) % 5) - 2) * 0.08;
    const lat = mapped[0] + jitterLat;
    const lng = mapped[1] + jitterLng;
    // If somehow outside our play bounds, fall back.
    if (ARCADE_BOUNDS.contains(L.latLng(lat, lng))) return [lat, lng];
  }

  const base = MARKER_ANCHORS[seed % MARKER_ANCHORS.length];
  const jitterLat = ((seed % 7) - 3) * 0.22;
  const jitterLng = (((seed >> 3) % 7) - 3) * 0.28;
  return [base[0] + jitterLat, base[1] + jitterLng];
};

export {
  USA_BOUNDS,
  ARCADE_BOUNDS,
  USA_CENTER,
  USA_POLYGON,
  CARIBBEAN_ISLANDS,
  getLatLngForGame,
  hashStringToInt,
};
