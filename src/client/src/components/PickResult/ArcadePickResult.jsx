import PropTypes from "prop-types";

import Skeleton from "@mui/material/Skeleton";

import { areAnyGamesOver, getResults } from "../../utilities";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "12px",
  margin: "10px 0 0 0",
  borderRadius: "16px",
  fontFamily: "monospace",
  position: "relative",
  overflow: "hidden",
};

const badgeStyle = {
  minWidth: "120px",
  padding: "10px 12px",
  borderRadius: "999px",
  background: "#fff",
  border: "2px solid #000",
  color: "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
};

const valueStyle = {
  fontSize: "22px",
  fontWeight: 900,
  lineHeight: 1,
};

const ArcadePickResult = ({ loading = false, games, picks, spreadMode = false }) => {
  const gamesOver = areAnyGamesOver(games);
  const results = getResults(games, picks, spreadMode);

  if (loading) {
    return (
      <div style={{ marginTop: "10px" }}>
        <Skeleton animation="pulse" height="56px" variant="rect" />
      </div>
    );
  }

  if (!gamesOver) return null;

  return (
    <div style={containerStyle} aria-label="Pick results">
      <div style={{ ...badgeStyle, paddingLeft: "18px" }}>
        <div style={labelStyle}>WINS</div>
        <div style={valueStyle}>{String(results?.wins ?? 0)}</div>
      </div>

      <div style={{ ...badgeStyle, paddingLeft: "18px" }}>
        <div style={labelStyle}>LOSSES</div>
        <div style={valueStyle}>{String(results?.losses ?? 0)}</div>
      </div>
    </div>
  );
};

ArcadePickResult.propTypes = {
  loading: PropTypes.bool,
  games: PropTypes.array,
  picks: PropTypes.array,
  spreadMode: PropTypes.bool,
};

export default ArcadePickResult;
