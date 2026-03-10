import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import IconButton from "@mui/material/IconButton";

import ToggleOn from "@mui/icons-material/ToggleOn";
import ToggleOff from "@mui/icons-material/ToggleOff";

import styles from "./styles";

import { hasGameStarted } from "../../utilities";
import {
  googleLogin,
  isConfirmedAuthentication,
  logout,
} from "../../utilities/authenticationClient";

import mvyLogo from "../../styles/images/mvy-balls-cut.png";

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

const ArcadeBrandBar = () => {
  const isAuthenticated = isConfirmedAuthentication();

  const buttonStyle = {
    border: "1px solid #E7E7E7",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "7px 10px",
    fontSize: "11px",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        backgroundColor: "#fff",
        border: "1px solid #E7E7E7",
        borderRadius: "14px",
        pointerEvents: "auto",
      }}
    >
      <Link to="/" aria-label="Me vs Yall home" style={{ display: "flex", alignItems: "center" }}>
        <img
          src={mvyLogo}
          alt="Me vs Yall"
          style={{ height: "34px", width: "72px", objectFit: "contain" }}
        />
      </Link>

      <button
        type="button"
        onClick={isAuthenticated ? logout : googleLogin}
        style={buttonStyle}
        aria-label={isAuthenticated ? "Sign out" : "Sign in"}
      >
        <span style={{ fontSize: ".7rem" }}>📱</span> {isAuthenticated ? "Sign out" : "SIGN IN"}
      </button>
    </div>
  );
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

