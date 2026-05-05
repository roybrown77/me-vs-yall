import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import get from "lodash/get";
import last from "lodash/last";
import moment from "moment-timezone";
import queryString from "query-string";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import RemainingGamesNotifier from "./RemainingGamesNotifier";
import PageContainer from "../../components/PageContainer";
import GameSearchBar from "../../components/GameSearchBar";
import PickResult from "../../components/PickResult";
import Game from "../../components/Game";
import Countdown from "../../components/Countdown";
import TinyScoreboard from "../../components/TinyScoreboard";
import GameEngagementBar from "../../components/GameEngagementBar";
import LeagueNotices from "../../components/LeagueNotices";

import ArcadeScoreboard from "./Arcade";

import { getPicksNotSelected, getGroupedGames } from "./utilities";
import a11yProps from "../../utilities/a11yProps";
import { callApi } from "../../utilities/http";
import { getLeagueName } from '../../utilities/getLeagueName';
import {
    formatWeeks,
    hasGameStarted,
    getAreAllGamesOver,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
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

const Scoreboard = () => {
  const initialLeague = useMemo(() => {
    return leagues.find((league) => league.name === getLeagueName()) || leagues[0];
  }, []);

  const [dataLoading, setDataLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [userId, setUserId] = useState(null);
  const [updatingPick, setUpdatingPick] = useState(false);
  const [isShareClicked] = useState(false);
  const [isSpreadModeAlertOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const arcadeMode = searchParams.get("arcadeMode") === "true";

  const handleArcadeModeChange = useCallback(
    (enabled) => {
      const next = new URLSearchParams(window.location.search);
      next.set("arcadeMode", enabled ? "true" : "false");
      setSearchParams(next, { replace: true });
    },
    [setSearchParams]
  );

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
      const user = getUser();
      const userId = get(user, "sub");
      setUserId(userId);

      if (showLoader) {
        setDataLoading(true);
      }

      const query = {
        userId,
        leagueId,
        year,
        weekId,
        beginDateTime,
        endDateTime,
      };

      const [games = [], picks = [], teams = []] = await Promise.all([
        callApi({
          method: "GET",
          endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
        }),
        isAuthenticated
          ? callApi({
              method: "GET",
              endpoint: `/api/pickmanagement/picks?${queryString.stringify(
                query
              )}`,
            })
          : undefined,
        callApi({
          method: "GET",
          endpoint: `/api/gamemanagement/teams?leagueId=${query?.leagueId}`,
        }),
      ]);

      setGames(games);
      setPicks(picks || []);
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
    routeBase: "/scoreboards/",
    initialLeagueId: initialLeague?.id,
    initialYear: last(initialLeague?.years),
    gameWeeksQueryExtras: { skipEntireWeek: true },
    onLoadData: (params) => loadData({ ...params, showLoader: true }),
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isAuthenticated) return;

    const createUser = async ({ user }) => {
      await callApi({
        method: "POST",
        endpoint: `/api/usermanagement/users`,
        body: {
          sub: user.sub,
          email: user.email,
          family_name: user.family_name,
          given_name: user.given_name,
          picture: user.picture,
        },
      });
    };

    createUser({ user: getUser() });
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

  const groupedGames = useMemo(() => {
    return getGroupedGames({
      games,
      picks,
      teams,
      spreadMode,
    });
  }, [games, picks, spreadMode, teams]);

  const currentWeek = weeks.find((x) => x._id === weekId);
  const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
  const areAllGamesOver = getAreAllGamesOver(games);
  const gamesNotStarted = games.filter((x) => !hasGameStarted(x.startDateTime));
  const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
  const picksNotSelected = getPicksNotSelected(gamesNotStarted, picks);
  const disableTie = currentWeek?.disableTie;

  const isLoading = dataLoading && !areAnyGamesInProgress;
  const handleFilterDate = undefined;

  const handleMakePick = useCallback(
    (pick) => {
      const gameFound = games.find((x) => x._id === pick.gameId);
      if (!isAuthenticated || gameFound?.isGameOver) return;
      const pickFound = picks.find((x) => x.gameId === pick.gameId);

      const upsertPick = async (id, pick) => {
        setUpdatingPick(true);

        const pickParams = queryString.stringify({
          gameId: pick.gameId,
          pickId: pick.pickId,
        });

        await callApi({
          method: id ? "PUT" : "POST",
          endpoint: id
            ? `/api/pickmanagement/picks/${encodeURIComponent(id)}`
            : "/api/pickmanagement/picks",
          body: pickParams,
        });

        const user = getUser();
        const userId = get(user, "sub");

        const query = {
          userId,
          leagueId,
          year,
          weekId,
          beginDateTime,
          endDateTime,
        };

        const picks = await callApi({
          method: "GET",
          endpoint: `/api/pickmanagement/picks?${queryString.stringify(
            query
          )}`,
        });

        setPicks(picks || []);
        setUpdatingPick(false);
      };

      upsertPick(pickFound?._id, pick);
    },
    [
      beginDateTime,
      endDateTime,
      games,
      leagueId,
      picks,
      weekId,
      year,
    ]
  );

  const handleUpdateGame = useCallback((game) => {
    if (!isAuthenticated) return;

    const updateGame = async (game) => {
      const gameParams = {
        id: game.id,
        awayScore: game.awayScore,
        homeScore: game.homeScore,
        awayRank: game.awayRank,
        homeRank: game.homeRank,
        awayRecord: game.awayRecord,
        homeRecord: game.homeRecord,
        awaySpread: game.awaySpread,
        homeSpread: game.homeSpread,
        gameName: game.gameName,
        isGameOver: game.isGameOver,
        currentTime: game.currentTime,
        gameTime: game.gameTime,
        liveVideoUrl: game.liveVideoUrl,
        highlightVideoUrl: game.highlightVideoUrl,
        isHidden: game.isHidden,
      };

      await callApi({
        method: "PUT",
        endpoint: `/api/gamemanagement/games/${encodeURIComponent(game.id)}`,
        body: gameParams,
      });
    };

    updateGame(game);
  }, []);

  let gameDate = null;

  return (
    <div>
      <PageContainer>
        <TinyScoreboard
          {...{
            title: `Let's Go!!!`,
            games: groupedGames.notCompleted,
            loading: isLoading,
          }}
        />
        {!isLoading && (
          <TinyScoreboard
            {...{
              title: `Game Over`,
              games: groupedGames.completed,
              loading: isLoading,
            }}
          />
        )}
        <GameSearchBar
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
        {!isAuthenticated && (
          <Button
            variant="contained"
            style={styles.button}
            onClick={googleLogin}
          >
            Make Your Picks
          </Button>
        )}
        {isAuthenticated && (
          <div>
            <PickResult
              loading={isLoading}
              spreadMode={spreadMode}
              games={groupedGames.completed}
              picks={picks}
            />
          </div>
        )}

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
          spreadMode={spreadMode}
          arcadeMode={arcadeMode}
          onArcadeModeChange={handleArcadeModeChange}
        />
        {arcadeMode ? (
          <ArcadeScoreboard
            games={[...groupedGames.notCompleted, ...groupedGames.completed]}
          />
        ) : (
          <Box
            sx={{
              position: "relative",
              zIndex: "2",
              backgroundColor: "#EFFBF8",
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
                <Tab style={{ color: "#000" }} label="Scores" {...a11yProps(0)} />
              </Tabs>
            </Box>
            <div style={styles.root}>
              {isLoading && (
                <div style={{ margin: "10px 0" }}>
                  <Skeleton animation="pulse" height="5em" variant="rect" />
                  <div style={{ display: "flex" }}>
                    <Skeleton
                      style={{ margin: "20px" }}
                      animation="pulse"
                      height="10em"
                      width="50%"
                      variant="rect"
                    />
                    <Skeleton
                      style={{ margin: "20px" }}
                      animation="pulse"
                      height="10em"
                      width="50%"
                      variant="rect"
                    />
                  </div>
                </div>
              )}
              {!isLoading &&
                groupedGames.notCompleted.map((game) => {
                  const newGameDate = moment(get(game, "startDateTime")).format(
                    "dddd MMM D YYYY"
                  );
                  const newDate = gameDate !== newGameDate;
                  if (newDate) gameDate = newGameDate;

                  return (
                    <div key={game._id}>
                      {newDate && (
                        <div
                          style={{
                            position: "relative",
                            zIndex: 3,
                            fontFamily: "monospace",
                            backgroundColor: "rgba(0,0,0,0.87)",
                            color: "#ffffff",
                            width: "100%",
                            padding: "2px 0",
                            marginBottom: "8px",
                          }}
                        >
                          <div
                            style={{
                              margin: "16px 0",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            {gameDate}
                          </div>
                        </div>
                      )}
                      <Game
                        game={game}
                        pick={picks.find((x) => x.gameId === game._id)}
                        handleMakePick={handleMakePick}
                        handleUpdateGame={handleUpdateGame}
                        isAuthenticated={isAuthenticated}
                        userId={userId}
                        disableTie={disableTie}
                        updatingPick={updatingPick}
                        spreadMode={spreadMode}
                      />
                    </div>
                  );
                })}
              {!isLoading && (
                <div>
                  {groupedGames.completed.length > 0 && (
                    <div
                      style={{
                        position: "relative",
                        zIndex: 10,
                        fontFamily: "monospace",
                        backgroundColor: "rgba(0,0,0,0.87)",
                        color: "#ffffff",
                        width: "100%",
                        padding: "2px 0",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          margin: "16px 0",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        *** Game Over ***
                      </div>
                    </div>
                  )}
                  {groupedGames.completed.map((game) => {
                    const newGameDate = moment(get(game, "startDateTime")).format(
                      "dddd MMM D YYYY"
                    );
                    const newDate = gameDate !== newGameDate;
                    if (newDate) gameDate = newGameDate;

                    return (
                      <div key={game._id}>
                        {newDate && (
                          <div
                            style={{
                              position: "relative",
                              zIndex: 10,
                              fontFamily: "monospace",
                              backgroundColor: "rgba(0,0,0,0.87)",
                              color: "#ffffff",
                              width: "100%",
                              padding: "2px 0",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                margin: "16px 0",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              {gameDate}
                            </div>
                          </div>
                        )}
                        <Game
                          game={game}
                          pick={picks.find((x) => x.gameId === game._id)}
                          handleMakePick={handleMakePick}
                          handleUpdateGame={handleUpdateGame}
                          isAuthenticated={isAuthenticated}
                          userId={userId}
                          disableTie={disableTie}
                          spreadMode={spreadMode}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Box>
        )}
        <RemainingGamesNotifier {...{ isAuthenticated, picksNotSelected }} />
      </PageContainer>
    </div>
  );
};

export default Scoreboard;