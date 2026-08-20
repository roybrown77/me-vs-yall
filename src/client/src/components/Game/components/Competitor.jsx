import Grid from "@mui/material/Grid";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import get from "lodash/get";

import getFlag from "../getFlag";
import { hasGameStarted } from "../../../utilities";

const GamePredictionStatusIcon = (props) => {
  const { game, competitor, spreadMode, pick } = props;

  return (
    <div style={{ paddingLeft: "2px" }}>
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
        <Cancel style={{ color: "red", fontSize: '3rem' }} />
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
        <CheckCircle style={{ color: "green", fontSize: '3rem' }} />
      )}
    </div>
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

  return (
    <Grid className="detail-competitor" item xs={12} sm container>
      <Grid item xs style={{ flexGrow: '1' }}>
        <Grid item>
          <div>
            {shouldRenderScorePill && (
              <div style={{ 
                fontSize: slimMode ? "1.1rem" : "1.5rem",
                fontWeight: "bold",
                width: slimMode ? "2.25rem" : "3rem",
                color: shouldShowScoreInPill ? "#ffffff" : "transparent",
                backgroundColor: shouldShowScoreInPill ? scorePillBackgroundColor : "transparent",
                borderRadius: shouldShowScoreInPill ? "4px" : "0",
                padding: shouldShowScoreInPill ? "4px" : "0",
                margin: shouldShowScoreInPill ? "0 auto" : "0",
                marginBottom: shouldShowScoreInPill ? ".5rem" : "0",
                position: "relative",
                zIndex: 2,
                textAlign: "center",
              }}>
                {scoreDisplayValue}
              </div>
            )}
            {competitor.country && !slimMode && (
              <div style={{ fontSize: "70px" }}>
                {getFlag(competitor.country)}
              </div>
            )}
            <div
              style={{
                fontSize: slimMode
                  ? "1.25em"
                  : competitor.shortLocation.length > 8
                    ? "1.5em"
                    : competitor.shortLocation.length > 3
                      ? "1.75em"
                      : "2.5em",
                marginTop: competitor.country && !slimMode ? "-10px" : "0",
                fontWeight: "600",
                color: competitor.color,
                borderBottom: slimMode ? `0.35rem solid ${competitor.color2}` : `1rem solid ${competitor.color2}`,
                maxWidth: slimMode ? "100%" : "7rem",
                margin: "0 auto",
              }}
            >
              <span
                style={{
                  color: "#555555",
                  fontSize: slimMode ? "13px" : "17px",
                  fontWeight: "bold",
                  marginRight: competitor.rank ? "10px" : "0",
                }}
              >
                {competitor.rank}
              </span>
              {competitor.shortLocation}
            </div>
            <div
              style={{
                paddingBottom: "4px",
                fontSize: slimMode ? "13px" : competitor.country ? "15px" : "20px",
                padding: competitor.record
                  ? "0"
                  : (get(game, "isGameOver") && get(pick, "pickId")) ||
                    (get(game, "spread.amount") && spreadMode)
                  ? "4px 0"
                  : "4px 0",
              }}
            >
              {competitor.name}
            </div>
            {competitor.record && !slimMode && (
              <div
                style={{
                  fontSize: "16px",
                  color: "#BDBDBD",
                  padding:
                    (get(game, "isGameOver") && get(pick, "pickId")) ||
                    (get(game, "spread.amount") && spreadMode)
                      ? "4px 0"
                      : "4px 0",
                }}
              >
                {competitor.record}
              </div>
            )}
            <div style={{ display: "inline-flex", marginTop: "10px" }}>
              {get(game, "isGameOver") && competitor.selected && (
                <GamePredictionStatusIcon {...props} />
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Competitor;
