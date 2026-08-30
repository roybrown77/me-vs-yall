import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import get from "lodash/get";

import getFlag from "../getFlag";
import { hasGameStarted } from "../../../utilities";

const GamePredictionStatusIcon = (props) => {
  const { game, competitor, spreadMode, pick } = props;

  return (
    <>
      {((spreadMode &&
        get(game, "isGameOver") &&
        competitor.selected &&
        !competitor.selectedWinner) ||
        (!spreadMode &&
          get(game, "isGameOver") &&
          competitor.selected &&
          ((game.winner !== competitor._id &&
            get(pick, "pickId") === competitor._id) ||
            (game.winner !== "000000000000000000000000" &&
              get(pick, "pickId") === "000000000000000000000000")))) && (
        <Cancel style={{ color: "red", fontSize: "3rem" }} />
      )}
      {((spreadMode &&
        get(game, "isGameOver") &&
        competitor.selected &&
        competitor.selectedWinner) ||
        (!spreadMode &&
          get(game, "isGameOver") &&
          competitor.selected &&
          ((game.winner === competitor._id &&
            get(pick, "pickId") === competitor._id) ||
            (game.winner === "000000000000000000000000" &&
              get(pick, "pickId") === "000000000000000000000000")))) && (
        <CheckCircle style={{ color: "green", fontSize: "3rem" }} />
      )}
    </>
  );
};

const Competitor = (props) => {
  const {
    game,
    spreadMode,
    pick,
    competitor,
    slimMode = false,
    sharedTextSizes,
  } = props;
  const showLiveScore = hasGameStarted(game.startDateTime) || game.isGameOver;
  const hasCompetitorScore =
    get(competitor, "score") !== null && get(competitor, "score") !== undefined;
  const shouldShowScoreInPill = showLiveScore || hasCompetitorScore;
  const scorePillBackgroundColor = competitor?.color || "#1F2937";
  const scoreDisplayValue = shouldShowScoreInPill
    ? hasCompetitorScore
      ? get(competitor, "score")
      : 0
    : undefined;
  const showResultIcon = get(game, "isGameOver") && competitor.selected;

  const scorePill = shouldShowScoreInPill && (
    <div
      style={{
        fontSize: slimMode ? "1.1rem" : "1.5rem",
        fontWeight: "bold",
        width: slimMode ? "2.25rem" : "3rem",
        color: "#ffffff",
        backgroundColor: scorePillBackgroundColor,
        borderRadius: "4px",
        padding: "4px",
        margin: "0 auto",
        marginBottom: slimMode ? "0.35rem" : ".5rem",
        textAlign: "center",
      }}
    >
      {scoreDisplayValue}
    </div>
  );

  const locationStyle = {
    "--competitor-location-size": sharedTextSizes?.locationFontSize,
    color: competitor.color,
    borderBottom: `1rem solid ${competitor.color2}`,
  };

  const nameStyle = {
    "--competitor-name-size": sharedTextSizes?.nameFontSize,
    padding: competitor.record ? "0" : "4px 0",
  };

  const countryFlagBlock = competitor.country ? (
    <div style={{ fontSize: slimMode ? "2rem" : "70px", lineHeight: 1 }}>
      {getFlag(competitor.country)}
    </div>
  ) : null;

  const locationBlock = (
    <div className="competitor-location" style={locationStyle}>
      {competitor.rank ? (
        <span
          className="competitor-rank"
          style={{
            color: "#555555",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          {competitor.rank}
        </span>
      ) : null}
      {competitor.shortLocation}
    </div>
  );

  const nameBlock = (
    <div className="competitor-name" style={nameStyle}>
      {competitor.name}
    </div>
  );

  if (slimMode) {
    return (
      <div className="detail-competitor" style={{ textAlign: "center" }}>
        {scorePill}
        {countryFlagBlock}
        {locationBlock}
        {nameBlock}
        {showResultIcon ? <GamePredictionStatusIcon {...props} /> : null}
      </div>
    );
  }

  return (
    <div className="detail-competitor" style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          width: "3rem",
          color: shouldShowScoreInPill ? "#ffffff" : "transparent",
          backgroundColor: shouldShowScoreInPill ? scorePillBackgroundColor : "transparent",
          borderRadius: shouldShowScoreInPill ? "4px" : "0",
          padding: shouldShowScoreInPill ? "4px" : "0",
          margin: shouldShowScoreInPill ? "0 auto" : "0",
          marginBottom: shouldShowScoreInPill ? ".5rem" : "0",
          textAlign: "center",
        }}
      >
        {shouldShowScoreInPill ? scoreDisplayValue : null}
      </div>
      {countryFlagBlock}
      {locationBlock}
      {nameBlock}
      {competitor.record && (
        <div
          className="competitor-record"
          style={{
            color: "#BDBDBD",
            padding: "4px 0",
          }}
        >
          {competitor.record}
        </div>
      )}
      {showResultIcon ? (
        <div style={{ display: "inline-flex", marginTop: "10px" }}>
          <GamePredictionStatusIcon {...props} />
        </div>
      ) : null}
    </div>
  );
};

export default Competitor;