const getTeamTinyLabel = (competitor = {}) => {
  const label =
    competitor.abbreviation ||
    competitor.shortLocation ||
    competitor.shortName ||
    competitor.location ||
    competitor.name ||
    "Team";
  const text = String(label || "Team");
  if (text.length <= 12) return text;
  return `${text.slice(0, 12)}…`;
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

const LeafletArcadeMap = ({ allGames, picks, updatingPick, onMakePick, onApiReady }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const gamesLayerRef = useRef(null);
  const waterLayerRef = useRef(null);
  const gameMarkersRef = useRef(new Map());
  const invalidateTimeoutRef = useRef(null);
  const invalidateTimeout2Ref = useRef(null);
  const resizeObserverRef = useRef(null);
  const markerBasesRef = useRef(new Map());

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
    const waterBounds = USA_BOUNDS.pad(0.75);
    waterLayerRef.current = L.layerGroup().addTo(map);

    // Base ocean layer: cover the whole world so water is always visible.
    const WORLD_BOUNDS = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
    L.rectangle(WORLD_BOUNDS, {
      color: "#000",
      weight: 0,
      fillColor: "#78C8FF",
      fillOpacity: 0.35,
      interactive: false,
    }).addTo(waterLayerRef.current);

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
      fillOpacity: 1,
    });
    usPolygon.addTo(map);

    // Ensure the map fits the US bounds nicely
    map.fitBounds(USA_BOUNDS, { padding: [18, 18], animate: false });

    gamesLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

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
      if (onApiReady) {
        try {
          onApiReady(null);
        } catch (e) {
          // ignore
        }
      }

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
      gameMarkersRef.current = new Map();
    };
  }, []);

  useEffect(() => {
    if (!onApiReady) return;

    const api = {
      focusGame: (gameId) => {
        const map = mapRef.current;
        const marker = gameId ? gameMarkersRef.current.get(gameId) : null;
        if (!map || !marker) return;
        const latLng = marker.getLatLng();
        map.panTo(latLng, { animate: false });
      },
      openGamePopup: (gameId) => {
        const map = mapRef.current;
        const marker = gameId ? gameMarkersRef.current.get(gameId) : null;
        if (!map || !marker) return;
        const latLng = marker.getLatLng();
        map.panTo(latLng, { animate: false });
        marker.openPopup();
      },
    };

    try {
      onApiReady(api);
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        onApiReady(null);
      } catch (e) {
        // ignore
      }
    };
  }, [onApiReady]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = gamesLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    gameMarkersRef.current.clear();
    markerBasesRef.current.clear();

    const layoutMarkers = () => {
      const markers = Array.from(gameMarkersRef.current.entries()).map(([id, marker]) => ({
        id,
        marker,
        baseLatLng: markerBasesRef.current.get(id),
      }));

      if (!markers.length) return;

      const minDistPx = 56; // roughly marker + tooltip footprint
      const maxDriftPx = 70; // keep in the vicinity of the stadium city
      const iterations = 12;
      const spring = 0.14;

      const basePoints = markers.map((m) => {
        const base = m.baseLatLng || m.marker.getLatLng();
        return map.latLngToLayerPoint(base);
      });

      const points = basePoints.map((p) => ({ x: p.x, y: p.y }));

      const n = points.length;
      for (let iter = 0; iter < iterations; iter += 1) {
        for (let i = 0; i < n; i += 1) {
          const bp = basePoints[i];
          points[i].x += (bp.x - points[i].x) * spring;
          points[i].y += (bp.y - points[i].y) * spring;
        }

        for (let i = 0; i < n; i += 1) {
          for (let j = i + 1; j < n; j += 1) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= minDistPx) continue;

            let ux = 1;
            let uy = 0;
            if (dist > 0.0001) {
              ux = dx / dist;
              uy = dy / dist;
            } else {
              // Deterministic direction when perfectly overlapping.
              const seed = hashStringToInt(`${markers[i].id}-${markers[j].id}`);
              const angle = (seed % 360) * (Math.PI / 180);
              ux = Math.cos(angle);
              uy = Math.sin(angle);
            }

            const push = (minDistPx - dist) / 2;
            points[i].x += ux * push;
            points[i].y += uy * push;
            points[j].x -= ux * push;
            points[j].y -= uy * push;
          }
        }

        // Clamp drift each iteration to reduce oscillation.
        for (let i = 0; i < n; i += 1) {
          const bp = basePoints[i];
          const dx = points[i].x - bp.x;
          const dy = points[i].y - bp.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= maxDriftPx) continue;
          const s = maxDriftPx / d;
          points[i].x = bp.x + dx * s;
          points[i].y = bp.y + dy * s;
        }
      }

      for (let i = 0; i < n; i += 1) {
        const latLng = map.layerPointToLatLng(L.point(points[i].x, points[i].y));
        markers[i].marker.setLatLng(latLng);
      }
    };

    computed.forEach((item) => {
      const { game, latLng, away, home, canPick, awaySelected, homeSelected } = item;

      markerBasesRef.current.set(game._id, L.latLng(latLng[0], latLng[1]));

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

    layoutMarkers();
    map.on("zoomend", layoutMarkers);
    map.on("moveend", layoutMarkers);

    return () => {
      try {
        map.off("zoomend", layoutMarkers);
        map.off("moveend", layoutMarkers);
      } catch (e) {
        // ignore
      }
    };
  }, [computed, updatingPick, onMakePick]);

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
          background: "#78C8FF",
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
  onApiReady: PropTypes.func,
};

