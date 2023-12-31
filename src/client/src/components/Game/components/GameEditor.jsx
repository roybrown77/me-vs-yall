import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

const GameEditor = (props) => {
    const {
      classes,
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
    } = props;
  
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
            className={classes.saveButton}
            onClick={() => handleSaveGame(game._id)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

  export default GameEditor;