import { useState } from 'react';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import TabPanel from "../../TabPanel";
import a11yProps from "../../../utilities/a11yProps";
import { watchLiveGames } from "../../../config";
import { hasGameStarted } from "../../../utilities";


import GamePlayHistory from "./GamePlayHistory";
import WorldFootballGamePlayHistory from "./WorldFootballGamePlayHistory";
import GameHighlights from "./GameHighlights";
import GameStats from "./GameStats";
import GameEditor from "./GameEditor";

const TabState = {
  PLAY_HISTORY: 0,
  HIGHLIGHTS: 1,
  STATS: 2,
  EDIT: 3
};

const getInitialTabValue = (game) => {
  if (!hasGameStarted(game.startDateTime)) {
      return (game.stats || []).length > 0 ? TabState.STATS : TabState.PLAY_HISTORY;
  }
  
  if (game.isGameOver) {
      if ((game.highlights || []).length > 0) {
          return TabState.HIGHLIGHTS;
      }
      return (game.stats || []).length > 0 ? TabState.STATS : TabState.HIGHLIGHTS;
  }

  if ((game.playHistory || []).length > 0) {
      return TabState.PLAY_HISTORY;
  }

  return TabState.STATS;
};

const GamePlayTabs = (props) => {
  const { game, isAuthenticated, userId } = props;

  const [tabValue, setTabValue] = useState(getInitialTabValue(game));

  const enableWatchLiveGames = watchLiveGames &&
  ([
    "59723313734d1d6202a85f10",
    "59723313734d1d6202a85f15",
    "59723313734d1d6202a85f19",
  ].includes(game?.leagueId) ||
    (game.liveVideoUrl && game.liveVideoUrl !== "") ||
    (game.highlightVideoUrl && game.highlightVideoUrl !== ""));

  const enableGameEditor = isAuthenticated && userId === "google-oauth2|114172296334563495985";

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
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
          value={tabValue}
          onChange={handleTabChange}
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
      <TabPanel value={tabValue} index={TabState.PLAY_HISTORY}>
        <div style={{ margin: "4px 0", display: "flex" }}>
          <div
            style={{
              minWidth: "40px",
              padding: "4px",
              backgroundColor: "rgb(45, 232, 149)",
              color: "rgba(0,0,0,0.87)",
              marginRight: "4px",
            }}
          >
            MvY Plays
          </div>
        </div>
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
            <GamePlayHistory {...props} />
          )}
        {!hasGameStarted(game.startDateTime) && (
          <div style={{ marginTop: '1.25rem' }}>Please wait for game to start to see play history.</div>
        )}
        {hasGameStarted(game.startDateTime) &&
          game.playHistory.length === 0 && (
            <div style={{ marginTop: '1.25rem' }}>Play history is not available.</div>
          )}
      </TabPanel>
      {/* MvY Highlights */}
      <TabPanel value={tabValue} index={TabState.HIGHLIGHTS}>
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
        {hasGameStarted(game.startDateTime) &&
          (game.highlights || []).length > 0 &&
          !["59723313734d1d6202a85f17", "59723313734d1d6202a85f29"].includes(
            game?.leagueId
          ) && (
            <div>
              {(game.highlights || []).length > 0 &&
                ![
                  "59723313734d1d6202a85f17",
                  "59723313734d1d6202a85f29",
                ].includes(game?.leagueId) && <GameHighlights {...props} />}
            </div>
          )}
        {!hasGameStarted(game.startDateTime) && (
          <div style={{ marginTop: '1.25rem' }}>Please wait for game to start to see highlights.</div>
        )}
        {hasGameStarted(game.startDateTime) && game.highlights.length === 0 && (
          <div style={{ marginTop: '1.25rem' }}>Highlights are not available.</div>
        )}
      </TabPanel>
      {/* Stats */}
      <TabPanel value={tabValue} index={TabState.STATS}>
        <div>
          <GameStats {...props} />
        </div>
      </TabPanel>
      {/* Watch Live Games */}
      {
        enableWatchLiveGames &&
        <TabPanel value={tabValue} index={TabState.EDIT}>
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
            <div style={{ marginTop: '1.25rem' }}>Please wait for game to start to watch live.</div>
          )}
          {hasGameStarted(game.startDateTime) && game.isGameOver && (
            <div style={{ marginTop: '1.25rem' }}>Please come back next time before game ends.</div>
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
        <TabPanel value={tabValue} index={TabState.EDIT}>
          <GameEditor {...props} />
        </TabPanel>
      }
    </Box>
  );
};

export default GamePlayTabs;
