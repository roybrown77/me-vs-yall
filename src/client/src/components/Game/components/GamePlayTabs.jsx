import { useState } from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import TabPanel from "../../TabPanel";
import a11yProps from "../../../utilities/a11yProps";
import { watchLiveGames } from "../../../config";
import { hasGameStarted } from "../../../utilities";

import GamePlayHistory from "./GamePlayHistory";
import WorldFootballGamePlayHistory from "./WorldFootballGamePlayHistory";
import GameHighlights from "./GameHighlights";
import GameEditor from "./GameEditor";

const GamePlayTabs = (props) => {
  const { game, classes, isAuthenticated, userId } = props;

  const [value, setValue] = useState(game.isGameOver ? 1 : 0);
  const [showGamesPlayedDetail, setShowGamesPlayedDetail] = useState({});

  const handleShowGamesPlayedDetail = (id) => {
    setShowGamesPlayedDetail({...showGamesPlayedDetail, [id]: !showGamesPlayedDetail?.[id]});
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const enableWatchLiveGames = watchLiveGames &&
  ([
    "59723313734d1d6202a85f10",
    "59723313734d1d6202a85f15",
    "59723313734d1d6202a85f19",
  ].includes(game?.leagueId) ||
    (game.liveVideoUrl && game.liveVideoUrl !== "") ||
    (game.highlightVideoUrl && game.highlightVideoUrl !== ""));

  const enableGameEditor = isAuthenticated && userId === "google-oauth2|114172296334563495985";

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
            paddingBottom: "1.25rem",
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
      {/* Play History */}
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
      {/* MvY Highlights */}
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
      {/* Stats */}
      <TabPanel value={value} index={2}>
        {(game.stats || []).length > 0 && (
          <div style={{ fontSize: "0.7rem", fontFamily: "monospace" }}>
            <div style={{ padding: "0.625rem" }}>
              <div style={{ display: "flex" }}>
                <div style={{ height: "1.5rem" }}></div>
                <div style={{ position: "absolute", right: "9.25rem" }}>
                  {game.stats[0].awayTeam.name}
                </div>
                <div style={{ position: "absolute", right: "0.625rem" }}>
                  {game.stats[1].homeTeam.name}
                </div>
              </div>
              {(game.stats || []).map((stat) => (
                <div key={game._id + '-' + stat.name} style={{ height: stat.name === 'Games Played' && showGamesPlayedDetail?.[game._id] && stat.homeTeam?.list?.length > 0 ? `${stat.homeTeam.list.length*.9 + 2}rem` : '' }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ cursor: 'pointer', height: '100%' }} onClick={() => stat.name === 'Games Played' ? handleShowGamesPlayedDetail(game._id) : null}>{stat.name} {stat.name === 'Games Played' ? showGamesPlayedDetail?.[game._id] ? '-' : '+' : ''}</div>
                    <div style={{ position: "absolute", right: "9.25rem" }}>
                      <div style={{ textAlign: 'right' }}>{stat.awayTeam.value}</div>
                      {
                        stat.name === 'Games Played' && showGamesPlayedDetail?.[game._id] &&
                        <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                          {
                            stat.awayTeam.list?.map(gamePlayed => (
                              <div style={{ fontWeight: '700', color: gamePlayed[0] === 'W' ? 'darkgreen' : '' }}>{gamePlayed}</div>
                            ))
                          }
                        </div>
                      }
                      </div>
                    <div style={{ position: "absolute", right: "0.625rem" }}>
                      <div style={{ textAlign: 'right' }}>{stat.homeTeam.value}</div>
                      {
                        stat.name === 'Games Played' && showGamesPlayedDetail?.[game._id] &&
                        <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                          {
                            stat.homeTeam.list?.map(gamePlayed => (
                              <div style={{ fontWeight: '700', color: gamePlayed[0] === 'W' ? 'darkgreen' : '' }}>{gamePlayed}</div>
                            ))
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {
          (game.stats || []).length === 0 &&
          <div>
            Stats are not available until after the first game of the season.
          </div>
        }
      </TabPanel>
      {/* Watch Live Games */}
      {
        enableWatchLiveGames &&
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
                  top: "-15.625rem",
                  marginBottom: "-15.625rem",
                }}
              >
                <iframe
                  sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                  allowfullscreen
                  scrolling="no"
                  style={{ width: "90%", height: "50rem", border: "none" }}
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
      }
      {/* Game Editor */}
      {
        enableGameEditor &&
        <TabPanel value={value} index={3}>
          <GameEditor {...props} />
        </TabPanel>
      }
    </Box>
  );
};

export default GamePlayTabs;
