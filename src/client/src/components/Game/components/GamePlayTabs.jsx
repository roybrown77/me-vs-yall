import { useEffect, useMemo, useState } from 'react';
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
import GameQuarterScores from "./GameQuarterScores";
import GameEditor from "./GameEditor";

const FOOTBALL_LEAGUE_IDS = new Set([
  "59723313734d1d6202a85f10",
  "59723313734d1d6202a85f15",
]);

const getInitialTabKey = (game) => {
  if (!hasGameStarted(game.startDateTime)) {
    return (game.stats || []).length > 0 ? "stats" : "plays";
  }

  if (game.isGameOver) {
    if ((game.highlights || []).length > 0) {
      return "highlights";
    }
    return (game.stats || []).length > 0 ? "stats" : "highlights";
  }

  if ((game.playHistory || []).length > 0) {
    return "plays";
  }

  return "stats";
};

const GamePlayTabs = (props) => {
  const { game, isAuthenticated, userId } = props;

  const [activeTabKey, setActiveTabKey] = useState(() => getInitialTabKey(game));

  useEffect(() => {
    setActiveTabKey(getInitialTabKey(game));
  }, [game._id]);

  const enableWatchLiveGames = watchLiveGames &&
  ([
    "59723313734d1d6202a85f10",
    "59723313734d1d6202a85f15",
    "59723313734d1d6202a85f19",
  ].includes(game?.leagueId) ||
    (game.liveVideoUrl && game.liveVideoUrl !== "") ||
    (game.highlightVideoUrl && game.highlightVideoUrl !== ""));

  const enableGameEditor = isAuthenticated && userId === "google-oauth2|114172296334563495985";
  const showQuarterScoresTab = FOOTBALL_LEAGUE_IDS.has(String(game?.leagueId || ""));

  const tabs = useMemo(() => {
    const list = [
      { key: "plays", label: "Plays 🕹" },
      { key: "highlights", label: "Lights 📸" },
    ];

    if (showQuarterScoresTab) {
      list.push({ key: "quarters", label: "Qtrs 🏈" });
    }

    list.push({ key: "stats", label: "Stats 🤓" });

    if (enableWatchLiveGames) {
      list.push({ key: "watch", label: "Watch Live 📺" });
    }

    if (enableGameEditor) {
      list.push({ key: "edit", label: "Edit" });
    }

    return list;
  }, [enableGameEditor, enableWatchLiveGames, showQuarterScoresTab]);

  const tabIndex = tabs.findIndex((tab) => tab.key === activeTabKey);
  const resolvedTabIndex = tabIndex >= 0 ? tabIndex : 0;

  const handleTabChange = (event, newTabIndex) => {
    const nextTab = tabs[newTabIndex];
    if (nextTab) {
      setActiveTabKey(nextTab.key);
    }
  };

  const tabIdPrefix = `game-${game._id}`;

  const renderTabPanelContent = (tabKey) => {
    switch (tabKey) {
      case "plays":
        return (
          <>
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
              ) && <GamePlayHistory {...props} />}
            {!hasGameStarted(game.startDateTime) && (
              <div style={{ marginTop: "1.25rem" }}>
                Please wait for game to start to see play history.
              </div>
            )}
            {hasGameStarted(game.startDateTime) &&
              (game.playHistory || []).length === 0 && (
                <div style={{ marginTop: "1.25rem" }}>
                  Play history is not available.
                </div>
              )}
          </>
        );
      case "highlights":
        return (
          <>
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
              <div style={{ marginTop: "1.25rem" }}>
                Please wait for game to start to see highlights.
              </div>
            )}
            {hasGameStarted(game.startDateTime) &&
              (game.highlights || []).length === 0 && (
                <div style={{ marginTop: "1.25rem" }}>
                  Highlights are not available.
                </div>
              )}
          </>
        );
      case "quarters":
        return (
          <>
            {!hasGameStarted(game.startDateTime) && (
              <div style={{ marginTop: "1.25rem" }}>
                Please wait for game to start to see quarter scores.
              </div>
            )}
            {hasGameStarted(game.startDateTime) && <GameQuarterScores game={game} />}
          </>
        );
      case "stats":
        return (
          <div>
            <GameStats {...props} />
          </div>
        );
      case "watch":
        return (
          <>
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
              <div style={{ marginTop: "1.25rem" }}>
                Please wait for game to start to watch live.
              </div>
            )}
            {hasGameStarted(game.startDateTime) && game.isGameOver && (
              <div style={{ marginTop: "1.25rem" }}>
                Please come back next time before game ends.
              </div>
            )}
            {hasGameStarted(game.startDateTime) &&
              !game.isGameOver &&
              typeof game?.currentTime === "string" &&
              game.currentTime.toLowerCase() === "halftime" && (
                <div>Please come back after halftime.</div>
              )}
          </>
        );
      case "edit":
        return <GameEditor key={`editor-${game._id}`} {...props} />;
      default:
        return null;
    }
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
          value={resolvedTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={false}
          aria-label="game play tabs"
          sx={{
            width: "100%",
            maxWidth: "100%",
            paddingBottom: "1.25rem",
            "& .MuiTabs-scroller": {
              minWidth: 0,
            },
            "& .MuiTabs-list": {
              justifyContent: "safe center",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.key}
              label={tab.label}
              {...a11yProps(index, tabIdPrefix)}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <TabPanel
          key={tab.key}
          value={resolvedTabIndex}
          index={index}
          idPrefix={tabIdPrefix}
        >
          {renderTabPanelContent(tab.key)}
        </TabPanel>
      ))}
    </Box>
  );
};

export default GamePlayTabs;
