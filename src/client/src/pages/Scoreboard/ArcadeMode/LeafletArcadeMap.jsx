import { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { hasGameStarted } from "../../../utilities";
import { isConfirmedAuthentication } from "../../../utilities/authenticationClient";

import { getGameLabelWithScore, getTeamLabel } from "./arcadeGameText";
import { getPickOutcome } from "./arcadePickUtils";
import {
  USA_BOUNDS,
  ARCADE_BOUNDS,
  USA_CENTER,
  USA_POLYGON,
  CARIBBEAN_ISLANDS,
  getLatLngForGame,
  hashStringToInt,
} from "./arcadeMapLocations";

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

const LeafletArcadeMap = ({
  allGames,
  picks,
  updatingPick,
  onMakePick,
  onApiReady,
  vehiclesMoving,
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const gamesLayerRef = useRef(null);
  const waterLayerRef = useRef(null);
  const gameMarkersRef = useRef(new Map());
  const tripLineRef = useRef(null);
  const tripVehiclesRef = useRef([]);
  const tripVehiclePathRef = useRef(null);
  const tripVehicleRafRef = useRef(null);
  const vehiclesMovingRef = useRef(true);
  const startVehicleAnimationRef = useRef(null);
  const stopVehicleAnimationRef = useRef(null);
  const invalidateTimeoutRef = useRef(null);
  const invalidateTimeout2Ref = useRef(null);
  const resizeObserverRef = useRef(null);
  const markerBasesRef = useRef(new Map());

  const isAuthenticated = isConfirmedAuthentication();

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

      const pickOutcome = isAuthenticated ? getPickOutcome({ game, pickId }) : null;

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
        pickOutcome,
      };
    });
  }, [allGames, picks, updatingPick, isAuthenticated]);

  useEffect(() => {
    vehiclesMovingRef.current = vehiclesMoving !== false;
    if (!vehiclesMovingRef.current) {
      stopVehicleAnimationRef.current?.();
    } else {
      startVehicleAnimationRef.current?.();
    }
  }, [vehiclesMoving]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      scrollWheelZoom: true,
      scrollWheelZoom: "center",
      wheelPxPerZoomLevel: 80,
      // Prevent accidental zoom while scrolling; user must hold Ctrl/Cmd.
      scrollWheelZoomRequiresKey: true,
      doubleClickZoom: false,
      dragging: true,
      tap: true,
      zoomAnimation: false,
      markerZoomAnimation: false,
      fadeAnimation: false,
    });

    map.setView(USA_CENTER, 4.6);
    map.setMaxBounds(ARCADE_BOUNDS);
    map.options.maxBoundsViscosity = 1.0;

    // Zoom in/out buttons (kept away from the top HUD).
    L.control
      .zoom({ position: "bottomright", zoomInTitle: "Zoom in", zoomOutTitle: "Zoom out" })
      .addTo(map);

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

    // Caribbean islands (arcade-style dots)
    (CARIBBEAN_ISLANDS || []).forEach((island) => {
      const latLng = island?.latLng;
      if (!Array.isArray(latLng) || latLng.length !== 2) return;
      L.circle(latLng, {
        radius: island?.radius || 25000,
        color: "#000",
        weight: 1,
        fillColor: "#B3E6CA",
        fillOpacity: 1,
        interactive: false,
      }).addTo(map);
    });

    // Ensure the map fits the expanded play bounds (includes Caribbean)
    map.fitBounds(ARCADE_BOUNDS, { padding: [10, 10], animate: false });

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
    tripLineRef.current = null;
    tripVehiclePathRef.current = null;

    if (tripVehicleRafRef.current) {
      cancelAnimationFrame(tripVehicleRafRef.current);
      tripVehicleRafRef.current = null;
    }

    tripVehiclesRef.current = [];

    const buildVehicleIcon = (emoji) => {
      return L.divIcon({
        className: "",
        html: `<div style="font-size:18px;line-height:18px;filter: drop-shadow(0px 1px 0px rgba(0,0,0,0.15));">${emoji}</div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
    };

    const computePath = (latLngs) => {
      const pts = (latLngs || []).filter(Boolean);
      if (pts.length < 2) return null;

      const segLens = [];
      let total = 0;
      for (let i = 0; i < pts.length - 1; i += 1) {
        const a = pts[i];
        const b = pts[i + 1];
        const len = a?.distanceTo ? a.distanceTo(b) : L.latLng(a).distanceTo(L.latLng(b));
        const safe = Number.isFinite(len) ? len : 0;
        segLens.push(safe);
        total += safe;
      }
      if (!Number.isFinite(total) || total <= 0) return null;

      const cumLens = [0];
      for (let i = 0; i < segLens.length; i += 1) {
        cumLens.push(cumLens[i] + segLens[i]);
      }

      return { pts, segLens, cumLens, total };
    };

    const getLatLngAtDistance = (path, dist) => {
      if (!path) return null;
      const { pts, segLens, cumLens, total } = path;
      if (!pts?.length || total <= 0) return null;

      let d = dist;
      if (d < 0) d = ((d % total) + total) % total;
      if (d > total) d %= total;

      // Find segment containing distance.
      let segIdx = 0;
      for (let i = 0; i < cumLens.length - 1; i += 1) {
        if (d >= cumLens[i] && d <= cumLens[i + 1]) {
          segIdx = i;
          break;
        }
      }

      const segStart = pts[segIdx];
      const segEnd = pts[segIdx + 1] || pts[segIdx];
      const segLen = segLens[segIdx] || 1;
      const segOffset = d - cumLens[segIdx];
      const t = Math.max(0, Math.min(1, segOffset / segLen));

      const lat = segStart.lat + (segEnd.lat - segStart.lat) * t;
      const lng = segStart.lng + (segEnd.lng - segStart.lng) * t;
      return L.latLng(lat, lng);
    };

    const ensureVehicles = (path) => {
      if (!path) {
        tripVehiclesRef.current.forEach((m) => {
          try {
            layer.removeLayer(m);
          } catch (e) {
            // ignore
          }
        });
        tripVehiclesRef.current = [];
        return;
      }

      if (tripVehiclesRef.current.length) return;

      const emojis = ["🚗", "🚚", "🚙", "🏎️"];
      tripVehiclesRef.current = emojis.map((emoji) =>
        L.marker(path.pts[0], {
          icon: buildVehicleIcon(emoji),
          interactive: false,
          keyboard: false,
          opacity: 0.95,
        }).addTo(layer)
      );
    };

    const stopVehicleAnimation = () => {
      if (tripVehicleRafRef.current) {
        cancelAnimationFrame(tripVehicleRafRef.current);
        tripVehicleRafRef.current = null;
      }
    };

    const startVehicleAnimation = () => {
      if (tripVehicleRafRef.current) return;

      const periodMs = 16000; // one full loop
      const start = performance.now();

      const tick = () => {
        const path = tripVehiclePathRef.current;
        if (!path || !tripVehiclesRef.current.length) {
          tripVehicleRafRef.current = requestAnimationFrame(tick);
          return;
        }

        const now = performance.now();
        const base = ((now - start) % periodMs) / periodMs;

        const count = tripVehiclesRef.current.length || 1;
        tripVehiclesRef.current.forEach((marker, i) => {
          const offset = i / count;
          const frac = (base + offset) % 1;
          const latLng = getLatLngAtDistance(path, path.total * frac);
          if (latLng) marker.setLatLng(latLng);
        });

        tripVehicleRafRef.current = requestAnimationFrame(tick);
      };

      tripVehicleRafRef.current = requestAnimationFrame(tick);
    };

    startVehicleAnimationRef.current = startVehicleAnimation;
    stopVehicleAnimationRef.current = stopVehicleAnimation;

    const updateTripLine = () => {
      const points = (computed || [])
        .map((item) => {
          const marker = item?.game?._id ? gameMarkersRef.current.get(item.game._id) : null;
          if (marker) return marker.getLatLng();
          const latLng = item?.latLng;
          if (!latLng) return null;
          return L.latLng(latLng[0], latLng[1]);
        })
        .filter(Boolean);

      if (points.length < 2) {
        if (tripLineRef.current) {
          try {
            layer.removeLayer(tripLineRef.current);
          } catch (e) {
            // ignore
          }
          tripLineRef.current = null;
        }

        tripVehiclePathRef.current = null;
        ensureVehicles(null);
        return;
      }

      if (!tripLineRef.current) {
        tripLineRef.current = L.polyline(points, {
          color: "#000",
          weight: 2,
          opacity: 0.35,
          dashArray: "7 10",
          lineCap: "round",
          lineJoin: "round",
          interactive: false,
        }).addTo(layer);
      } else {
        tripLineRef.current.setLatLngs(points);
      }

      // Keep vehicle animation aligned to the current trip line.
      tripVehiclePathRef.current = computePath(points);
      ensureVehicles(tripVehiclePathRef.current);
      if (vehiclesMovingRef.current) startVehicleAnimation();
    };

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

      updateTripLine();
    };

    computed.forEach((item) => {
      const { game, latLng, away, home, canPick, awaySelected, homeSelected, pickOutcome } = item;

      markerBasesRef.current.set(game._id, L.latLng(latLng[0], latLng[1]));

      const isSelected = awaySelected || homeSelected;

      const isFinal = !!game?.isGameOver;
      const isWin = isFinal && pickOutcome === "win";
      const isLoss = isFinal && pickOutcome === "loss";

      const strokeColor = isWin ? "#22C55E" : isLoss ? "#FF5722" : isSelected ? "#3772FA" : "#000";
      const strokeWeight = isWin || isLoss ? 3 : 2;
      const fillColor = isWin || isLoss ? "#F2F2F2" : isSelected ? "#B3E6CA" : "#FCE385";

      const marker = L.circleMarker(latLng, {
        radius: isSelected ? 8 : 7,
        color: strokeColor,
        weight: strokeWeight,
        fillColor,
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

    // Draw the initial road-trip line (then snap again after repel layout).
    updateTripLine();

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

      stopVehicleAnimation();

      tripVehiclesRef.current.forEach((m) => {
        try {
          layer.removeLayer(m);
        } catch (e) {
          // ignore
        }
      });
      tripVehiclesRef.current = [];
      tripVehiclePathRef.current = null;

      startVehicleAnimationRef.current = null;
      stopVehicleAnimationRef.current = null;
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
  vehiclesMoving: PropTypes.bool,
};

export default LeafletArcadeMap;
