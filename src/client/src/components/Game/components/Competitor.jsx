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
  const { game, spreadMode, pick, competitor, slimMode = false } = props;
  const isFightLeague = ["59723313734d1d6202a85f25", "59723313734d1d6202a85f27"].includes(
    get(game, "leagueId")
  );
  const showLiveScore = hasGameStarted(game.startDateTime) || game.isGameOver;
  const hasCompetitorScore =
    get(competitor, "score") !== null && get(competitor, "score") !== undefined;
  const shouldRenderScorePill = !isFightLeague;
  const shouldShowScoreInPill = showLiveScore || hasCompetitorScore;
  const scorePillBackgroundColor = competitor?.color || "#1F2937";
  const scoreDisplayValue = shouldShowScoreInPill
    ? hasCompetitorScore
      ? get(competitor, "score")
      : 0
    : undefined;
  const showResultIcon = get(game, "isGameOver") && competitor.selected;

  const scorePill = shouldRenderScorePill && shouldShowScoreInPill && (
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

  const locationStyle = slimMode
    ? {
        fontSize: "2.25em",
        fontWeight: "600",
        color: competitor.color,
        borderBottom: `1rem solid ${competitor.color2}`,
        maxWidth: "100%",
        margin: "0 auto",
        lineHeight: 1.05,
      }
    : {
        fontSize:
          competitor.shortLocation.length > 8
            ? "1.5em"
            : competitor.shortLocation.length > 3
              ? "1.75em"
              : "2.5em",
        marginTop: competitor.country ? "-10px" : "0",
        fontWeight: "600",
        color: competitor.color,
        borderBottom: `1rem solid ${competitor.color2}`,
        maxWidth: "7rem",
        margin: "0 auto",
      };

  const nameStyle = slimMode
    ? {
        fontSize: "1.25em",
        padding: "4px 0 0",
        lineHeight: 1.1,
      }
    : {
        paddingBottom: "4px",
        fontSize: competitor.country ? "15px" : "20px",
        padding: competitor.record ? "0" : "4px 0",
      };

  const locationBlock = (
    <div style={locationStyle}>
      {competitor.rank ? (
        <span
          style={{
            color: "#555555",
            fontSize: slimMode ? "0.45em" : "17px",
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

  const nameBlock = <div style={nameStyle}>{competitor.name}</div>;

  if (slimMode) {
    return (
      <div className="detail-competitor" style={{ textAlign: "center" }}>
        {scorePill}
        {locationBlock}
        {nameBlock}
        {showResultIcon ? <GamePredictionStatusIcon {...props} /> : null}
      </div>
    );
  }

  return (
    <div className="detail-competitor" style={{ textAlign: "center" }}>
      {shouldRenderScorePill && (
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
      )}
      {competitor.country && (
        <div style={{ fontSize: "70px" }}>{getFlag(competitor.country)}</div>
      )}
      {locationBlock}
      {nameBlock}
      {competitor.record && (
        <div
          style={{
            fontSize: "16px",
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
