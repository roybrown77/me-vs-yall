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
  const { game, spreadMode, pick, competitor } = props;

  return (
    <Grid className="detail-competitor" item xs={12} sm container>
      <Grid item xs style={{ flexGrow: '1' }}>
        <Grid item>
          <div>
            {!["59723313734d1d6202a85f25", "59723313734d1d6202a85f27"].includes(
              get(game, "leagueId")
            ) && (
              <div style={{ 
                color: competitor.color,
                fontSize: "1.5rem",
                color: "#ffffff",
                padding: hasGameStarted(game.startDateTime) ? "4px" : "0",
                backgroundColor: hasGameStarted(game.startDateTime) || game.isGameOver ? competitor.color : "transparent",
                width: "3rem",
                margin: hasGameStarted(game.startDateTime) ? "0 auto" : "0",
                marginBottom: hasGameStarted(game.startDateTime) ? ".5rem" : "0",
                borderRadius: hasGameStarted(game.startDateTime) ? "4px" : "0",
                fontWeight: "bold", 
              }}>
                {hasGameStarted(game.startDateTime) || game.isGameOver
                  ? get(competitor, "score") || 0
                  : undefined}
              </div>
            )}
            {competitor.country && (
              <div style={{ fontSize: "70px" }}>
                {getFlag(competitor.country)}
              </div>
            )}
            <div
              style={{
                fontSize: competitor.shortLocation.length > 8 ? "1.5em" : 
                (competitor.shortLocation.length > 3 ? "1.75em" : "2.5em"),
                marginTop: competitor.country ? "-10px" : "0",
                fontWeight: "600",
                color: competitor.color,
                borderBottom: `1rem solid ${competitor.color2}`,
                maxWidth: "7rem",
                margin: "0 auto",
              }}
            >
              <span
                style={{
                  color: "lightgray",
                  fontSize: "17px",
                  paddingRight: competitor.rank ? "8px" : "0",
                }}
              >
                {competitor.rank}
              </span>
              {competitor.shortLocation}
            </div>
            <div
              style={{
                paddingBottom: "4px",
                fontSize: competitor.country ? "15px" : "20px",
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
            {competitor.record && (
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
