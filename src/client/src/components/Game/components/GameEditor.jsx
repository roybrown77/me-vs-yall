import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import moment from "moment-timezone";
import get from "lodash/get";

const GameEditor = (props) => {
    const {
      game,
      awayScore,
      homeScore,
      awayRank,
      homeRank,
      awayRecord,
      homeRecord,
      awaySpread,
      homeSpread,
      gameName,
      isGameOver,
      currentTime,
      gameDate,
      gameTime,
      liveVideoUrl,
      highlightVideoUrl,
      handleInputChange,
      handleSaveGame,
      isHidden,
      isGameOfTheWeek,
      homeStadiumName,
      homeStadiumCity,
      homeStadiumDescription,
    } = props;

    const awayCompetitor = get(game, "competitors.0") || {};
    const homeCompetitor = get(game, "competitors.1") || {};
    const homeVenue = homeCompetitor;
    const defaultStadiumDescription = Array.isArray(homeVenue.stadiumLocation)
      ? homeVenue.stadiumLocation.join("\n")
      : "";

    const spread = get(game, "spread");
    const savedAwaySpread =
      spread?.teamId === awayCompetitor._id && spread?.amount !== undefined && spread?.amount !== null
        ? spread.amount
        : "";
    const savedHomeSpread =
      spread?.teamId === homeCompetitor._id && spread?.amount !== undefined && spread?.amount !== null
        ? spread.amount
        : "";

    const startMoment = game?.startDateTime
      ? moment(game.startDateTime).tz("America/New_York")
      : null;
    const savedGameDate =
      startMoment && startMoment.isValid()
        ? startMoment.format("YYYY-MM-DD")
        : "";
    const savedGameTime =
      startMoment && startMoment.isValid() ? startMoment.format("HH:mm") : "";

    const savedGameName =
      game?.rawGameName ??
      (typeof game?.gameName === "string" && game.gameName.includes(" *** ")
        ? game.gameName.split(" *** ")[0]
        : game?.gameName) ??
      "";

    const awayLabel = (awayCompetitor.shortLocation || awayCompetitor.name || "Away") + " ";
    const homeLabel = (homeCompetitor.shortLocation || homeCompetitor.name || "Home") + " ";

    return (
      <div style={{ padding: "16px", textAlign: "left" }}>
        <div>
          <Checkbox
            name="isGameOver"
            color="primary"
            checked={
              isGameOver !== null && isGameOver !== undefined
                ? Boolean(isGameOver)
                : Boolean(game?.isGameOver)
            }
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={handleInputChange}
          />
          is game over
        </div>
        <div>
          <Checkbox
            name="isHidden"
            color="primary"
            checked={
              isHidden !== null && isHidden !== undefined
                ? Boolean(isHidden)
                : Boolean(game?.isHidden)
            }
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={handleInputChange}
          />
          is hidden
        </div>
        <div>
          <Checkbox
            name="isGameOfTheWeek"
            color="primary"
            checked={
              isGameOfTheWeek !== null && isGameOfTheWeek !== undefined
                ? Boolean(isGameOfTheWeek)
                : Boolean(get(game, "isGameOfTheWeek"))
            }
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={handleInputChange}
          />
          is game of the week
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <TextField
              name="awayScore"
              id="outlined-number"
              label={awayLabel + "score"}
              type="number"
              defaultValue={awayScore ?? awayCompetitor.score ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
          <div style={{ paddingLeft: "16px" }}>
            <TextField
              name="homeScore"
              id="outlined-number"
              label={homeLabel + "score"}
              type="number"
              defaultValue={homeScore ?? homeCompetitor.score ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "16px" }}>
          <div>
            <TextField
              name="awayRank"
              id="outlined-number"
              label={awayLabel + "rank"}
              type="number"
              defaultValue={awayRank ?? awayCompetitor.rank ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
          <div style={{ paddingLeft: "16px" }}>
            <TextField
              name="homeRank"
              id="outlined-number"
              label={homeLabel + "rank"}
              type="number"
              defaultValue={homeRank ?? homeCompetitor.rank ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "16px" }}>
          <div>
            <TextField
              name="awayRecord"
              id="outlined-number"
              label={awayLabel + "record"}
              type="string"
              defaultValue={awayRecord ?? awayCompetitor.record ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
          <div style={{ paddingLeft: "16px" }}>
            <TextField
              name="homeRecord"
              id="outlined-number"
              label={homeLabel + "record"}
              type="string"
              defaultValue={homeRecord ?? homeCompetitor.record ?? ""}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "16px" }}>
          <div>
            <TextField
              name="awaySpread"
              id="outlined-number"
              label={awayLabel + "spread"}
              type="number"
              defaultValue={awaySpread ?? savedAwaySpread}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
          <div style={{ paddingLeft: "16px" }}>
            <TextField
              name="homeSpread"
              id="outlined-number"
              label={homeLabel + "spread"}
              type="number"
              defaultValue={homeSpread ?? savedHomeSpread}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="currentTime"
            id="outlined-number"
            label="Game Clock"
            defaultValue={currentTime ?? game?.currentTime ?? ""}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="gameDate"
            id="outlined-number"
            label="Game Date"
            type="date"
            defaultValue={gameDate ?? savedGameDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="gameTime"
            id="outlined-number"
            label="Game Time"
            type="time"
            defaultValue={gameTime ?? savedGameTime}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="homeStadiumName"
            label="Stadium name (home venue)"
            defaultValue={homeStadiumName ?? homeVenue.stadiumName ?? ""}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="homeStadiumCity"
            label="Game location (city / region)"
            defaultValue={homeStadiumCity ?? homeVenue.stadiumCity ?? ""}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="homeStadiumDescription"
            label="Stadium description (one line per variant)"
            defaultValue={homeStadiumDescription ?? defaultStadiumDescription}
            fullWidth
            multiline
            minRows={3}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="gameName"
            id="outlined-number"
            label="Game Name"
            defaultValue={gameName ?? savedGameName}
            fullWidth
            multiline={true}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="liveVideoUrl"
            id="outlined-number"
            label="Live Video Url"
            defaultValue={liveVideoUrl ?? game?.liveVideoUrl ?? ""}
            fullWidth
            multiline={true}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            name="highlightVideoUrl"
            id="outlined-number"
            label="Highlight Video Url"
            defaultValue={highlightVideoUrl ?? game?.highlightVideoUrl ?? ""}
            fullWidth
            multiline={true}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <Button
            size="small"
            style={{
              fontWeight: "700",
              width: "25%",
              backgroundColor: "#3772FA",
              color: "#FFFFFF",
              borderColor: "#3772FA",
              "&:hover": {
                backgroundColor: "#3772FA",
                color: "#FFFFFF",
                borderColor: "#3772FA",
              },
            }}
            onClick={() => handleSaveGame(game._id)}
          >
            Save
          </Button>
        </div>
      </div>
    );
};

export default GameEditor;