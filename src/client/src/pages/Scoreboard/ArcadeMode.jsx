import PropTypes from "prop-types";

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

// Hand-built anchor points (percent-based) across a simplified USA "land" area.
// These are intentionally coarse to keep an 8-bit feel.
const LAND_ANCHORS = [
  { x: 16, y: 44 },
  { x: 18, y: 54 },
  { x: 22, y: 38 },
  { x: 24, y: 48 },
  { x: 28, y: 58 },
  { x: 32, y: 42 },
  { x: 34, y: 52 },
  { x: 38, y: 62 },
  { x: 42, y: 44 },
  { x: 44, y: 54 },
  { x: 48, y: 38 },
  { x: 50, y: 48 },
  { x: 54, y: 58 },
  { x: 58, y: 42 },
  { x: 60, y: 52 },
  { x: 62, y: 62 },
  { x: 66, y: 46 },
  { x: 68, y: 56 },
  { x: 72, y: 40 },
  { x: 74, y: 50 },
  { x: 76, y: 60 },
  { x: 80, y: 44 },
  { x: 82, y: 54 },
  { x: 84, y: 64 },
  { x: 88, y: 46 },
  { x: 90, y: 56 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const pickAnchors = (count, seedKey) => {
  const start = hashStringToInt(seedKey) % LAND_ANCHORS.length;
  const chosen = [];

  // If there are more games than anchors, reuse anchors with small offsets
  // so tiles remain "on land" and we never get stuck.
  const uniqueOnly = count <= LAND_ANCHORS.length;
  const used = uniqueOnly ? new Set() : null;

  for (let i = 0; i < count; i += 1) {
    let idx = (start + i) % LAND_ANCHORS.length;

    if (uniqueOnly) {
      while (used.has(idx)) idx = (idx + 1) % LAND_ANCHORS.length;
      used.add(idx);
      chosen.push(LAND_ANCHORS[idx]);
      continue;
    }

    const base = LAND_ANCHORS[idx];
    const layer = Math.floor(i / LAND_ANCHORS.length);
    const offset = (layer % 3) * 1.4;
    const x = clamp(base.x + (layer % 2 === 0 ? offset : -offset), 8, 92);
    const y = clamp(base.y + (layer % 2 === 0 ? -offset : offset), 18, 78);
    chosen.push({ x, y });
  }

  return chosen;
};

const PixelUSAMap = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(380px, 60vh, 560px)",
        backgroundColor: "#EFFBF8",
        border: "6px solid #000",
        boxShadow: "-8px 8px 0px 0px #000",
        overflow: "hidden",
        imageRendering: "pixelated",
      }}
    >
      {/* Pixel grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(#E7E7E7 1px, transparent 1px), linear-gradient(90deg, #E7E7E7 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Simplified 8-bit land mass (not a traced outline) */}
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          shapeRendering: "crispEdges",
        }}
      >
        <rect x="0" y="0" width="100" height="60" fill="#EFFBF8" />
        {/* Land */}
        <path
          d="M12 22 H18 V20 H24 V18 H30 V16 H38 V14 H46 V13 H54 V14 H60 V16 H66 V18 H72 V20 H78 V21 H82 V22 H86 V24 H88 V26 H90 V30 H92 V34 H90 V36 H88 V38 H86 V40 H84 V42 H86 V44 H90 V46 H94 V50 H96 V54 H92 V58 H86 V56 H82 V52 H78 V50 H74 V49 H70 V51 H66 V55 H62 V53 H58 V51 H54 V53 H50 V55 H46 V53 H40 V51 H34 V49 H28 V47 H22 V45 H18 V42 H16 V38 H14 V34 H12 V28 Z"
          fill="#B3E6CA"
          stroke="#000"
          strokeWidth="1.2"
          shapeRendering="crispEdges"
        />
        {/* A couple of "mountain" pixels */}
        <rect x="26" y="30" width="2" height="2" fill="#FCE385" />
        <rect x="30" y="28" width="2" height="2" fill="#FCE385" />
        <rect x="42" y="32" width="2" height="2" fill="#FCE385" />
        <rect x="60" y="34" width="2" height="2" fill="#FCE385" />
      </svg>

      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
};

