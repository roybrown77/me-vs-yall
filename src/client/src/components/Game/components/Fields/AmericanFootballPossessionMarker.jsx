import { useId } from "react";
import PropTypes from "prop-types";

const TEAM_CY = 50;
const TEAM_RADIUS = 15.5;
const DIRECTION_ARROW_Y = 25;
const OCTAGON_TAN = Math.tan(Math.PI / 8);

const buildOctagonPoints = (cx, cy, r) => {
  const c = Number((r * OCTAGON_TAN).toFixed(2));
  const h = Number(r.toFixed(2));
  return [
    `${cx - c},${cy - h}`,
    `${cx + c},${cy - h}`,
    `${cx + h},${cy - c}`,
    `${cx + h},${cy + c}`,
    `${cx + c},${cy + h}`,
    `${cx - c},${cy + h}`,
    `${cx - h},${cy + c}`,
    `${cx - h},${cy - c}`,
  ].join(" ");
};

const buildTopGlossPoints = (cx, cy, r) => {
  const c = Number((r * OCTAGON_TAN).toFixed(2));
  const h = Number(r.toFixed(2));
  return [
    `${cx - c},${cy - h}`,
    `${cx + c},${cy - h}`,
    `${cx + h},${cy - c}`,
    `${cx + h},${cy - 1.5}`,
    `${cx - h},${cy + 2.5}`,
    `${cx - h},${cy - c}`,
  ].join(" ");
};

const OCTAGON_POINTS = buildOctagonPoints(0, TEAM_CY, TEAM_RADIUS);
const INNER_OCTAGON_POINTS = buildOctagonPoints(0, TEAM_CY, TEAM_RADIUS - 1.3);
const TOP_GLOSS_POINTS = buildTopGlossPoints(0, TEAM_CY, TEAM_RADIUS - 0.8);

const directionArrow = (direction) => {
  if (direction === "right") {
    return "➡️";
  }
  if (direction === "left") {
    return "⬅️";
  }
  return null;
};

const contrastTextColor = (color = "#333333") => {
  const hex = String(color).replace("#", "").trim();
  if (hex.length !== 6) {
    return "#ffffff";
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.62 ? "#111111" : "#ffffff";
};

const AmericanFootballPossessionMarker = ({
  ballX,
  teamLabel,
  teamColor,
  onClick,
  jostleSide,
  jostleDurationSec,
  jostleDelaySec,
  driveDirection,
}) => {
  const rawId = useId().replace(/:/g, "");
  const sheenGradId = `af-poss-sheen-${rawId}`;
  const glossGradId = `af-poss-gloss-${rawId}`;
  const sweepGradId = `af-poss-sweep-${rawId}`;
  const clipId = `af-poss-clip-${rawId}`;

  const label = String(teamLabel || "").trim().slice(0, 4).toUpperCase() || "—";
  const fill = teamColor || "#4a4a4a";
  const textFill = contrastTextColor(fill);
  const interactive = typeof onClick === "function";
  const arrow = directionArrow(driveDirection);
  const jostleClass =
    jostleSide === "away"
      ? " american-football-possession-marker--jostle-away"
      : jostleSide === "home"
        ? " american-football-possession-marker--jostle-home"
        : jostleSide === "possession"
          ? " american-football-possession-marker--jostle-possession"
          : "";

  return (
    <g
      className={`american-football-possession-marker${interactive ? "" : " is-display-only"}${jostleClass}`}
      style={
        jostleSide
          ? {
              animationDuration: `${jostleDurationSec ?? 2.8}s`,
              animationDelay: `${jostleDelaySec ?? 0}s`,
            }
          : undefined
      }
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${label} possession` : `${label} at midfield`}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <defs>
        <linearGradient id={sheenGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.52" />
          <stop offset="28%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={glossGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.46" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={sweepGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <polygon points={OCTAGON_POINTS} />
        </clipPath>
      </defs>
      <g transform={`translate(${ballX}, 0)`}>
        {arrow ? (
          <text
            className="american-football-possession-marker__direction"
            x="0"
            y={DIRECTION_ARROW_Y}
            textAnchor="middle"
            aria-hidden="true"
          >
            {arrow}
          </text>
        ) : null}
        <g className="american-football-possession-marker__badge">
          <polygon
            className="american-football-possession-marker__head"
            points={OCTAGON_POINTS}
            fill={fill}
          />
          <polygon
            className="american-football-possession-marker__sheen"
            points={OCTAGON_POINTS}
            fill={`url(#${sheenGradId})`}
          />
          <polygon
            className="american-football-possession-marker__gloss"
            points={TOP_GLOSS_POINTS}
            fill={`url(#${glossGradId})`}
          />
          <g clipPath={`url(#${clipId})`} pointerEvents="none">
            <g transform={`rotate(25 0 ${TEAM_CY})`}>
              <rect
                className="american-football-possession-marker__shine-sweep"
                x={-TEAM_RADIUS * 2.2}
                y={TEAM_CY - TEAM_RADIUS * 1.5}
                width={TEAM_RADIUS * 0.95}
                height={TEAM_RADIUS * 3}
                fill={`url(#${sweepGradId})`}
              />
            </g>
          </g>
          <polygon
            className="american-football-possession-marker__inner-rim"
            points={INNER_OCTAGON_POINTS}
          />
        </g>
        <text
          className="american-football-possession-marker__label"
          x="0"
          y={TEAM_CY + 4.5}
          textAnchor="middle"
          fill={textFill}
        >
          {label}
        </text>
      </g>
    </g>
  );
};

AmericanFootballPossessionMarker.propTypes = {
  ballX: PropTypes.number.isRequired,
  teamLabel: PropTypes.string,
  teamColor: PropTypes.string,
  onClick: PropTypes.func,
  jostleSide: PropTypes.oneOf(["away", "home", "possession"]),
  jostleDurationSec: PropTypes.number,
  jostleDelaySec: PropTypes.number,
  driveDirection: PropTypes.oneOf(["left", "right"]),
};

export default AmericanFootballPossessionMarker;
