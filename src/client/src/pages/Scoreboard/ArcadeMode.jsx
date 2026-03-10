import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import IconButton from "@mui/material/IconButton";

import ToggleOn from "@mui/icons-material/ToggleOn";
import ToggleOff from "@mui/icons-material/ToggleOff";

import styles from "./styles";

import { hasGameStarted } from "../../utilities";

export const ArcadeModeToggle = ({ isArcadeMode, onArcadeModeOn, onArcadeModeOff }) => (
  <div
    style={{
      marginTop: "25px",
      padding: "10px",
      backgroundColor: "#fff",
      marginLeft: "auto",
      width: "fit-content",
    }}
  >
    <div style={{ fontSize: "9px", fontWeight: 700 }}>{isArcadeMode ? "Classic Mode" : "Arcade Mode"}</div>
    <div style={{ marginTop: "6px" }}>
      <IconButton
        style={isArcadeMode ? styles.toggleButtonOn : styles.toggleButtonOff}
        aria-label="toggle arcade mode"
      >
        {isArcadeMode ? (
          <ToggleOn onClick={onArcadeModeOff} />
        ) : (
          <ToggleOff onClick={onArcadeModeOn} />
        )}
      </IconButton>
    </div>
  </div>
);

ArcadeModeToggle.propTypes = {
  isArcadeMode: PropTypes.bool.isRequired,
  onArcadeModeOn: PropTypes.func.isRequired,
  onArcadeModeOff: PropTypes.func.isRequired,
};

const hashStringToInt = (value = "") => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getTeamLabel = (competitor = {}) => {
  return (
    competitor.shortLocation ||
    competitor.abbreviation ||
    competitor.location ||
    competitor.name ||
    "Team"
  );
};

const USA_BOUNDS = L.latLngBounds(
  L.latLng(24.396308, -125.0),
  L.latLng(49.384358, -66.93457)
);

const USA_CENTER = [39.5, -98.35];

// Rough polygon for the contiguous US (coarse on purpose, "arcade" style).
// This is not a traced outline; it's a simplified shape to read like the US.
const USA_POLYGON = [
  [48.8, -124.5],
  [46.5, -124.0],
  [42.0, -124.0],
  [39.0, -122.5],
  [34.5, -120.0],
  [32.5, -117.0],
  [31.0, -114.5],
  [29.0, -111.0],
  [28.5, -106.5],
  [27.8, -100.0],
  [28.8, -97.0],
  [29.3, -94.0],
  [29.0, -90.0],
  [28.2, -86.5],
  [25.8, -82.0],
  [24.6, -81.2],
  [26.2, -80.2],
  [29.5, -80.0],
  [32.0, -79.0],
  [34.5, -77.0],
  [36.5, -75.5],
  [39.0, -74.5],
  [41.0, -73.5],
  [42.5, -71.0],
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
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
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
    if (USA_BOUNDS.contains(L.latLng(lat, lng))) return [lat, lng];
  }

  const base = MARKER_ANCHORS[seed % MARKER_ANCHORS.length];
  const jitterLat = ((seed % 7) - 3) * 0.22;
  const jitterLng = (((seed >> 3) % 7) - 3) * 0.28;
  return [base[0] + jitterLat, base[1] + jitterLng];
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getScoreText = (game) => {
  const awayScore = game?.competitors?.[0]?.score;
  const homeScore = game?.competitors?.[1]?.score;
  const a = typeof awayScore === "number" ? awayScore : 0;
  const h = typeof homeScore === "number" ? homeScore : 0;
  return `${a}-${h}`;
};

const getGameLabelWithScore = (game, away, home) => {
  const awayLabel = getTeamLabel(away);
  const homeLabel = getTeamLabel(home);
  const scoreText = getScoreText(game);
  const suffix = game?.isGameOver ? " • Final" : "";
  return `${awayLabel} ${scoreText} ${homeLabel}${suffix}`;
};

const buildPixelWaterTiles = (bounds, rows = 10, cols = 16) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const latStep = (ne.lat - sw.lat) / rows;
  const lngStep = (ne.lng - sw.lng) / cols;
  const tiles = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const lat1 = sw.lat + r * latStep;
      const lat2 = lat1 + latStep;
      const lng1 = sw.lng + c * lngStep;
      const lng2 = lng1 + lngStep;
      const isAlt = (r + c) % 2 === 0;
      tiles.push({
        bounds: L.latLngBounds(L.latLng(lat1, lng1), L.latLng(lat2, lng2)),
        color: isAlt ? "#B9E9FF" : "#9EDCFF",
        opacity: isAlt ? 0.22 : 0.14,
      });
    }
  }
  return tiles;
};

const createStickFigureIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
      <circle cx="13" cy="6" r="3.2" fill="#000" />
      <line x1="13" y1="9.8" x2="13" y2="16" stroke="#000" stroke-width="2" stroke-linecap="round" />
      <line x1="13" y1="11.8" x2="8" y2="14.2" stroke="#000" stroke-width="2" stroke-linecap="round" />
      <line x1="13" y1="11.8" x2="18" y2="14.2" stroke="#000" stroke-width="2" stroke-linecap="round" />
      <line x1="13" y1="16" x2="9" y2="21" stroke="#000" stroke-width="2" stroke-linecap="round" />
      <line x1="13" y1="16" x2="17" y2="21" stroke="#000" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
  return L.divIcon({
    className: "",
    html: `<div style="transform: translate(-50%, -50%);">${svg}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const buildPopupHtml = ({
  game,
  away,
  home,
  awaySelected,
  homeSelected,
  canPick,
  updatingPick,
}) => {
  const header = game?.isGameOver
    ? "Final"
    : hasGameStarted(game.startDateTime)
      ? "Live"
      : "Pick";

  const statusText = game?.isGameOver
    ? "Complete"
    : hasGameStarted(game.startDateTime)
      ? "In progress"
      : updatingPick
        ? "Saving pick..."
        : canPick
          ? "Tap a team"
          : "Locked";

  const awayLabel = getTeamLabel(away);
  const homeLabel = getTeamLabel(home);
  const scoreText = getScoreText(game);

  const pickButton = (label, teamId, selected) => {
    const fontWeight = selected ? "700" : "600";
    const background = selected ? "#B3E6CA" : "#fff";
    const border = "1px solid #E7E7E7";
    const cursor = canPick ? "pointer" : "default";
    const opacity = canPick ? "1" : "0.7";
    return `
      <button
        type="button"
        data-teamid="${teamId || ""}"
        style="flex:1;padding:8px 10px;border:${border};border-radius:10px;background:${background};cursor:${cursor};opacity:${opacity};font-weight:${fontWeight};"
      >
        ${label}
      </button>
    `;
  };

  return `
    <div style="min-width:220px;">
      <div style="font-weight:700;margin-bottom:6px;">${getGameLabelWithScore(game, away, home)}</div>
      <div style="font-size:12px;color:#000;margin-bottom:10px;">${header}${game?.startDateTimeDisplay ? ` • ${game.startDateTimeDisplay}` : ""}</div>
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        ${pickButton(`Pick ${awayLabel}`, away?._id, awaySelected)}
        ${pickButton(`Pick ${homeLabel}`, home?._id, homeSelected)}
      </div>
      <div style="font-size:12px;font-weight:600;background:#EFFBF8;padding:8px;border-radius:10px;border:1px solid #E7E7E7;">
        ${statusText}
      </div>
    </div>
  `;
};

const LeafletArcadeMap = ({ allGames, picks, updatingPick, onMakePick }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const gamesLayerRef = useRef(null);
  const waterLayerRef = useRef(null);
  const playerRef = useRef(null);
  const gameMarkersRef = useRef(new Map());
  const stickIconRef = useRef(null);
  const invalidateTimeoutRef = useRef(null);
  const invalidateTimeout2Ref = useRef(null);
  const resizeObserverRef = useRef(null);

  const [playerLatLng, setPlayerLatLng] = useState(USA_CENTER);
  const [nearGameId, setNearGameId] = useState(null);

  const computed = useMemo(() => {
    return allGames.map((game, idx) => {
      const away = game?.competitors?.[0];
      const home = game?.competitors?.[1];
      const pick = (picks || []).find((p) => p.gameId === game._id);
      const pickId = pick?.pickId;

      const isOver = !!game.isGameOver;
      const isStarted = hasGameStarted(game.startDateTime);
      const canPick = !isOver && !isStarted && !updatingPick;

      const awaySelected = pickId && away?._id && pickId === away._id;
      const homeSelected = pickId && home?._id && pickId === home._id;

      return {
        game,
        idx,
        latLng: getLatLngForGame(game, idx, home?.stadiumCity),
        away,
        home,
        pick,
        pickId,
        canPick,
        awaySelected,
        homeSelected,
      };
    });
  }, [allGames, picks, updatingPick]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: true,
      tap: true,
      zoomAnimation: false,
      markerZoomAnimation: false,
      fadeAnimation: false,
    });

    map.setView(USA_CENTER, 4);
    map.setMaxBounds(USA_BOUNDS);
    map.options.maxBoundsViscosity = 1.0;

    // Pixel-ish water background (extends beyond US bounds)
    const waterBounds = USA_BOUNDS.pad(0.18);
    waterLayerRef.current = L.layerGroup().addTo(map);
    L.rectangle(waterBounds, {
      color: "#000",
      weight: 0,
      fillColor: "#78C8FF",
      fillOpacity: 0.35,
      interactive: false,
    }).addTo(waterLayerRef.current);

    const tiles = buildPixelWaterTiles(waterBounds, 10, 16);
    tiles.forEach((t) => {
      L.rectangle(t.bounds, {
        color: "#000",
        weight: 0,
        fillColor: t.color,
        fillOpacity: t.opacity,
        interactive: false,
      }).addTo(waterLayerRef.current);
    });

    // Background & US silhouette
    const usPolygon = L.polygon(USA_POLYGON, {
      color: "#000",
      weight: 1,
      fillColor: "#B3E6CA",
      fillOpacity: 0.6,
    });
    usPolygon.addTo(map);

    // Ensure the map fits the US bounds nicely
    map.fitBounds(USA_BOUNDS, { padding: [18, 18], animate: false });

    gamesLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    stickIconRef.current = createStickFigureIcon();
    playerRef.current = L.marker(USA_CENTER, {
      icon: stickIconRef.current,
      interactive: false,
      keyboard: false,
    }).addTo(map);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Track container size changes (more reliable than window resize on some layouts).
    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserverRef.current.observe(containerRef.current);
    }

    // Give the browser a tick to lay out the fixed container.
    invalidateTimeoutRef.current = setTimeout(() => {
      map.invalidateSize();
    }, 0);

    // And one more tick for safety (font load / toolbar layout can shift widths).
    invalidateTimeout2Ref.current = setTimeout(() => {
      map.invalidateSize();
    }, 50);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);

      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
        } catch (e) {
          // ignore
        }
        resizeObserverRef.current = null;
      }

      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
        invalidateTimeoutRef.current = null;
      }

      if (invalidateTimeout2Ref.current) {
        clearTimeout(invalidateTimeout2Ref.current);
        invalidateTimeout2Ref.current = null;
      }

      // Defensive: stop any pending transitions/handlers before removing.
      try {
        map.closePopup();
      } catch (e) {
        // ignore
      }
      try {
        map.stop();
      } catch (e) {
        // ignore
      }
      try {
        map.off();
      } catch (e) {
        // ignore
      }

      map.remove();
      mapRef.current = null;
      gamesLayerRef.current = null;
      waterLayerRef.current = null;
      playerRef.current = null;
      gameMarkersRef.current = new Map();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const player = playerRef.current;
    if (!map || !player) return;
    player.setLatLng(playerLatLng);
  }, [playerLatLng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const stepForZoom = (zoom) => {
      const base = 1.2;
      const factor = Math.pow(2, zoom - 4);
      return base / factor;
    };

    const handleKeyDown = (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();

      const zoom = map.getZoom();
      const step = stepForZoom(zoom);
      const [lat, lng] = playerLatLng;

      let nextLat = lat;
      let nextLng = lng;
      if (e.key === "ArrowUp") nextLat += step;
      if (e.key === "ArrowDown") nextLat -= step;
      if (e.key === "ArrowLeft") nextLng -= step * 1.4;
      if (e.key === "ArrowRight") nextLng += step * 1.4;

      nextLat = clamp(nextLat, USA_BOUNDS.getSouth() + 0.2, USA_BOUNDS.getNorth() - 0.2);
      nextLng = clamp(nextLng, USA_BOUNDS.getWest() + 0.2, USA_BOUNDS.getEast() - 0.2);

      setPlayerLatLng([nextLat, nextLng]);
      map.panTo([nextLat, nextLng], { animate: false });
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerLatLng]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = gamesLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    gameMarkersRef.current.clear();

    computed.forEach((item) => {
      const { game, latLng, away, home, canPick, awaySelected, homeSelected } = item;

      const isSelected = awaySelected || homeSelected;
      const marker = L.circleMarker(latLng, {
        radius: isSelected ? 8 : 7,
        color: isSelected ? "#3772FA" : "#000",
        weight: 2,
        fillColor: isSelected ? "#B3E6CA" : "#FCE385",
        fillOpacity: 0.95,
      });

      marker.bindTooltip(getGameLabelWithScore(game, away, home), {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        opacity: 0.95,
      });

      const popupHtml = buildPopupHtml({
        game,
        away,
        home,
        awaySelected,
        homeSelected,
        canPick,
        updatingPick,
      });

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoPan: false,
        maxWidth: 260,
        className: "",
      });

      marker.on("popupopen", (e) => {
        if (!canPick) return;
        const popupEl = e?.popup?.getElement();
        if (!popupEl) return;
        const buttons = popupEl.querySelectorAll("[data-teamid]");
        buttons.forEach((btn) => {
          btn.addEventListener(
            "click",
            () => {
              const teamId = btn.getAttribute("data-teamid");
              if (!teamId) return;
              onMakePick({ gameId: game._id, pickId: teamId });
              marker.closePopup();
            },
            { once: true }
          );
        });
      });

      marker.addTo(layer);
      gameMarkersRef.current.set(game._id, marker);
    });

    // After drawing, determine nearest game and highlight it.
    const playerPoint = map.latLngToContainerPoint(L.latLng(playerLatLng[0], playerLatLng[1]));
    let closest = { id: null, dist: Number.POSITIVE_INFINITY };
    computed.forEach((item) => {
      const pt = map.latLngToContainerPoint(L.latLng(item.latLng[0], item.latLng[1]));
      const dx = pt.x - playerPoint.x;
      const dy = pt.y - playerPoint.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < closest.dist) closest = { id: item.game._id, dist: d };
    });
    setNearGameId(closest.dist <= 40 ? closest.id : null);
  }, [computed, updatingPick, onMakePick, playerLatLng]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = nearGameId ? gameMarkersRef.current.get(nearGameId) : null;
    if (!map) return;
    if (!marker) return;
    if (!marker._map) return;
    // Subtle visual emphasis: slightly enlarge the tooltip when near.
    // Leaflet tooltip DOM is managed internally; keep this minimal.
    marker.openPopup();
  }, [nearGameId]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#78C8FF",
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "#EFFBF8",
        }}
      />
    </div>
  );
};

LeafletArcadeMap.propTypes = {
  allGames: PropTypes.array.isRequired,
  picks: PropTypes.array,
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
};

const ArcadeMode = ({
  isArcadeMode,
  onArcadeModeOn,
  onArcadeModeOff,
  leagueLabel,
  year,
  weekLabel,
  groupedGames,
  picks,
  updatingPick,
  onMakePick,
}) => {
  const allGames = [
    ...(groupedGames?.notCompleted || []),
    ...(groupedGames?.completed || []),
  ];

  return (
    <div>
      <div style={{ position: "fixed", top: "12px", right: "12px", zIndex: 7 }}>
        <ArcadeModeToggle
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={onArcadeModeOn}
          onArcadeModeOff={onArcadeModeOff}
        />
      </div>

      <div style={{ position: "fixed", left: "12px", top: "12px", zIndex: 7 }}>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #E7E7E7",
            borderRadius: "14px",
            padding: "10px 12px",
            maxWidth: "75vw",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 800 }}>
            🎟️ {leagueLabel || ""}{year ? ` • ${year}` : ""}
          </div>
          {!!weekLabel && (
            <div style={{ marginTop: "4px", fontSize: "12px", fontWeight: 650 }}>
              {weekLabel}
            </div>
          )}
        </div>
      </div>

      <LeafletArcadeMap
        allGames={allGames}
        picks={picks}
        updatingPick={updatingPick}
        onMakePick={onMakePick}
      />
    </div>
  );
};

ArcadeMode.propTypes = {
  isArcadeMode: PropTypes.bool.isRequired,
  onArcadeModeOn: PropTypes.func.isRequired,
  onArcadeModeOff: PropTypes.func.isRequired,
  leagueLabel: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  weekLabel: PropTypes.string,
  groupedGames: PropTypes.shape({
    notCompleted: PropTypes.array,
    completed: PropTypes.array,
  }),
  picks: PropTypes.array,
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
};

export default ArcadeMode;