PixelUSAMap.propTypes = {
  children: PropTypes.node,
};

const GameTile = ({ game, pick, updatingPick, onMakePick, anchor }) => {
  const away = game?.competitors?.[0];
  const home = game?.competitors?.[1];
  const pickId = pick?.pickId;
  const isOver = !!game.isGameOver;
  const isStarted = hasGameStarted(game.startDateTime);

  const canPick = !isOver && !isStarted && !updatingPick;

  const tileBorder = isOver ? "#E7E7E7" : "#000";

  const handlePick = (teamId) => {
    if (!canPick) return;
    if (!teamId) return;
    onMakePick({ gameId: game._id, pickId: teamId });
  };

  const awaySelected = pickId && away?._id && pickId === away._id;
  const homeSelected = pickId && home?._id && pickId === home._id;

  return (
    <div
      style={{
        position: "absolute",
        left: `${anchor.x}%`,
        top: `${anchor.y}%`,
        transform: "translate(-50%, -50%)",
        width: "clamp(140px, 18vw, 190px)",
        background: "#fff",
        border: `4px solid ${tileBorder}`,
        boxShadow: "-6px 6px 0px 0px #000",
        fontFamily: "monospace",
        opacity: isOver ? 0.7 : 1,
        cursor: canPick ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <div
        style={{
          padding: "6px 8px",
          borderBottom: "2px solid #000",
          fontSize: "10px",
          fontWeight: 700,
          background: "#EFFBF8",
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span>{isOver ? "FINAL" : isStarted ? "LIVE" : "PICK"}</span>
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {game.startDateTimeDisplay || ""}
        </span>
      </div>

      <div style={{ display: "flex" }}>
        <div
          onClick={() => handlePick(away?._id)}
          style={{
            width: "50%",
            padding: "10px 8px",
            borderRight: "2px solid #000",
            background: awaySelected ? "#B3E6CA" : "#fff",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 800 }}>{getTeamLabel(away)}</div>
          <div style={{ fontSize: "10px" }}>{away?.score ?? ""}</div>
        </div>
        <div
          onClick={() => handlePick(home?._id)}
          style={{
            width: "50%",
            padding: "10px 8px",
            background: homeSelected ? "#B3E6CA" : "#fff",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 800 }}>{getTeamLabel(home)}</div>
          <div style={{ fontSize: "10px" }}>{home?.score ?? ""}</div>
        </div>
      </div>

      {!canPick && !isOver && (
        <div
          style={{
            padding: "6px 8px",
            fontSize: "10px",
            borderTop: "2px solid #000",
            background: "#FCE385",
            fontWeight: 700,
          }}
        >
          {isStarted ? "In progress" : updatingPick ? "Saving pick..." : "Locked"}
        </div>
      )}
    </div>
  );
};

GameTile.propTypes = {
  game: PropTypes.object.isRequired,
  pick: PropTypes.object,
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
  anchor: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
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

  const anchors = pickAnchors(allGames.length, `${allGames.length}-${allGames[0]?._id || ""}`);

  return (
    <div>
      <PageContainer>
        <ArcadeModeToggle
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={onArcadeModeOn}
          onArcadeModeOff={onArcadeModeOff}
        />
        <div style={{ marginTop: "10px" }}>
          <PixelUSAMap>
            {allGames.map((game, idx) => (
              <GameTile
                key={game._id}
                game={game}
                pick={(picks || []).find((p) => p.gameId === game._id)}
                updatingPick={updatingPick}
                onMakePick={onMakePick}
                anchor={anchors[idx]}
              />
            ))}
          </PixelUSAMap>
        </div>
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
