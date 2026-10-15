import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import get from "lodash/get";
import last from "lodash/last";
import queryString from "query-string";

import Slide from "@mui/material/Slide";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import './leader.css';

import VegasWinCalculationPopup from "./VegasWinCalculationPopup";
import PageContainer from "../../components/PageContainer";
import ArcadeGameSearchBar from "../../components/GameSearchBar/ArcadeGameSearchBar";
import Countdown from "../../components/Countdown";
import GameEngagementBar from "../../components/GameEngagementBar";
import LeagueNotices from "../../components/LeagueNotices";
import LeaderHypeBanner from "../../components/LeaderHypeBanner";

import a11yProps from "../../utilities/a11yProps";
import { callApi, isRequestAborted } from "../../utilities/http";
import { getLeagueName } from '../../utilities/getLeagueName';
import {
  formatWeeks,
  getAreAllGamesOver,
  getAreAnyGamesInProgress,
  getLeagueStartDateTime,
  getLeaders,
  hasGameStarted,
  leagues,
} from "../../utilities";
import {
  googleLogin,
  isConfirmedAuthentication,
  getUser,
} from "../../utilities/authenticationClient";

import styles from "./styles";

import useLeagueWeekNavigation from "../../hooks/useLeagueWeekNavigation";
import usePollWhileGamesInProgress from "../../hooks/usePollWhileGamesInProgress";
import usePageSeo from "../../hooks/usePageSeo";

const isAuthenticated = isConfirmedAuthentication();

const leaderBackgroundColor = [
  "#CC8E91",
  "#CCB08E",
  "#CCCB8E",
  "#8ECC9E",
  "#8EB5CC",
  "#B08EB8",
  "#9A7FCC",
  "#8EC1CC",
  "#C2C191",
  "#C99E89",
  "#7FC3C1",
  "#90C6A2",
  "#C9B496",
  "#CC9EB1",
  "#A19FCC",
  "#B2C79D",
  "#CCC78E",
  "#A89ECC",
  "#CCB27F",
  "#9CCEAF"
];

const kingsAndVegasLeaderIds = new Set([
  "1",
  "2",
  "3",
  "4",
  "5",
  "12",
  "15",
  "17",
  "18",
  "19",
]);

const canShowLeaderPicksAndGuesses = ({ leaderId, game }) =>
  kingsAndVegasLeaderIds.has(String(leaderId)) ||
  game.isGameOver ||
  hasGameStarted(game.startDateTime);

const formatLeaderWinTotal = (value) =>
  Number(value ?? 0).toFixed(2).replace(/\.00$/, "");

const getLeaderRecord = ({ leader, isBonusPointsTab, areAnyGamesInProgress }) => {
  if (isBonusPointsTab) {
    return {
      interimWins: formatLeaderWinTotal(leader.adjustedWinsBeforeGameOver),
      interimLosses: leader.lossesBeforeGameOver,
      wins: formatLeaderWinTotal(
        areAnyGamesInProgress ? leader.adjustedWinsBeforeGameOver : leader.adjustedWins
      ),
      losses: areAnyGamesInProgress ? leader.lossesBeforeGameOver : leader.losses,
      totalWins: formatLeaderWinTotal(leader.adjustedWins),
      totalLosses: leader.losses,
    };
  }

  return {
    interimWins: leader.winsBeforeGameOver,
    interimLosses: leader.lossesBeforeGameOver,
    wins: areAnyGamesInProgress ? leader.winsBeforeGameOver : leader.wins,
    losses: areAnyGamesInProgress ? leader.lossesBeforeGameOver : leader.losses,
    totalWins: leader.wins,
    totalLosses: leader.losses,
  };
};

const getLeaderBonusLabel = (game) => {
  if (game.scoreGuessLabel) {
    return game.scoreGuessLabel;
  }

  if (!game.scoreGuessBump) {
    return "";
  }

  return `Bonus (+${Number(game.scoreGuessBump).toFixed(2).replace(/\.00$/, "")})`;
};

