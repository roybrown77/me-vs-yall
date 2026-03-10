import { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import IconButton from "@mui/material/IconButton";

import ToggleOn from "@mui/icons-material/ToggleOn";
import ToggleOff from "@mui/icons-material/ToggleOff";

import PageContainer from "../../components/PageContainer";
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
    <div style={{ fontSize: "9px", fontWeight: 700 }}>Arcade Mode</div>
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

const getLatLngForGame = (game, index) => {
  const seed = hashStringToInt(`${game?._id || ""}-${index}`);
  const base = MARKER_ANCHORS[seed % MARKER_ANCHORS.length];
  const jitterLat = ((seed % 7) - 3) * 0.22;
  const jitterLng = (((seed >> 3) % 7) - 3) * 0.28;
  const lat = base[0] + jitterLat;
  const lng = base[1] + jitterLng;
  return [lat, lng];
};

const createMarkerIcon = (variant = "default") => {
  const bg = variant === "selected" ? "#B3E6CA" : "#FCE385";
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;background:${bg};border:2px solid #000;box-shadow:-2px 2px 0 #000;image-rendering:pixelated"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
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
  const header = game?.isGameOver ? "FINAL" : hasGameStarted(game.startDateTime) ? "LIVE" : "PICK";

  const card = (label, teamId, isSelected) => {
    const bg = isSelected ? "#B3E6CA" : "#EFFBF8";
    const cursor = canPick ? "pointer" : "default";
    const opacity = canPick ? "1" : "0.75";
    return `
      <div
        data-teamid="${teamId || ""}"
        style="flex:1;border:2px solid #000;background:${bg};padding:8px;cursor:${cursor};opacity:${opacity};box-shadow:-3px 3px 0 #000;"
      >
        <div style="font-weight:800;font-size:12px;line-height:1.1;">${label}</div>
      </div>
    `;
  };

  const statusText = game?.isGameOver
    ? "Complete"
    : hasGameStarted(game.startDateTime)
      ? "In progress"
      : updatingPick
        ? "Saving pick..."
        : canPick
          ? "Tap a team"
          : "Locked";

  return `
    <div style="font-family:monospace;border:4px solid #000;background:#fff;box-shadow:-6px 6px 0 #000;padding:8px;min-width:190px;">
      <div style="display:flex;justify-content:space-between;gap:8px;font-weight:800;font-size:10px;margin-bottom:8px;">
        <span>${header}</span>
        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px;">${game?.startDateTimeDisplay || ""}</span>
      </div>
      <div style="display:flex;gap:8px;">
        ${card(getTeamLabel(away), away?._id, awaySelected)}
        ${card(getTeamLabel(home), home?._id, homeSelected)}
      </div>
      <div style="margin-top:8px;border-top:2px solid #000;padding-top:6px;font-size:10px;font-weight:800;background:#FCE385;">
        ${statusText}
      </div>
    </div>
  `;
};

const LeafletArcadeMap = ({ allGames, picks, updatingPick, onMakePick }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const gamesLayerRef = useRef(null);

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
        latLng: getLatLngForGame(game, idx),
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
    });

    map.setView(USA_CENTER, 4);
    map.setMaxBounds(USA_BOUNDS);
    map.options.maxBoundsViscosity = 1.0;

    // Background & US silhouette
    const usPolygon = L.polygon(USA_POLYGON, {
      color: "#000",
      weight: 2,
      fillColor: "#B3E6CA",
      fillOpacity: 1,
    });
    usPolygon.addTo(map);

    // Frame to match the rest of the app's arcade look.
    const border = L.rectangle(USA_BOUNDS, {
      color: "#000",
      weight: 3,
      fill: false,
    });
    border.addTo(map);

    // Ensure the map fits the US bounds nicely
    map.fitBounds(USA_BOUNDS, { padding: [18, 18] });

    gamesLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // eslint-disable-next-line consistent-return
    return () => {
      map.remove();
      mapRef.current = null;
      gamesLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = gamesLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    computed.forEach((item) => {
      const { game, latLng, away, home, canPick, awaySelected, homeSelected } = item;
      const iconVariant = awaySelected || homeSelected ? "selected" : "default";

      const marker = L.marker(latLng, {
        icon: createMarkerIcon(iconVariant),
        keyboard: false,
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
        autoPan: true,
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
    });
  }, [computed, updatingPick, onMakePick]);

  return (
    <div
      style={{
        marginTop: "10px",
        background: "#EFFBF8",
        height: "clamp(420px, 65vh, 620px)",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          background: "#EFFBF8",
          fontFamily: "monospace",
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
      <PageContainer>
        <ArcadeModeToggle
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={onArcadeModeOn}
          onArcadeModeOff={onArcadeModeOff}
        />
        <LeafletArcadeMap
          allGames={allGames}
          picks={picks}
          updatingPick={updatingPick}
          onMakePick={onMakePick}
        />
      </PageContainer>
    </div>
  );
};

ArcadeMode.propTypes = {
  isArcadeMode: PropTypes.bool.isRequired,
  onArcadeModeOn: PropTypes.func.isRequired,
  onArcadeModeOff: PropTypes.func.isRequired,
  groupedGames: PropTypes.shape({
    notCompleted: PropTypes.array,
    completed: PropTypes.array,
  }),
  picks: PropTypes.array,
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
};

export default ArcadeMode;
