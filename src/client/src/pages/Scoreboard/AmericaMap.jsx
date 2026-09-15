import { useLayoutEffect, useMemo, useRef, useState } from "react";
import moment from "moment-timezone";
import get from "lodash/get";
import { geoAlbersUsa, geoContains, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import statesTopology from "us-atlas/states-10m.json";

import { hasGameStarted } from "../../utilities";
import { resolveGameMapLocation } from "./americaMapLocations";
import { MapLandmarks, placeMapLandmarks } from "./americaMapLandmarks";
import "./america-map.css";

const states = feature(statesTopology, statesTopology.objects.states);

const isInsideUnitedStates = (lng, lat) =>
  states.features.some((state) => geoContains(state, [lng, lat]));
const LAND_FILLS = ["#63c447", "#57b83c", "#6ed14c", "#4eaf36", "#72d450"];
const MAP_ASPECT = 960 / 600;
const MIN_CANVAS_WIDTH = 760;

const formatPlayClock = (time) => {
  const value = Number(time);
  if (!Number.isFinite(value) || value < 0) return "";
  if (value > 59) {
    return (value / 100).toFixed(2).toString().replace(".", ":");
  }
  return `${value}:00`;
};

const getStatusLabel = (game) => {
  if (game.isGameOver) return "Final";
  if (!hasGameStarted(game.startDateTime)) {
    return moment(game.startDateTime).format("h:mm A");
  }

  const currentTime = String(game.currentTime || "").trim();
  if (/^halftime/i.test(currentTime)) return "HT";

  const clockMatch = currentTime.match(/^(\d{1,2}:\d{2})/);
  const quarterMatch = currentTime.match(/\b(1st|2nd|3rd|4th|OT\d*)\b/i);
  const clock = clockMatch
    ? clockMatch[1]
    : formatPlayClock(get(game, "playHistory[0].time"));
  const quarter = quarterMatch ? quarterMatch[1].toUpperCase() : "";

  if (quarter && clock) return `${quarter} ${clock}`;
  return quarter || clock || "Live";
};

const teamAbbr = (competitor) =>
  competitor?.shortLocation || competitor?.name || "?";

const teamColor = (competitor, fallback = "#111111") =>
  competitor?.color || fallback;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const pointOnRect = (t, x, y, w, h) => {
  const peri = 2 * (w + h);
  let d = ((t % peri) + peri) % peri;
  if (d <= w) return { x: x + d, y, edge: "top" };
  d -= w;
  if (d <= h) return { x: x + w, y: y + d, edge: "right" };
  d -= h;
  if (d <= w) return { x: x + w - d, y: y + h, edge: "bottom" };
  d -= w;
  return { x, y: y + h - d, edge: "left" };
};

const preferredPerimeterT = (px, py, rx, ry, rw, rh) => {
  const cx = rx + rw / 2;
  const cy = ry + rh / 2;
  const dx = px - cx;
  const dy = py - cy;
  if (dx === 0 && dy === 0) return rw / 2;

  const scaleX = dx !== 0 ? ((dx > 0 ? rx + rw - cx : rx - cx) / dx) : Infinity;
  const scaleY = dy !== 0 ? ((dy > 0 ? ry + rh - cy : ry - cy) / dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  const hx = cx + dx * scale;
  const hy = cy + dy * scale;
  const eps = 0.75;

  if (Math.abs(hy - ry) < eps) return clamp(hx - rx, 0, rw);
  if (Math.abs(hx - (rx + rw)) < eps) return rw + clamp(hy - ry, 0, rh);
  if (Math.abs(hy - (ry + rh)) < eps) return rw + rh + clamp(rx + rw - hx, 0, rw);
  return rw + rh + rw + clamp(ry + rh - hy, 0, rh);
};

const unoverlapOnPerimeter = (items, peri, minDist) => {
  if (items.length === 0) return items;
  const spacing = Math.min(minDist, peri / items.length);
  const pts = items.map((item) => ({ ...item, t: item.preferredT }));

  for (let iter = 0; iter < 50; iter += 1) {
    pts.sort((a, b) => a.t - b.t);
    for (let i = 0; i < pts.length; i += 1) {
      const j = (i + 1) % pts.length;
      const dist = j === 0 ? pts[j].t + peri - pts[i].t : pts[j].t - pts[i].t;
      if (dist < spacing) {
        const push = (spacing - dist) / 2;
        pts[i].t -= push;
        pts[j].t += push;
      }
    }
    pts.forEach((pt) => {
      pt.t = ((pt.t % peri) + peri) % peri;
    });
  }

  return pts;
};

const curvePath = (x1, y1, x2, y2, sign) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const bulge = Math.max(42, dist * 0.34) * sign;
  const c1x = x1 + dx * 0.28 + nx * bulge;
  const c1y = y1 + dy * 0.28 + ny * bulge;
  const c2x = x1 + dx * 0.72 + nx * bulge * 0.45;
  const c2y = y1 + dy * 0.72 + ny * bulge * 0.45;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

const cardAnchor = (card, edge) => {
  if (edge === "top") return { x: card.cardX + card.cardW / 2, y: card.cardY + card.cardH };
  if (edge === "bottom") return { x: card.cardX + card.cardW / 2, y: card.cardY };
  if (edge === "left") return { x: card.cardX + card.cardW, y: card.cardY + card.cardH / 2 };
  return { x: card.cardX, y: card.cardY + card.cardH / 2 };
};

const offsetDuplicatePins = (games) => {
  const groups = new Map();
  games.forEach((game) => {
    const key = `${Math.round(game.pinPx)}:${Math.round(game.pinPy)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(game);
  });
  groups.forEach((group) => {
    if (group.length < 2) return;
    group.forEach((game, index) => {
      const angle = (index / group.length) * Math.PI * 2;
      game.pinPx += Math.cos(angle) * 10;
      game.pinPy += Math.sin(angle) * 10;
    });
  });
};

const landFill = (stateId) => LAND_FILLS[Number(stateId) % LAND_FILLS.length];

const AmericaMap = ({ games = [], onTeamPick, loading = false }) => {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(
    typeof window === "undefined" ? MIN_CANVAS_WIDTH : Math.max(MIN_CANVAS_WIDTH, Math.min(window.innerWidth - 32, 1100))
  );
  const [hoveredId, setHoveredId] = useState(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const update = () => setWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const locatedGames = useMemo(
    () =>
      games.map((game) => {
        const location = resolveGameMapLocation(game);
        return {
          game,
          lng: location?.lng,
          lat: location?.lat,
          onMap: location
            ? isInsideUnitedStates(location.lng, location.lat)
            : false,
        };
      }),
    [games]
  );

  const onMapGames = locatedGames.filter((item) => item.onMap);
  const offMapGames = locatedGames.filter((item) => !item.onMap);
  const count = Math.max(onMapGames.length, 1);

  const layout = useMemo(() => {
    if (!width) return null;

    const canvasW = Math.max(width, 280);
    const narrow = canvasW < 700;
    const cardW = narrow ? (count > 20 ? 62 : 70) : count > 24 ? 70 : count > 16 ? 82 : 92;
    const cardH = narrow ? 44 : count > 24 ? 46 : count > 16 ? 54 : 60;
    const gutter = narrow ? 12 : 16;
    const mapW = Math.max(160, canvasW - (cardW + gutter) * 2);
    const mapH = mapW / MAP_ASPECT;
    const mapX = (canvasW - mapW) / 2;
    const mapY = cardH + gutter;
    const canvasH = mapH + (cardH + gutter) * 2;
    const outerX = mapX - gutter - cardW / 2;
    const outerY = mapY - gutter - cardH / 2;
    const outerW = mapW + gutter * 2 + cardW;
    const outerH = mapH + gutter * 2 + cardH;
    const peri = 2 * (outerW + outerH);
    const minDist = Math.max(cardW, cardH) + 6;

    const projection = geoAlbersUsa().fitExtent(
      [
        [mapX + 8, mapY + 8],
        [mapX + mapW - 8, mapY + mapH - 8],
      ],
      states
    );
    const statePath = geoPath(projection);
    const landmarkUnit = Math.min(1.05, Math.max(0.9, mapW / 620));
    const landmarks = placeMapLandmarks(projection, landmarkUnit);
    const withPins = onMapGames.flatMap((item) => {
      const point = projection([item.lng, item.lat]);
      if (!point) return [];
      return [{ ...item, pinPx: point[0], pinPy: point[1] }];
    });
    offsetDuplicatePins(withPins);
    const withPreferred = withPins.map((item) => ({
      ...item,
      preferredT: preferredPerimeterT(item.pinPx, item.pinPy, outerX, outerY, outerW, outerH),
    }));

    const spaced = unoverlapOnPerimeter(withPreferred, peri, minDist);
    const placed = spaced.map((item, index) => {
      const anchor = pointOnRect(item.t, outerX, outerY, outerW, outerH);
      return {
        ...item,
        edge: anchor.edge,
        cardW,
        cardH,
        cardX: clamp(anchor.x - cardW / 2, 0, canvasW - cardW),
        cardY: clamp(anchor.y - cardH / 2, 0, canvasH - cardH),
        curveSign: index % 2 === 0 ? 1 : -1,
      };
    });

    return { canvasW, canvasH, mapX, mapY, mapW, mapH, placed, statePath, landmarks, landmarkUnit };
  }, [width, onMapGames, count]);

  const renderCard = (item) => {
    const { game } = item;
    const away = game.competitors?.[0] || {};
    const home = game.competitors?.[1] || {};
    const started = hasGameStarted(game.startDateTime);
    const live = started && !game.isGameOver;
    const hovered = hoveredId === game._id;

    return (
      <div
        key={game._id}
        onMouseEnter={() => setHoveredId(game._id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          position: "absolute",
          left: item.cardX,
          top: item.cardY,
          width: item.cardW,
          height: item.cardH,
          boxSizing: "border-box",
          textDecoration: "none",
          color: "#111",
          background: "#fff",
          border: hovered ? "2px solid #3772FA" : "2px solid #111",
          borderLeft: `6px solid ${teamColor(home)}`,
          borderRadius: 6,
          padding: "4px 6px",
          fontFamily: "monospace",
          fontSize: item.cardW < 80 ? 10 : 11,
          fontWeight: 700,
          lineHeight: 1.15,
          zIndex: hovered ? 5 : 3,
          boxShadow: hovered ? "3px 3px 0 #3772FA" : "2px 2px 0 #111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <div style={{ color: live ? "#d1004a" : game.isGameOver ? "#111" : "#555" }}>
          {getStatusLabel(game)}
        </div>
        {[away, home].map((competitor) => (
          <button
            key={competitor._id}
            type="button"
            disabled={started || !competitor._id}
            onClick={() => onTeamPick?.(game, competitor._id)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 6,
              width: "100%",
              border: 0,
              padding: 0,
              color: "inherit",
              background: competitor.selected ? "#dbe6ff" : "transparent",
              font: "inherit",
              fontWeight: competitor.selected ? 800 : "inherit",
              textAlign: "left",
              cursor: started ? "default" : "pointer",
            }}
          >
            <span>{teamAbbr(competitor)}</span>
            <span>{started ? competitor.score ?? 0 : ""}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div ref={wrapRef} className="america-map-root">
      {loading && (
        <div style={{ padding: 16 }}>
          <div style={{ height: 320, background: "#e7e7e7", borderRadius: 8 }} />
        </div>
      )}
      {!loading && layout && (
        <div className="america-map-scroll">
          <div
            className="america-map-canvas"
            style={{
              position: "relative",
              width: layout.canvasW,
              height: layout.canvasH,
              margin: "0 auto",
            }}
          >
            <svg
              width={layout.canvasW}
              height={layout.canvasH}
              viewBox={`0 0 ${layout.canvasW} ${layout.canvasH}`}
              role="img"
              aria-label="Map of the United States"
              style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "visible", pointerEvents: "none" }}
            >
              <rect
                x={layout.mapX}
                y={layout.mapY}
                width={layout.mapW}
                height={layout.mapH}
                fill="#4aa3d8"
                rx="10"
              />
              {states.features.map((state) => (
                <path
                  key={state.id}
                  data-fips={state.id}
                  d={layout.statePath(state)}
                  fill={landFill(state.id)}
                  stroke="#1d6b2a"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
              ))}
              <defs>
                {layout.placed.map((item) => {
                  const color = teamColor(item.game.competitors?.[1]);
                  const id = `america-arrow-${item.game._id}`;
                  return (
                    <marker
                      key={id}
                      id={id}
                      markerWidth="9"
                      markerHeight="9"
                      refX="7"
                      refY="4.5"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <path d="M0,0 L9,4.5 L0,9 Z" fill={color} />
                    </marker>
                  );
                })}
                <mask id="america-emoji-mask" maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width={layout.canvasW} height={layout.canvasH} fill="white" />
                  {layout.landmarks.scenery.map((item) => (
                    <circle
                      key={item.id}
                      cx={item.x}
                      cy={item.y}
                      r={16 * layout.landmarkUnit}
                      fill="black"
                    />
                  ))}
                  {layout.landmarks.teams.map((item) => (
                    <circle
                      key={item.id}
                      cx={item.x}
                      cy={item.y}
                      r={12 * layout.landmarkUnit}
                      fill="black"
                    />
                  ))}
                </mask>
              </defs>
              <g mask="url(#america-emoji-mask)">
              {layout.placed.map((item, index) => {
                const start = cardAnchor(item, item.edge);
                const color = teamColor(item.game.competitors?.[1]);
                const hovered = hoveredId === item.game._id;
                const d = curvePath(
                  start.x,
                  start.y,
                  item.pinPx,
                  item.pinPy,
                  item.curveSign || (index % 2 === 0 ? 1 : -1)
                );
                return (
                  <g key={item.game._id} opacity={hoveredId && !hovered ? 0.28 : 1}>
                    <path d={d} fill="none" stroke="#fff" strokeWidth={hovered ? 7 : 5} strokeLinecap="round" />
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeWidth={hovered ? 3.5 : 2.25}
                      strokeLinecap="round"
                      markerEnd={`url(#america-arrow-${item.game._id})`}
                    />
                  </g>
                );
              })}
              </g>
              {layout.placed.map((item) => {
                const color = teamColor(item.game.competitors?.[1]);
                const hovered = hoveredId === item.game._id;
                return (
                  <g key={`${item.game._id}-pin`} opacity={hoveredId && !hovered ? 0.28 : 1}>
                    <circle cx={item.pinPx} cy={item.pinPy} r={hovered ? 6 : 4.5} fill="#fff" stroke="#111" strokeWidth="1.5" />
                    <circle cx={item.pinPx} cy={item.pinPy} r={hovered ? 3.5 : 2.5} fill={color} />
                  </g>
                );
              })}
              <MapLandmarks landmarks={layout.landmarks} unit={layout.landmarkUnit} />
            </svg>
            {layout.placed.map(renderCard)}
          </div>
        </div>
      )}
      {!loading && offMapGames.length > 0 && (
        <div className="america-map-elsewhere">
          <div className="america-map-elsewhere-title">Elsewhere</div>
          <div className="america-map-elsewhere-row">
            {offMapGames.map((item) => {
              const { game } = item;
              const away = game.competitors?.[0] || {};
              const home = game.competitors?.[1] || {};
              const started = hasGameStarted(game.startDateTime);
              return (
                <div
                  key={game._id}
                  className="america-map-elsewhere-card"
                >
                  <div>{getStatusLabel(game)}</div>
                  {[away, home].map((competitor) => (
                    <button
                      key={competitor._id}
                      type="button"
                      disabled={started || !competitor._id}
                      onClick={() => onTeamPick?.(game, competitor._id)}
                      className={competitor.selected ? "america-map-team-selected" : undefined}
                    >
                      {teamAbbr(competitor)} {started ? competitor.score ?? 0 : ""}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!loading && games.length === 0 && (
        <div style={{ textAlign: "center", padding: "12px 0 24px", fontFamily: "monospace", fontWeight: 700 }}>
          No games this week to place on the map.
        </div>
      )}
    </div>
  );
};

export default AmericaMap;