const getGameStreakEmoji = (wins, losses, winsInARow, lossesInARow) => {
  let emoji = "😅"; // neutral / balanced

  if (wins > 0 && (wins + losses) < 17) {
    emoji = "☘️";
    if (wins >= 3) emoji += "🌳";
    if (wins >= 5) emoji += "🍄";
    if (wins >= 7) emoji += "🍇";
    if (wins >= 9) emoji += "🥦";
    if (wins >= 11) emoji += "🍎";
    if (wins >= 13) emoji += "🥑";
    if (wins >= 14) emoji += "🍑";
    if (wins >= 15) emoji += "🫐";
    if (wins >= 16) emoji += "🍿"; 
  }
  
  if (lossesInARow > 0) {
    if (lossesInARow >= 2) emoji += "😬";
    if (lossesInARow >= 3) emoji += "🧊";
    emoji += "🥶";
  } else {
    if (wins > 0 && emoji.length > 1) {
      emoji += "😎";
    }

    if (wins > 1 && winsInARow > 1) {
      emoji += "🔥";
    }
  }

  return emoji;
};

const Leader = () => {
  const initialLeague = useMemo(() => {
    return leagues.find((league) => league.name === getLeagueName()) || leagues[0];
  }, []);

  const [dataLoading, setDataLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [failedLeaderPictures, setFailedLeaderPictures] = useState({});
  const loadRequestIdRef = useRef(0);
  const scoresRequestEpochGetterRef = useRef(() => 0);

  const [selectedLeaderTab, setSelectedLeaderTab] = useState(0);
  const isSpreadTab = selectedLeaderTab === 1;
  const isBonusPointsTab = selectedLeaderTab === 2;

  const handleLeaderTabChange = (_, selectedTab) => {
    setSelectedLeaderTab(selectedTab);
  };

  const handleLeaderPictureError = useCallback((leaderId) => {
    setFailedLeaderPictures((current) => {
      if (current[leaderId]) {
        return current;
      }

      return {
        ...current,
        [leaderId]: true,
      };
    });
  }, []);

  const loadData = useCallback(
    async ({
      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,
      showLoader = true,
      signal,
      requestEpoch,
    }) => {
      const requestId = ++loadRequestIdRef.current;
      const isStaleRequest = () =>
        signal?.aborted ||
        (requestEpoch != null &&
          requestEpoch !== scoresRequestEpochGetterRef.current());

      if (showLoader) {
        setDataLoading(true);
      }

      const query = {
        authId: isAuthenticated ? get(getUser(), "sub") : null,
        leagueId,
        year,
        weekId,
        beginDateTime,
        endDateTime,

        includeStrategies: true,
      };

      try {
        const [games = [], picks = [], users = [], teams = []] = await Promise.all([
          callApi({
            method: "GET",
            endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
            signal,
          }),
          callApi({
            method: "GET",
            endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
            signal,
          }),
          callApi({
            method: "GET",
            endpoint: `/api/usermanagement/users?${queryString.stringify(query)}`,
            signal,
          }),
          callApi({
            method: "GET",
            endpoint: `/api/gamemanagement/teams?leagueId=${query?.leagueId}`,
            signal,
          }),
        ]);

        if (isStaleRequest() || requestId !== loadRequestIdRef.current) {
          return;
        }

        setGames(games || []);
        setPicks(picks || []);
        setUsers(users || []);
        setTeams(teams || []);
      } catch (error) {
        if (isRequestAborted(error) || isStaleRequest()) {
          return;
        }

        throw error;
      } finally {
        if (showLoader && requestId === loadRequestIdRef.current) {
          setDataLoading(false);
        }
      }
    },
    []
  );

  const {
    weeks,
    leagueId,
    year,
    weekId,
    beginDateTime,
    endDateTime,
    handleFilterLeague,
    handleFilterYear,
    handleFilterWeek,
    getActiveScoresRequestSignal,
    getActiveScoresRequestEpoch,
  } = useLeagueWeekNavigation({
    routeBase: "/leaders/",
    initialLeagueId: initialLeague?.id,
    initialYear: last(initialLeague?.years),
    gameWeeksQueryExtras: {},
    onLoadData: (params) => loadData({ ...params, showLoader: true }),
  });

  scoresRequestEpochGetterRef.current = getActiveScoresRequestEpoch;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const poll = useCallback(() => {
    loadData({
      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,
      showLoader: false,
      signal: getActiveScoresRequestSignal(),
      requestEpoch: getActiveScoresRequestEpoch(),
    });
  }, [
    beginDateTime,
    endDateTime,
    getActiveScoresRequestEpoch,
    getActiveScoresRequestSignal,
    leagueId,
    loadData,
    weekId,
    year,
  ]);

  const currentWeek = weeks.find((week) => week._id === weekId);

  usePageSeo({
    enabled: !dataLoading,
    pageKind: "leaders",
    leagueId,
    year,
    week: currentWeek,
  });

  usePollWhileGamesInProgress({ games, onPoll: poll, intervalMs: 15000 });

  const leaders = useMemo(() => {
    return getLeaders({
      games,
      picks,
      users,
      teams,
      spreadMode: isSpreadTab,
      includeBonusPoints: isBonusPointsTab,
    });
  }, [games, isBonusPointsTab, isSpreadTab, picks, teams, users]);

  const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
  const areAllGamesOver = getAreAllGamesOver(games);
  const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
  const leaderSummaryPadding = (areAnyGamesInProgress ? 0.5 : 0) + (isSpreadTab ? 0.5 : 0);
  const isLoading = dataLoading && !areAnyGamesInProgress;
  const user = getUser();
  const userId = get(user, "sub");
  const handleFilterDate = undefined;

  return (
    <div>
      <PageContainer>
        <ArcadeGameSearchBar
          leagueId={leagueId}
          leagues={leagues}
          yearSelected={year}
          weekId={weekId}
          weeks={weeks}
          loading={isLoading}
          onFilterLeague={handleFilterLeague}
          onFilterYear={handleFilterYear}
          onFilterWeek={handleFilterWeek}
          onFilterDate={handleFilterDate}
        />

        <LeagueNotices
          leagueId={leagueId}
          areAllGamesOver={areAllGamesOver}
          areAnyGamesInProgress={areAnyGamesInProgress}
          timeUntilNextGameStarts={timeUntilNextGameStarts}
          isAuthenticated={isAuthenticated}
        />

        <GameEngagementBar
          games={games}
          picks={picks}
          teams={teams}
          isAuthenticated={isAuthenticated}
          userId={userId}
          showSpreadToggle={false}
          showSlimToggle={false}
        />
        {
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
                value={selectedLeaderTab}
                onChange={handleLeaderTabChange}
                variant="scrollable"
                scrollButtons={false}
                aria-label="game types"
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  paddingBottom: "20px",
                  "& .MuiTabs-scroller": {
                    minWidth: 0,
                  },
                  "& .MuiTabs-list": {
                    justifyContent: "safe center",
                  },
                }}
              >
                <Tab label="Picks 🎯" {...a11yProps(0)} />
                <Tab label="ATS 📊" {...a11yProps(1)} />
                <Tab label="P + B 🚀" {...a11yProps(2)} />
              </Tabs>
            </Box>
            {isSpreadTab && (
              <div style={styles.leaderTabNote} role="note">
                Against the Spread
              </div>
            )}
            {isBonusPointsTab && (
              <div style={styles.leaderTabNote} role="note">
                P + B = Picks + Bonus
              </div>
            )}
            <LeaderHypeBanner />
            <Slide
              direction={"up"}
              in={true}
              mountOnEnter
              unmountOnExit
              timeout={250}
            >
              <div style={styles.root}>
                {isLoading && (
                  <div style={{ margin: "10px 0" }}>
                    <Skeleton
                      style={{ margin: "10px 0 0 0" }}
                      animation="pulse"
                      height="5em"
                      variant="rect"
                    />
                    <Skeleton
                      style={{ margin: "10px 0 0 0" }}
                      animation="pulse"
                      height="5em"
                      variant="rect"
                    />
                    <Skeleton
                      style={{ margin: "10px 0 0 0" }}
                      animation="pulse"
                      height="5em"
                      variant="rect"
                    />
                  </div>
                )}
                {!isLoading &&
                  leaders.map((leader, index) => {
                    const leaderRecord = getLeaderRecord({
                      leader,
                      isBonusPointsTab,
                      areAnyGamesInProgress,
                    });

                    return (
                    <div style={styles.container} key={leader.id}>
                      <Accordion style={{ borderRadius: "8px", boxShadow: "none" }}>
                        <AccordionSummary
                          style={styles.expansionSummary}
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ "&.MuiAccordionSummary-root": { paddingBottom: "1.75rem" } }}
                        >
                          <div
                            style={{
                              display: "flex",
                              paddingBottom: `${leaderSummaryPadding + (leader.percentage ? 1 : 0)}rem`,
                            }}
                          >
                            {leader.medal && (
                              <div style={{ margin: "auto 10px auto 0", fontSize: "3rem", lineHeight: 1 }} aria-hidden="true">
                                {leader.medal}
                              </div>
                            )}
                            {![1, 2, 3].includes(index + 1) && !leader.medal && (
                              <div
                                style={{
                                  margin: "auto 10px auto 0",
                                  color: index === 0 ? "#FFC107" : "#000",
                                  fontWeight: index === 0 ? "700" : "400",
                                }}
                              >
                                {index + 1}
                              </div>
                            )}
                            {leader.picture && !failedLeaderPictures[leader.id] && (
                              <div style={{ margin: "auto" }}>
                                {index === 0 && (
                                  <div
                                    style={{
                                      fontSize: "2rem",
                                      position: "absolute",
                                      top: "-11px",
                                      transform: "rotate(-30deg)",
                                      left: "55px",
                                      zIndex: "777",
                                    }}
                                  >
                                    👑
                                  </div>
                                )}
                                <img
                                  style={styles.userPicture}
                                  src={leader.picture}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  crossOrigin="anonymous"
                                  onError={() => handleLeaderPictureError(leader.id)}
                                />
                              </div>
                            )}
                            {(!leader.picture || failedLeaderPictures[leader.id]) && (
                              <div
                                style={{
                                  ...styles.userDefaultPictureContainer,
                                  backgroundColor:
                                    leaderBackgroundColor[
                                      Math.floor(Math.random() * leaderBackgroundColor.length)
                                    ],
                                }}
                              >
                                <div style={{ margin: "10px 15px" }}>{leader.userName[0]}</div>
                              </div>
                            )}
                            <div style={styles.userName}>{leader.userName}</div>
                          </div>
                          <div style={{ display: "inline-flex" }}>
                            <div
                              style={{
                                textAlign: "right",
                                position: "absolute",
                                right: "50px",
                                fontSize: "14px",
                              }}
                            >
                              {areAnyGamesInProgress && (
                                <div style={{ color: "gray" }}>
                                  {leaderRecord.interimWins} - {leaderRecord.interimLosses}
                                </div>
                              )}
                              <div>{leader.percentage}</div>
                              <div>
                                {areAnyGamesInProgress
                                  ? `${leaderRecord.totalWins} - ${leaderRecord.totalLosses}`
                                  : `${leaderRecord.wins} - ${leaderRecord.losses}`}
                              </div>
                              {isBonusPointsTab && leader.scoreGuessBumpPoints > 0 && (
                                <div style={{ color: "#0B6E4F", fontWeight: "700" }}>
                                  +{formatLeaderWinTotal(leader.scoreGuessBumpPoints)} bonus
                                </div>
                              )}
                              <div
                                style={{
                                  fontWeight: "700",
                                  fontSize: "1.25rem",
                                  width: "9rem",
                                }}
                              >
                                {`${getGameStreakEmoji(
                                  leader.winsBeforeGameOver,
                                  leader.losses,
                                  leader.winsInARow,
                                  leader.lossesInARow
                                )} x${leader.winsInARow || leader.lossesInARow}`}
                              </div>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails style={styles.expansionPanelDetails}>
                          <div style={{ margin: "12px auto" }}>
                            {isSpreadTab && (
                              <VegasWinCalculationPopup
                                {...{
                                  title: "in Vegas you would have won: ",
                                  leader,
                                  showInfo: true,
                                }}
                              />
                            )}
                            <table style={{ width: "100%", backgroundColor: "#fff" }}>
                              {get(leader, "games", []).map((game) => {
                                const showLeaderPicksAndGuesses = canShowLeaderPicksAndGuesses({
                                  leaderId: leader.id,
                                  game,
                                });
                                const bonusLabel = getLeaderBonusLabel(game);

                                return (
                                  <tbody key={leader.id + "-" + game._id}>
                                    {game.isNewDate && (
                                      <tr>
                                        <td align="center"></td>
                                        <td align="center"></td>
                                        <td align="center">
                                          <div
                                            style={{
                                              margin: "12px 0",
                                              fontWeight: "600",
                                              color: "rgba(0, 0, 0, 0.87)",
                                            }}
                                          >
                                            {game.date}
                                          </div>
                                        </td>
                                        <td align="center"></td>
                                        <td align="center"></td>
                                      </tr>
                                    )}
                                    <tr>
                                      <td align="center">
                                        {showLeaderPicksAndGuesses && (
                                          <div
                                            style={{
                                              width: "24px",
                                              height: "24px",
                                              backgroundColor: game.awayIndicator,
                                            }}
                                          />
                                        )}
                                      </td>
                                      {
                                        <td align="center">
                                          <span>{game.awayScore}</span>
                                        </td>
                                      }
                                      <td align="center">
                                        <span>{game.awayTeam}</span>
                                        {(game.isGameOfTheWeek === true || game.isGameOfTheWeek === "true" || game.isGameOfTheWeek === 1) ? (
                                          <span
                                            style={{ margin: "0 5px", color: "#f59e0b", fontWeight: "700" }}
                                            title="Game of the Week"
                                            aria-label="Game of the Week"
                                          >
                                            ⭐
                                          </span>
                                        ) : <span> vs </span>}
                                        <span>{game.homeTeam}</span>
                                      </td>
                                      {
                                        <td align="center">
                                          <span>{game.homeScore}</span>
                                        </td>
                                      }
                                      <td align="center">
                                        {showLeaderPicksAndGuesses && (
                                          <div
                                            style={{
                                              width: "24px",
                                              height: "24px",
                                              backgroundColor: game.homeIndicator,
                                            }}
                                          />
                                        )}
                                      </td>
                                    </tr>
                                    {isBonusPointsTab && showLeaderPicksAndGuesses && bonusLabel && (
                                      <tr>
                                        <td align="center"></td>
                                        <td align="center"></td>
                                        <td align="center">
                                          <span style={{ color: /\(\+/.test(bonusLabel) ? "#0B6E4F" : /\(0\)/.test(bonusLabel) ? "#B42318" : "#666" }}>
                                            {bonusLabel}
                                          </span>
                                        </td>
                                        <td align="center"></td>
                                        <td align="center"></td>
                                      </tr>
                                    )}
                                  </tbody>
                                );
                              })}
                            </table>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                    );
                  })}
              </div>
            </Slide>
          </Box>
        }
      </PageContainer>
    </div>
  );
};

export default Leader;