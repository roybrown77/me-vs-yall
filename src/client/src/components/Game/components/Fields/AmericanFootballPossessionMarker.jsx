import PropTypes from "prop-types";

const TEAM_CY = 50;
const TEAM_RADIUS = 10.5;
const DIRECTION_ARROW_Y = 30;

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
        <circle
          className="american-football-possession-marker__head"
          cx="0"
          cy={TEAM_CY}
          r={TEAM_RADIUS}
          fill={fill}
        />
        <text
          className="american-football-possession-marker__label"
          x="0"
          y={TEAM_CY + 3}
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