const ArcadeMode = ({
  isArcadeMode,
  onArcadeModeOn,
  onArcadeModeOff,
  leagueLabel,
  year,
  weekLabel,
  leagues,
  leagueId,
  weeks,
  weekId,
  dataLoading,
  onFilterLeague,
  onFilterYear,
  onFilterWeek,
  groupedGames,
  picks,
  updatingPick,
  onMakePick,
}) => {
  const [areFiltersCollapsed, setAreFiltersCollapsed] = useState(true);
  const [areGamesCollapsed, setAreGamesCollapsed] = useState(true);
  const [mapApi, setMapApi] = useState(null);

  const allGames = [
    ...(groupedGames?.notCompleted || []),
    ...(groupedGames?.completed || []),
  ];

  const leagueSelected = (leagues || []).find((l) => l.id === leagueId);
  const years = leagueSelected?.years || [];
  const weekIndexSelected = (weeks || []).findIndex((w) => w?._id === weekId);
  const weekIndexValue = weekIndexSelected === -1 ? 0 : weekIndexSelected;

  const selectStyle = {
    width: "100%",
    fontSize: "12px",
    fontWeight: 700,
    padding: "7px 10px",
    borderRadius: "10px",
    border: "1px solid #E7E7E7",
    backgroundColor: "#fff",
    outline: "none",
  };

  const dispatchChange = (handler, value) => {
    if (!handler) return;
    handler({ target: { value } });
  };

  const filterPanelId = "arcade-scoreboard-filters";
  const gamesPanelId = "arcade-scoreboard-games";

  const gameList = useMemo(() => {
    return allGames.map((game) => {
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
        away,
        home,
        canPick,
        isOver,
        isStarted,
        awaySelected,
        homeSelected,
      };
    });
  }, [allGames, picks, updatingPick]);

  return (
    <div>
      <div style={{ position: "fixed", top: "12px", left: "12px", zIndex: 7 }}>
        <ArcadeBrandBar />
      </div>

      <div style={{ position: "fixed", top: "12px", right: "12px", zIndex: 7 }}>
        <ArcadeModeToggle
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={onArcadeModeOn}
          onArcadeModeOff={onArcadeModeOff}
        />
      </div>

      <div
        style={{
          position: "fixed",
          left: "12px",
          bottom: "12px",
          zIndex: 7,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "min(360px, 45vw)",
          maxHeight: "calc(100vh - 24px)",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #E7E7E7",
            borderRadius: "14px",
            padding: "10px 12px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, flex: 1 }}>
              🎟️ {leagueLabel || ""}{year ? ` • ${year}` : ""}
            </div>

            <button
              type="button"
              aria-controls={filterPanelId}
              aria-expanded={!areFiltersCollapsed}
              disabled={!!dataLoading}
              onClick={() => setAreFiltersCollapsed((v) => !v)}
              style={{
                fontSize: "11px",
                fontWeight: 800,
                border: "1px solid #E7E7E7",
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "6px 10px",
                cursor: dataLoading ? "not-allowed" : "pointer",
              }}
            >
              {areFiltersCollapsed ? "Change" : "Done"}
            </button>
          </div>
          {!!weekLabel && (
            <div style={{ marginTop: "4px", fontSize: "12px", fontWeight: 650 }}>
              {weekLabel}
            </div>
          )}

          {!areFiltersCollapsed && (
            <div id={filterPanelId} style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
              <select
                aria-label="League"
                style={selectStyle}
                value={leagueId || ""}
                disabled={!!dataLoading || !(leagues || []).length}
                onChange={(e) => dispatchChange(onFilterLeague, e.target.value)}
              >
                {(leagues || []).map((l) => (
                  <option key={l.id} value={l.id}>
                    {String(l.description || l.name || "").toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                aria-label="Year"
                style={selectStyle}
                value={year ?? ""}
                disabled={!!dataLoading || !years.length}
                onChange={(e) => dispatchChange(onFilterYear, Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                aria-label="Week"
                style={selectStyle}
                value={weekIndexValue}
                disabled={!!dataLoading || !(weeks || []).length}
                onChange={(e) => dispatchChange(onFilterWeek, Number(e.target.value))}
              >
                {(weeks || []).map((w, idx) => (
                  <option key={w?._id || idx} value={idx}>
                    {w?.displayName || w?.description || `Week ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #E7E7E7",
            borderRadius: "14px",
            padding: "10px 10px",
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flex: "0 0 auto",
            minHeight: areGamesCollapsed ? "unset" : "220px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, flex: 1 }}>Games ({gameList.length})</div>
            {!areGamesCollapsed && (
              <div style={{ fontSize: "11px", fontWeight: 650, opacity: 0.75 }}>Tap to view</div>
            )}

            <button
              type="button"
              aria-controls={gamesPanelId}
              aria-expanded={!areGamesCollapsed}
              onClick={() => setAreGamesCollapsed((v) => !v)}
              style={{
                fontSize: "11px",
                fontWeight: 800,
                border: "1px solid #E7E7E7",
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              {areGamesCollapsed ? "Show" : "Minimize"}
            </button>
          </div>

          {areGamesCollapsed ? (
            <div
              id={gamesPanelId}
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                overflowY: "hidden",
                paddingBottom: "2px",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {gameList.map(({ game, away, home, isOver, isStarted, awaySelected, homeSelected }) => {
                const awayTiny = getTeamTinyLabel(away);
                const homeTiny = getTeamTinyLabel(home);
                const scoreText = getScoreText(game);
                const status = isOver ? "Final" : isStarted ? "Live" : "Pick";
                const isSelected = awaySelected || homeSelected;

                return (
                  <button
                    key={game._id}
                    type="button"
                    onClick={() => mapApi?.openGamePopup?.(game._id)}
                    style={{
                      flex: "0 0 auto",
                      textAlign: "left",
                      border: isSelected ? "2px solid #3772FA" : "1px solid #E7E7E7",
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "6px 8px",
                      minWidth: "160px",
                      cursor: "pointer",
                    }}
                    aria-label={`Open ${awayTiny} ${scoreText} ${homeTiny}`}
                  >
                    <div style={{ fontSize: "10px", fontWeight: 900, lineHeight: 1.2 }}>
                      {awayTiny} {scoreText} {homeTiny}
                    </div>
                    <div style={{ marginTop: "2px", fontSize: "9px", fontWeight: 700, opacity: 0.7 }}>
                      {status}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              id={gamesPanelId}
              style={{
                // Expanded view: horizontal scroll with 4 stacked rows.
                display: "grid",
                gridAutoFlow: "column",
                gridTemplateRows: "repeat(4, 92px)",
                gap: "8px",
                alignContent: "start",
                overflowX: "auto",
                overflowY: "hidden",
                paddingBottom: "2px",
                WebkitOverflowScrolling: "touch",
                height: "min(392px, calc(100vh - 260px))",
              }}
            >
              {gameList.map(({ game, away, home, canPick, isOver, isStarted, awaySelected, homeSelected }) => {
                const title = getGameLabelWithScore(game, away, home);
                const status = isOver ? "Final" : isStarted ? "Live" : "Pick";

                const pickBtnStyle = (selected) => ({
                  flex: 1,
                  padding: "6px 7px",
                  borderRadius: "10px",
                  border: "1px solid #E7E7E7",
                  backgroundColor: selected ? "#B3E6CA" : "#fff",
                  fontWeight: selected ? 750 : 650,
                  fontSize: "10px",
                  cursor: canPick ? "pointer" : "default",
                  opacity: canPick ? 1 : 0.6,
                });

                return (
                  <div
                    key={game._id}
                    style={{
                      border: "1px solid #E7E7E7",
                      borderRadius: "12px",
                      padding: "7px 8px",
                      width: "260px",
                      height: "92px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => mapApi?.openGamePopup?.(game._id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          lineHeight: 1.15,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={title}
                      >
                        {title}
                      </div>
                      <div style={{ marginTop: "2px", fontSize: "10px", fontWeight: 700, opacity: 0.75 }}>{status}</div>
                    </button>

                    <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                      <button
                        type="button"
                        disabled={!canPick}
                        onClick={() => {
                          if (!canPick) return;
                          onMakePick({ gameId: game._id, pickId: away?._id });
                        }}
                        style={pickBtnStyle(awaySelected)}
                      >
                        Pick {getTeamLabel(away)}
                      </button>
                      <button
                        type="button"
                        disabled={!canPick}
                        onClick={() => {
                          if (!canPick) return;
                          onMakePick({ gameId: game._id, pickId: home?._id });
                        }}
                        style={pickBtnStyle(homeSelected)}
                      >
                        Pick {getTeamLabel(home)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <LeafletArcadeMap
        allGames={allGames}
        picks={picks}
        updatingPick={updatingPick}
        onMakePick={onMakePick}
        onApiReady={setMapApi}
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
  leagues: PropTypes.array,
  leagueId: PropTypes.string,
  weeks: PropTypes.array,
  weekId: PropTypes.string,
  dataLoading: PropTypes.bool,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  groupedGames: PropTypes.shape({
    notCompleted: PropTypes.array,
    completed: PropTypes.array,
  }),
  picks: PropTypes.array,
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
};

export default ArcadeMode;
