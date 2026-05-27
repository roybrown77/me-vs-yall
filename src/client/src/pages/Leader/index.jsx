import { useCallback, useEffect, useMemo, useState } from "react";
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

import VegasWinCalculationPopup from "./VegasWinCalculationPopup";
import PageContainer from "../../components/PageContainer";
import ArcadeGameSearchBar from "../../components/GameSearchBar/ArcadeGameSearchBar";
import Countdown from "../../components/Countdown";
import GameEngagementBar from "../../components/GameEngagementBar";
import LeagueNotices from "../../components/LeagueNotices";

import a11yProps from "../../utilities/a11yProps";
import { callApi } from "../../utilities/http";
import { getLeagueName } from '../../utilities/getLeagueName';
import {
  formatWeeks,
  getAreAllGamesOver,
  getAreAnyGamesInProgress,
  getLeagueStartDateTime,
  getLeaders,
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
import useSpreadMode from "../../hooks/useSpreadMode";

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

  const { spreadMode, enableSpreadMode, disableSpreadMode } = useSpreadMode();

  const loadData = useCallback(
    async ({
      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,
      showLoader = true,
    }) => {
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

      const [games = [], picks = [], users = [], teams = []] = await Promise.all([
        callApi({
          method: "GET",
          endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
        }),
        callApi({
          method: "GET",
          endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
        }),
        callApi({
          method: "GET",
          endpoint: `/api/usermanagement/users?${queryString.stringify(query)}`,
        }),
        callApi({
          method: "GET",
          endpoint: `/api/gamemanagement/teams?leagueId=${query?.leagueId}`,
        }),
      ]);

      setGames(games);
      setPicks(picks || []);
      setUsers(users);
      setTeams(teams);
      setDataLoading(false);
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
  } = useLeagueWeekNavigation({
    routeBase: "/leaders/",
    initialLeagueId: initialLeague?.id,
    initialYear: last(initialLeague?.years),
    gameWeeksQueryExtras: {},
    onLoadData: (params) => loadData({ ...params, showLoader: true }),
  });

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
    });
  }, [beginDateTime, endDateTime, leagueId, loadData, weekId, year]);

  usePollWhileGamesInProgress({ games, onPoll: poll, intervalMs: 15000 });

  const leaders = useMemo(() => {
    return getLeaders({
      games,
      picks,
      users,
      teams,
      spreadMode,
    });
  }, [games, picks, spreadMode, teams, users]);

  const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
  const areAllGamesOver = getAreAllGamesOver(games);
  const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
  const leaderSummaryPadding = (areAnyGamesInProgress ? 0.5 : 0) + (spreadMode ? 0.5 : 0);
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
          handleSpreadToggleOn={enableSpreadMode}
          handleSpreadToggleOff={disableSpreadMode}
          games={games}
          picks={picks}
          teams={teams}
          isAuthenticated={isAuthenticated}
          userId={userId}
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
                value={0}
                aria-label="game types"
                style={{
                  paddingBottom: "20px",
                  width: "fit-content",
                  margin: "auto",
                }}
              >
                <Tab style={{ color: "#000" }} label="Leaders" {...a11yProps(0)} />
              </Tabs>
            </Box>
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
                  leaders.map((leader, index) => (
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
                              <div style={{ margin: "auto 10px auto 0" }}>
                                <img style={{ width: "40px" }} src={leader.medal} alt="" />
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
                            {leader.picture && (
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
                                />
                              </div>
                            )}
                            {!leader.picture && (
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
                                  {leader.winsBeforeGameOver} - {leader.lossesBeforeGameOver}
                                </div>
                              )}
                              {spreadMode && <VegasWinCalculationPopup {...{ leader }} />}
                              <div>{leader.percentage}</div>
                              <div>
                                {leader.wins} - {leader.losses}
                              </div>
                              {leader.scoreGuessBumpPoints > 0 && (
                                <div style={{ color: "#0B6E4F", fontWeight: "700" }}>
                                  +{leader.scoreGuessBumpPoints.toFixed(2).replace(/\.00$/, "")} guess boost
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
                            {spreadMode && (
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
                                        <div
                                          style={{
                                            width: "24px",
                                            height: "24px",
                                            backgroundColor: game.awayIndicator,
                                          }}
                                        />
                                      </td>
                                      {
                                        <td align="center">
                                          <span>{game.awayScore}</span>
                                        </td>
                                      }
                                      <td align="center">
                                        <span>{game.awayTeam}</span>
                                        <span> vs </span>
                                        <span>{game.homeTeam}</span>
                                      </td>
                                      {
                                        <td align="center">
                                          <span>{game.homeScore}</span>
                                        </td>
                                      }
                                      <td align="center">
                                        <div
                                          style={{
                                            width: "24px",
                                            height: "24px",
                                            backgroundColor: game.homeIndicator,
                                          }}
                                        />
                                      </td>
                                    </tr>
                                    {game.scoreGuessLabel && (
                                      <tr>
                                        <td align="center"></td>
                                        <td align="center"></td>
                                        <td align="center">
                                          <span style={{ color: game.scoreGuessBump > 0 ? "#0B6E4F" : "#666" }}>
                                            {game.scoreGuessLabel}
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
                  ))}
              </div>
            </Slide>
          </Box>
        }
      </PageContainer>
    </div>
  );
};

export default Leader;