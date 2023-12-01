import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

import TabPanel from "../../TabPanel";
import a11yProps from "../../../utilities/a11yProps";
import { watchLiveGames } from "../../../config";
import { hasGameStarted } from "../../../utilities";

const GamePlayHistory = (props) => {
  const [show, setShow] = React.useState(false);

  const handleChange = (event) => {
    setShow(!show);
  };

  const { game } = props;
  return (
    <div className="play-history">
      {!show &&
        (game.playHistory || []).slice(0, 5).map((play, playIndex) => {
          return (
            <div
              key={playIndex}
              style={{
                margin: "4px 0",
                display: "flex",
                opacity:
                  !show &&
                  playIndex === 4 &&
                  (game.playHistory || []).length > 5
                    ? ".1"
                    : "1",
              }}
            >
              <div
                style={{
                  minWidth: "40px",
                  padding: "4px",
                  backgroundColor: "rgb(45, 232, 149)",
                  marginRight: "4px",
                }}
              >
                <div>
                  {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                    ? play.quarter
                    : play.quarter === 1
                    ? "1st"
                    : play.quarter === 2
                    ? "2nd"
                    : play.quarter === 3
                    ? "3rd"
                    : play.quarter + "th"}
                </div>
                {!["59723313734d1d6202a85f21"].includes(game?.leagueId) && (
                  <div>
                    {(play.time / 100).toFixed(3).toString().slice(-1) === "0"
                      ? (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":")
                      : (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":") +
                        "." +
                        (play.time / 100).toFixed(3).toString().slice(-1)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
            </div>
          );
        })}
      {show &&
        (game.playHistory || []).map((play, playIndex) => {
          return (
            <div key={playIndex} style={{ margin: "4px 0", display: "flex" }}>
              <div
                style={{
                  minWidth: "40px",
                  padding: "4px",
                  backgroundColor: "rgb(45, 232, 149)",
                  marginRight: "4px",
                }}
              >
                <div>
                  {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                    ? play.quarter
                    : play.quarter === 1
                    ? "1st"
                    : play.quarter === 2
                    ? "2nd"
                    : play.quarter === 3
                    ? "3rd"
                    : play.quarter + "th"}
                </div>
                {!["59723313734d1d6202a85f21"].includes(game?.leagueId) && (
                  <div>
                    {(play.time / 100).toFixed(3).toString().slice(-1) === "0"
                      ? (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":")
                      : (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":") +
                        "." +
                        (play.time / 100).toFixed(3).toString().slice(-1)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
            </div>
          );
        })}
      {(game.playHistory || []).length > 5 && (
        <div
          style={{
            color: "rgba(0,0,0,0.87)",
            fontSize: "15px",
            margin: "4px 17%",
            padding: "2px",
            border: "3px solid rgba(0,0,0,0.87)",
            borderRadius: "8px",
          }}
          onClick={handleChange}
        >
          {show ? "show less -" : "show more +"}
        </div>
      )}
    </div>
  );
};

const WorldFootballGamePlayHistory = (props) => {
  const { classes, game } = props;

  return (
    <div className={"play-history " + classes.lastPlay}>
      {(game.playHistory || []).map((play, playIndex) => (
        <div key={playIndex} style={{ margin: "4px 0", display: "flex" }}>
          <div
            style={{
              minWidth: "40px",
              padding: "4px",
              backgroundColor: play.color,
              marginRight: "4px",
              color: "#fff",
            }}
          >
            {play.shortLocation}
          </div>
          <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
        </div>
      ))}
    </div>
  );
};

const GameHighlights = (props) => {
  const [show, setShow] = React.useState(false);

  const handleChange = (event) => {
    setShow(!show);
  };

  let quarter;

  const { game } = props;

  return (
    <div className="game-highlight">
      <div style={{ margin: "4px 0", display: "flex" }}>
        <div
          style={{
            minWidth: "40px",
            padding: "4px",
            backgroundColor: "#1e90ff",
            color: "#fff",
            marginRight: "4px",
          }}
        >
          MvY Highlights
        </div>
      </div>
      {!show &&
        (game.highlights || []).slice(0, 5).map((play, playIndex) => {
          return (
            <div
              key={playIndex}
              style={{
                margin: "4px 0",
                display: "flex",
                opacity:
                  !show && playIndex === 4 && (game.highlights || []).length > 5
                    ? ".1"
                    : "1",
              }}
            >
              <div
                style={{
                  minWidth: "40px",
                  padding: "4px",
                  backgroundColor: "#1e90ff",
                  color: "#fff",
                  marginRight: "4px",
                }}
              >
                <div>
                  {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                    ? play.quarter
                    : play.quarter === 1
                    ? "1st"
                    : play.quarter === 2
                    ? "2nd"
                    : play.quarter === 3
                    ? "3rd"
                    : play.quarter + "th"}
                </div>
                {!["59723313734d1d6202a85f21"].includes(game?.leagueId) && (
                  <div>
                    {(play.time / 100).toFixed(3).toString().slice(-1) === "0"
                      ? (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":")
                      : (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":") +
                        "." +
                        (play.time / 100).toFixed(3).toString().slice(-1)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
            </div>
          );
        })}
      {show &&
        (game.highlights || []).map((play, playIndex) => {
          let newQuarter = play.quarter;
          let isNewQuarter = quarter !== newQuarter;
          if (isNewQuarter) quarter = newQuarter;

          return (
            <div key={playIndex}>
              {isNewQuarter && (
                <div style={{ display: "flex", margin: "10px 0" }}>
                  <div
                    style={{ borderTop: "1px solid lightgray", width: "50%" }}
                  />
                  <div
                    style={{
                      fontFamily: "monospace",
                      position: "relative",
                      margin: "-7px 10px 0 10px",
                    }}
                  >
                    {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                      ? quarter
                      : quarter === 1
                      ? "1st"
                      : quarter === 2
                      ? "2nd"
                      : quarter === 3
                      ? "3rd"
                      : quarter + "th"}
                  </div>
                  <div
                    style={{ borderTop: "1px solid lightgray", width: "50%" }}
                  />
                </div>
              )}
              <div style={{ margin: "4px 0", display: "flex" }}>
                <div
                  style={{
                    minWidth: "40px",
                    padding: "4px",
                    backgroundColor: "#1e90ff",
                    color: "#fff",
                    marginRight: "4px",
                  }}
                >
                  <div>
                    {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                      ? play.quarter
                      : play.quarter === 1
                      ? "1st"
                      : play.quarter === 2
                      ? "2nd"
                      : play.quarter === 3
                      ? "3rd"
                      : play.quarter + "th"}
                  </div>
                  {!["59723313734d1d6202a85f21"].includes(game?.leagueId) && (
                    <div>
                      {(play.time / 100).toFixed(3).toString().slice(-1) === "0"
                        ? (play.time / 100)
                            .toFixed(2)
                            .toString()
                            .replace(".", ":")
                        : (play.time / 100)
                            .toFixed(2)
                            .toString()
                            .replace(".", ":") +
                          "." +
                          (play.time / 100).toFixed(3).toString().slice(-1)}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
              </div>
            </div>
          );
        })}
      {(game.highlights || []).length > 5 && (
        <div
          style={{
            color: "rgba(0,0,0,0.87)",
            fontSize: "15px",
            margin: "4px 17%",
            padding: "2px",
            border: "3px solid rgba(0,0,0,0.87)",
            borderRadius: "8px",
          }}
          onClick={handleChange}
        >
          {show ? "show less -" : "show more +"}
        </div>
      )}
    </div>
  );
};

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

const GamePlayTabs = (props) => {
  const { game, classes, isAuthenticated, userId } = props;

  const [value, setValue] = React.useState(game.isGameOver ? 1 : 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: "2",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "relative",
          zIndex: "3",
          backgroundColor: "#fff",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="game play tabs"
          style={{
            paddingBottom: "20px",
            width: "fit-content",
            margin: "auto",
          }}
        >
          <Tab label="Plays 🕹" {...a11yProps(0)} />
          <Tab label="Highlights 📸" {...a11yProps(1)} />
          <Tab label="Stats 🍿" {...a11yProps(2)} />
          {watchLiveGames &&
            ([
              "59723313734d1d6202a85f10",
              "59723313734d1d6202a85f15",
              "59723313734d1d6202a85f19",
            ].includes(game?.leagueId) ||
              game.liveVideoUrl ||
              game.highlightVideoUrl) && (
              <Tab label="Watch Live 📺" {...a11yProps(3)} />
            )}
          {isAuthenticated &&
            userId === "google-oauth2|114172296334563495985" && (
              <Tab label="Edit" {...a11yProps(3)} />
            )}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {hasGameStarted(game.startDateTime) &&
          (game.playHistory || []).length > 0 &&
          ["59723313734d1d6202a85f17", "59723313734d1d6202a85f29"].includes(
            game?.leagueId
          ) && <WorldFootballGamePlayHistory {...props} />}
        {hasGameStarted(game.startDateTime) &&
          (game.playHistory || []).length > 0 &&
          !["59723313734d1d6202a85f17", "59723313734d1d6202a85f29"].includes(
            game?.leagueId
          ) && (
            <div className={classes.lastPlay}>
              {<GamePlayHistory {...props} />}
            </div>
          )}
        {!hasGameStarted(game.startDateTime) && (
          <div>Please wait for game to start to see play history.</div>
        )}
        {hasGameStarted(game.startDateTime) &&
          game.playHistory.length === 0 && (
            <div>No play history available.</div>
          )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {hasGameStarted(game.startDateTime) &&
          (game.highlights || []).length > 0 &&
          !["59723313734d1d6202a85f17", "59723313734d1d6202a85f29"].includes(
            game?.leagueId
          ) && (
            <div className={classes.lastPlay}>
              {hasGameStarted(game.startDateTime) &&
                (game.highlights || []).length > 0 &&
                ![
                  "59723313734d1d6202a85f17",
                  "59723313734d1d6202a85f29",
                ].includes(game?.leagueId) && <GameHighlights {...props} />}
            </div>
          )}
        {!hasGameStarted(game.startDateTime) && (
          <div>Please wait for game to start to see highlights.</div>
        )}
        {hasGameStarted(game.startDateTime) && game.highlights.length === 0 && (
          <div>No highlights available.</div>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {(game.stats || []).length > 0 && (
          <div style={{ fontSize: "14px", fontFamily: "monospace" }}>
            <div style={{ padding: "10px" }}>
              <div style={{ display: "flex" }}>
                <div style={{ height: "24px" }}></div>
                <div style={{ position: "absolute", right: "100px" }}>
                  {game.stats[0].awayTeam.name}
                </div>
                <div style={{ position: "absolute", right: "10px" }}>
                  {game.stats[1].homeTeam.name}
                </div>
              </div>
              {(game.stats || []).map((stat, statIndex) => (
                <div key={statIndex}>
                  {stat.header && (
                    <div style={{ margin: "10px 0" }}>{stat.header}</div>
                  )}
                  <div style={{ display: "flex" }}>
                    <div>{stat.name}</div>
                    <div style={{ position: "absolute", right: "100px" }}>
                      {stat.awayTeam.value}
                    </div>
                    <div style={{ position: "absolute", right: "10px" }}>
                      {stat.homeTeam.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {(game.stats || []).length === 0 && (
          <div>
            No stats available. Please check last season stats by selecting year
            above.
          </div>
        )}
      </TabPanel>
      {watchLiveGames &&
        ([
          "59723313734d1d6202a85f10",
          "59723313734d1d6202a85f15",
          "59723313734d1d6202a85f19",
        ].includes(game?.leagueId) ||
          (game.liveVideoUrl && game.liveVideoUrl !== "") ||
          (game.highlightVideoUrl && game.highlightVideoUrl !== "")) && (
          <TabPanel value={value} index={3}>
            {hasGameStarted(game.startDateTime) &&
              !game.isGameOver &&
              ([
                "59723313734d1d6202a85f10",
                "59723313734d1d6202a85f15",
                "59723313734d1d6202a85f19",
              ].includes(game?.leagueId) ||
                (game.liveVideoUrl && game.liveVideoUrl !== "")) &&
              game?.currentTime?.toLowerCase() !== "halftime" && (
                <div
                  className="video-stream"
                  style={{
                    zIndex: 2,
                    position: "relative",
                    top: "-250px",
                    marginBottom: "-250px",
                  }}
                >
                  <iframe
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                    allowfullscreen
                    scrolling="no"
                    style={{ width: "90%", height: "800px", border: "none" }}
                    title="enjoy!"
                    src={
                      game.liveVideoUrl && game.liveVideoUrl !== ""
                        ? game.liveVideoUrl
                        : game.serverLiveVideoUrl
                    }
                  />
                </div>
              )}
            {game.highlightVideoUrl &&
              game.highlightVideoUrl !== "" &&
              (game.isGameOver || !hasGameStarted(game.startDateTime)) && (
                <div>
                  <iframe
                    style={{ borderStyle: "none" }}
                    width="90%"
                    height="215"
                    title="highlight"
                    src={game.highlightVideoUrl}
                  />
                </div>
              )}
            {!hasGameStarted(game.startDateTime) && (
              <div>Please wait for game to start to watch live.</div>
            )}
            {hasGameStarted(game.startDateTime) && game.isGameOver && (
              <div>Please come back next time before game ends.</div>
            )}
            {hasGameStarted(game.startDateTime) &&
              !game.isGameOver &&
              game?.currentTime?.toLowerCase === "halftime" && (
                <div>Please come back after halftime.</div>
              )}
          </TabPanel>
        )}
      {isAuthenticated && userId === "google-oauth2|114172296334563495985" && (
        <TabPanel value={value} index={3}>
          <GameEditor {...props} />
        </TabPanel>
      )}
    </Box>
  );
};

export default GamePlayTabs;
