import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

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

    const homeVenue = game.competitors[1] || {};
    const defaultStadiumDescription = Array.isArray(homeVenue.stadiumLocation)
      ? homeVenue.stadiumLocation.join("\n")
      : "";
  
    return (
      <div style={{ padding: "16px", textAlign: "left" }}>
        <div>
          <Checkbox
            name="isGameOver"
            color="primary"
            checked={isGameOver}
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={handleInputChange}
          />
          is game over
        </div>
        <div>
          <Checkbox
            name="isHidden"
            color="primary"
            checked={isHidden}
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={handleInputChange}
          />
          is hidden
        </div>
        <div>
          <Checkbox
            name="isGameOfTheWeek"
            color="primary"
            checked={Boolean(isGameOfTheWeek)}
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
              label={game.competitors[0].shortLocation + " score"}
              type="number"
              defaultValue={awayScore}
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
              label={game.competitors[1].shortLocation + " score"}
              type="number"
              defaultValue={homeScore}
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
              label={game.competitors[0].shortLocation + " rank"}
              type="number"
              defaultValue={awayRank}
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
              label={game.competitors[1].shortLocation + " rank"}
              type="number"
              defaultValue={homeRank}
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
              label={game.competitors[0].shortLocation + " record"}
              type="string"
              defaultValue={awayRecord}
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
              label={game.competitors[1].shortLocation + " record"}
              type="string"
              defaultValue={homeRecord}
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
              label={game.competitors[0].shortLocation + " spread"}
              type="number"
              defaultValue={awaySpread}
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
              label={game.competitors[1].shortLocation + " spread"}
              type="number"
              defaultValue={homeSpread}
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
            defaultValue={currentTime}
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
            defaultValue={gameDate}
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
            defaultValue={gameTime}
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
            defaultValue={gameName}
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
            defaultValue={liveVideoUrl}
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
            defaultValue={highlightVideoUrl}
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