import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import get from "lodash/get";
import last from "lodash/last";
import moment from "moment-timezone";
import queryString from "query-string";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RemainingGamesNotifier from "./RemainingGamesNotifier";
import { StandingsTabLoader } from "./ScoreboardTabLoading.jsx";
import StandingsRefreshNotice from "./StandingsRefreshNotice.jsx";
import TeamRankings from "./TeamRankings";
import PlayoffBracket from "./PlayoffBracket.jsx";
import TabPanel from "../../components/TabPanel";
import {
  areRankingsAvailableForSelection,
  isLatestLeagueYear,
  getEarliestPlayoffWeekBegin,
  getLatestPlayoffWeekEnd,
  getRankingsSeasonBeginDateTime,
  isFirstRegularSeasonWeek,
  resolveRankingSnapshots,
} from "./rankings";
import { fetchGameWeeks } from "../../utilities/gameWeeks";
import {
  applyRankingsCachePayload,
  buildRankingsCacheKey,
  clearRankingsCache,
  mergeLiveGamesIntoSeasonGames,
  isRankingsCacheKeyValid,
  readRankingsCache,
  writeRankingsCache,
} from "./rankingsCache";
import PageContainer from "../../components/PageContainer";
import ArcadeGameSearchBar from "../../components/GameSearchBar/ArcadeGameSearchBar";
import ArcadePickResult from "../../components/PickResult/ArcadePickResult";
import Game from "../../components/Game";
import Countdown from "../../components/Countdown";
import TinyScoreboard from "../../components/TinyScoreboard";
import GameEngagementBar from "../../components/GameEngagementBar";
import LeagueNotices from "../../components/LeagueNotices";
import LeaderHypeBanner from "../../components/LeaderHypeBanner";

import {
  getFieldPickersForGame,
  getPicksNotSelected,
  getGroupedGames,
} from "./utilities";
import a11yProps from "../../utilities/a11yProps";
import { callApi, isRequestAborted } from "../../utilities/http";
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
import useScrollToGameSlug from "../../hooks/useScrollToGameSlug";
import usePageSeo from "../../hooks/usePageSeo";
import useSpreadMode from "../../hooks/useSpreadMode";
import useSlimUx from "../../hooks/useSlimUx";
import { hasSlimUxPreference } from "../../utilities/slimUx";
import {
  assignGameSlugs,
  buildNavigationPath,
  parseNavigationPath,
  SCOREBOARD_VIEW_BRACKET,
  SCOREBOARD_VIEW_RANKINGS,
  withGameSlug,
} from "../../utilities/navigationPaths";
import { inferSeasonType } from "./rankings";
import {
  buildWeekQueryMetaMap,
  getWeekSegmentForWeek,
} from "../../utilities/weekQueryMeta";

const isAuthenticated = isConfirmedAuthentication();

const STATS_HYDRATION_INTERVAL_MS = 60 * 1000;

const mergeLeanScoreboardGames = (previousGames = [], nextGames = []) => {
  if (!nextGames?.length) {
    return [];
  }

  if (!previousGames?.length) {
    return nextGames;
  }

  const previousById = previousGames.reduce((acc, game) => {
    acc[String(game._id)] = game;
    return acc;
  }, {});

  return nextGames.map((game) => {
    const previous = previousById[String(game._id)];
    if (!previous) {
      return game;
    }

    const hasStats = Array.isArray(game.stats) && game.stats.length > 0;

    return {
      ...game,
      stats: hasStats ? game.stats : previous.stats,
    };
  });
};

const Scoreboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialLeague = useMemo(() => {
    return leagues.find((league) => league.name === getLeagueName()) || leagues[0];
  }, []);

  const [dataLoading, setDataLoading] = useState(true);
  const [picksDataLoading, setPicksDataLoading] = useState(isAuthenticated);
  const [games, setGames] = useState([]);
  const [picks, setPicks] = useState([]);
  const [revealedPicks, setRevealedPicks] = useState([]);
  const [pickUsers, setPickUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [userId, setUserId] = useState(null);
  const [updatingPick, setUpdatingPick] = useState(false);
  const [isShareClicked] = useState(false);
  const [isSpreadModeAlertOpen] = useState(false);
  const loadRequestIdRef = useRef(0);
  const lastStatsHydrationAtRef = useRef(0);
  const statsHydratedWeekKeyRef = useRef(null);
  const teamsByLeagueRef = useRef({});
  const scoresRequestEpochGetterRef = useRef(() => 0);
  const rankingsRequestIdRef = useRef(0);
  const rankingsAbortRef = useRef(null);
  const wasRankingsViewActiveRef = useRef(false);
  const rankingsFetchKeyRef = useRef(null);
  const rankingsLoadInFlightRef = useRef(false);
  const rankingsInFlightPromiseRef = useRef(null);
  const rankingsScoreSignatureRef = useRef("");
  const loadRankingsDataRef = useRef(null);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [rankingsSeasonSettled, setRankingsSeasonSettled] = useState(false);
  const [seasonGames, setSeasonGames] = useState([]);
  const [priorYearGames, setPriorYearGames] = useState([]);
  const [priorYearWeeks, setPriorYearWeeks] = useState([]);
  const [scoreboardTabIndex, setScoreboardTabIndex] = useState(0);

  const { spreadMode, enableSpreadMode, disableSpreadMode } = useSpreadMode();
  const { slimMode, enableSlimMode, disableSlimMode } = useSlimUx();

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
      const user = getUser();
      const userId = get(user, "sub");
      setUserId(userId);

      if (showLoader) {
        setDataLoading(true);
        if (isAuthenticated) {
          setPicksDataLoading(true);
        }
      }

      const query = {
        userId,
        leagueId,
        year,
        weekId,
        beginDateTime,
        endDateTime,
      };

      const gamesQuery = { ...query, skipTeamStats: true };

      const cachedTeams = teamsByLeagueRef.current[String(leagueId)];
      const teamsRequest = cachedTeams
        ? Promise.resolve(cachedTeams)
        : callApi({
            method: "GET",
            endpoint: `/api/gamemanagement/teams?leagueId=${query?.leagueId}`,
            signal,
          });

      try {
        const [games, teamsFromRequest] = await Promise.all([
          callApi({
            method: "GET",
            endpoint: `/api/gamemanagement/games?${queryString.stringify(gamesQuery)}`,
            signal,
          }),
          teamsRequest,
        ]);

        if (isStaleRequest() || requestId !== loadRequestIdRef.current) {
          return;
        }

        const resolvedTeams = teamsFromRequest?.length
          ? teamsFromRequest
          : cachedTeams || [];
        const anyGameStarted = (games || []).some((game) =>
          hasGameStarted(game.startDateTime)
        );
        const startedGameIds = (games || [])
          .filter((game) => hasGameStarted(game.startDateTime))
          .map((game) => game._id)
          .join(",");
        if (resolvedTeams?.length) {
          teamsByLeagueRef.current[String(leagueId)] = resolvedTeams;
        }

        setGames((previousGames) =>
          mergeLeanScoreboardGames(previousGames, games || [])
        );
        setTeams(resolvedTeams);

        if (showLoader && requestId === loadRequestIdRef.current) {
          setDataLoading(false);
        }

        if (
          requestId === loadRequestIdRef.current &&
          areRankingsAvailableForSelection({
            week: weeks.find((entry) => entry._id === weekId),
            weeks,
            leagueId,
            year,
          })
        ) {
          loadRankingsDataRef.current?.({
            bypassCache: false,
            showLoader: false,
          });
        }

        const needsPickExtras = isAuthenticated || anyGameStarted;
        const communityQuery = {
          leagueId,
          year,
          weekId,
          beginDateTime,
          endDateTime,
          communityPicksForStartedGames: true,
          authId: userId || null,
          ...(startedGameIds ? { startedGameIds } : {}),
        };
        const usersQuery = {
          leagueId,
          year,
          weekId,
          beginDateTime,
          endDateTime,
          authId: userId || null,
        };

        const loadPickExtras = async () => {
          try {
            const [nextPicks = [], communityPicks = [], users = []] =
              await Promise.all([
                isAuthenticated
                  ? callApi({
                      method: "GET",
                      endpoint: `/api/pickmanagement/picks?${queryString.stringify(
                        query
                      )}`,
                      signal,
                    })
                  : Promise.resolve([]),
                anyGameStarted
                  ? callApi({
                      method: "GET",
                      endpoint: `/api/pickmanagement/picks?${queryString.stringify(
                        communityQuery
                      )}`,
                      signal,
                    })
                  : Promise.resolve([]),
                anyGameStarted
                  ? callApi({
                      method: "GET",
                      endpoint: `/api/usermanagement/users?${queryString.stringify(
                        usersQuery
                      )}`,
                      signal,
                    })
                  : Promise.resolve([]),
              ]);

            if (isStaleRequest() || requestId !== loadRequestIdRef.current) {
              return;
            }

            setPicks(nextPicks || []);
            setRevealedPicks(anyGameStarted ? communityPicks || [] : []);
            setPickUsers(anyGameStarted ? users || [] : []);
          } catch (error) {
            if (isRequestAborted(error) || isStaleRequest()) {
              return;
            }
          } finally {
            if (
              !isStaleRequest() &&
              requestId === loadRequestIdRef.current &&
              isAuthenticated
            ) {
              setPicksDataLoading(false);
            }
          }
        };

        if (needsPickExtras) {
          void loadPickExtras();
        } else {
          setPicks([]);
          setRevealedPicks([]);
          setPickUsers([]);
          setPicksDataLoading(false);
        }

        const statsWeekKey = `${leagueId}-${year}-${weekId}`;
        if (statsHydratedWeekKeyRef.current !== statsWeekKey) {
          statsHydratedWeekKeyRef.current = statsWeekKey;
          lastStatsHydrationAtRef.current = 0;
        }

        const shouldRefreshLiveStats =
          anyGameStarted &&
          Date.now() - lastStatsHydrationAtRef.current >=
            STATS_HYDRATION_INTERVAL_MS;
        const hasHydratedStatsForWeek =
          statsHydratedWeekKeyRef.current === statsWeekKey &&
          lastStatsHydrationAtRef.current > 0;
        const shouldHydrateGameStats =
          (games || []).length > 0 &&
          (showLoader || !hasHydratedStatsForWeek || shouldRefreshLiveStats);

        if (shouldHydrateGameStats) {
          void (async () => {
            try {
              const fullGames = await callApi({
                method: "GET",
                endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
                signal,
              });

              if (isStaleRequest() || requestId !== loadRequestIdRef.current) {
                return;
              }

              lastStatsHydrationAtRef.current = Date.now();

              setGames((previousGames) =>
                previousGames.map((game) => {
                  const match = (fullGames || []).find(
                    (entry) => String(entry._id) === String(game._id)
                  );

                  if (!match?.stats?.length) {
                    return game;
                  }

                  return { ...game, stats: match.stats };
                })
              );
            } catch (error) {
              if (isRequestAborted(error) || isStaleRequest()) {
                return;
              }
            }
          })();
        }
      } catch (error) {
        if (isRequestAborted(error) || isStaleRequest()) {
          return;
        }

        if (
          isAuthenticated &&
          showLoader &&
          requestId === loadRequestIdRef.current
        ) {
          setPicksDataLoading(false);
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

  const loadDataWithLoader = useCallback(
    (params) => loadData({ ...params, showLoader: true }),
    [loadData]
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
    routeBase: "/scoreboards/",
    initialLeagueId: initialLeague?.id,
    initialYear: last(initialLeague?.years),
    allowEntireSeasonWeek: false,
    onLoadData: loadDataWithLoader,
  });

  scoresRequestEpochGetterRef.current = getActiveScoresRequestEpoch;

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

  const currentWeek = weeks.find((x) => x._id === weekId);
  const weekQueryMetaById = useMemo(
    () => buildWeekQueryMetaMap(weeks),
    [weeks]
  );

  const rankingsAvailable = areRankingsAvailableForSelection({
    week: currentWeek,
    weeks,
    leagueId,
    year,
  });
  const parsedScoreboardPath = useMemo(
    () => parseNavigationPath(location.pathname, "/scoreboards/"),
    [location.pathname]
  );

  const isNflLeague = leagues.some(
    (entry) => String(entry.id) === String(leagueId) && entry.name === "nfl"
  );
  const playoffsAvailable = rankingsAvailable && isNflLeague;

  useEffect(() => {
    if (parsedScoreboardPath.scoreboardView === SCOREBOARD_VIEW_RANKINGS) {
      setScoreboardTabIndex(1);
      return;
    }

    if (parsedScoreboardPath.scoreboardView === SCOREBOARD_VIEW_BRACKET) {
      setScoreboardTabIndex(2);
      return;
    }

    setScoreboardTabIndex(0);
  }, [location.pathname, parsedScoreboardPath.scoreboardView]);

  const isPlayoffsViewActive =
    playoffsAvailable &&
    (parsedScoreboardPath.scoreboardView === SCOREBOARD_VIEW_BRACKET ||
      scoreboardTabIndex === 2);
  const isRankingsViewActive =
    rankingsAvailable &&
    !isPlayoffsViewActive &&
    (parsedScoreboardPath.scoreboardView === SCOREBOARD_VIEW_RANKINGS ||
      scoreboardTabIndex === 1);
  const standingsViewActive = isRankingsViewActive || isPlayoffsViewActive;
  const activeScoreboardTab = isPlayoffsViewActive
    ? 2
    : isRankingsViewActive
      ? 1
      : 0;

  const buildScoreboardPath = useCallback(
    ({ scoreboardView = null, gameSlug = null } = {}) => {
      const league = leagues.find(
        (entry) => String(entry.id) === String(leagueId)
      );

      return buildNavigationPath({
        routeBase: "/scoreboards/",
        leagueName: parsedScoreboardPath.leagueName || league?.name,
        year: parsedScoreboardPath.year ?? year,
        seasonType:
          parsedScoreboardPath.seasonType ??
          (currentWeek ? inferSeasonType(currentWeek) : null),
        weekSegment:
          parsedScoreboardPath.weekSegment ||
          (currentWeek
            ? getWeekSegmentForWeek(currentWeek, weekQueryMetaById)
            : null),
        scoreboardView,
        gameSlug,
      });
    },
    [currentWeek, leagueId, parsedScoreboardPath, weekQueryMetaById, year]
  );

  const poll = useCallback(() => {
    if (standingsViewActive && seasonGames.length > 0) {
      setSeasonGames((previousSeasonGames) =>
        mergeLiveGamesIntoSeasonGames(previousSeasonGames, games)
      );
      return;
    }

    if (standingsViewActive) {
      loadRankingsDataRef.current?.({
        bypassCache: false,
        showLoader: false,
      });
      return;
    }

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
    games,
    getActiveScoresRequestEpoch,
    getActiveScoresRequestSignal,
    leagueId,
    loadData,
    seasonGames.length,
    standingsViewActive,
    weekId,
    year,
  ]);

  useEffect(() => {
    rankingsAbortRef.current?.abort();
    rankingsLoadInFlightRef.current = false;
    rankingsInFlightPromiseRef.current = null;
    rankingsFetchKeyRef.current = null;
    setRankingsSeasonSettled(false);
  }, [leagueId, weekId, year]);

  usePollWhileGamesInProgress({ games, onPoll: poll, intervalMs: 10000 });

  useEffect(() => {
    if (!isAuthenticated || dataLoading || picksDataLoading) {
      return;
    }

    const gamesNotStarted = games.filter(
      (game) => !hasGameStarted(game.startDateTime)
    );
    const unpickedCount = getPicksNotSelected(gamesNotStarted, picks);

    if (unpickedCount <= 0) {
      return;
    }

    if (!hasSlimUxPreference()) {
      enableSlimMode();
    }
  }, [dataLoading, enableSlimMode, games, isAuthenticated, picks, picksDataLoading]);

  const rankingSnapshots = useMemo(
    () =>
      resolveRankingSnapshots({
        currentYear: year,
        currentWeek,
        leagueId,
        weeks,
        seasonGames,
        priorYearGames,
        priorYearWeeks,
        endDateTime,
      }),
    [
      currentWeek,
      endDateTime,
      leagueId,
      priorYearGames,
      priorYearWeeks,
      seasonGames,
      weeks,
      year,
    ]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const legacyView = searchParams.get("view");
    if (
      legacyView === SCOREBOARD_VIEW_RANKINGS ||
      legacyView === SCOREBOARD_VIEW_BRACKET
    ) {
      searchParams.delete("view");
      const search = searchParams.toString();

      navigate(
        {
          pathname: buildScoreboardPath({
            scoreboardView: legacyView,
          }),
          search: search ? `?${search}` : "",
          hash: location.hash,
        },
        { replace: true }
      );
      return;
    }

    const viewUnavailable =
      (parsedScoreboardPath.scoreboardView === SCOREBOARD_VIEW_RANKINGS &&
        !rankingsAvailable) ||
      (parsedScoreboardPath.scoreboardView === SCOREBOARD_VIEW_BRACKET &&
        !playoffsAvailable);

    if (weeks.length > 0 && viewUnavailable) {
      setScoreboardTabIndex(0);
      navigate(
        {
          pathname: buildScoreboardPath({ scoreboardView: null }),
          search: location.search,
          hash: location.hash,
        },
        { replace: true }
      );
    }
  }, [
    buildScoreboardPath,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    parsedScoreboardPath.scoreboardView,
    playoffsAvailable,
    rankingsAvailable,
    weeks.length,
  ]);

  const applyRankingsState = useCallback((payload) => {
    setSeasonGames(payload.seasonGames || []);
    setPriorYearWeeks(payload.priorYearWeeks || []);
    setPriorYearGames(payload.priorYearGames || []);
  }, []);

  const hydrateRankingsFromCache = useCallback(
    (cacheKey, gamesInProgress = false) => {
      const cached = readRankingsCache(cacheKey, { gamesInProgress });
      if (!cached) {
        return false;
      }

      applyRankingsCachePayload(cached, applyRankingsState);
      return true;
    },
    [applyRankingsState]
  );

  const loadRankingsData = useCallback(async ({
    bypassCache = false,
    showLoader = true,
  } = {}) => {
    if (!leagueId || !year || !endDateTime || !currentWeek || !weeks.length || !weekId) {
      if (showLoader) {
        setRankingsLoading(false);
      }
      return;
    }

    const fetchKey = `${leagueId}|${year}|${weekId}`;

    if (
      !bypassCache &&
      rankingsInFlightPromiseRef.current &&
      rankingsFetchKeyRef.current === fetchKey
    ) {
      try {
        await rankingsInFlightPromiseRef.current;
      } catch {
        // Primary request handles errors.
      }
      if (showLoader) {
        setRankingsLoading(false);
      }
      return;
    }

    if (!isLatestLeagueYear(leagueId, year)) {
      setSeasonGames([]);
      setPriorYearWeeks([]);
      setPriorYearGames([]);
      setRankingsSeasonSettled(true);
      if (showLoader) {
        setRankingsLoading(false);
      }
      return;
    }

    const cacheKey = buildRankingsCacheKey(leagueId, year, weekId);
    if (bypassCache) {
      clearRankingsCache(cacheKey);
      rankingsFetchKeyRef.current = null;
    } else if (
      hydrateRankingsFromCache(cacheKey, getAreAnyGamesInProgress(games))
    ) {
      rankingsFetchKeyRef.current = fetchKey;
      setRankingsSeasonSettled(true);
      if (showLoader) {
        setRankingsLoading(false);
      }
      return;
    }

    if (bypassCache) {
      rankingsAbortRef.current?.abort();
      rankingsInFlightPromiseRef.current = null;
    }

    const controller = new AbortController();
    rankingsAbortRef.current = controller;
    const requestId = ++rankingsRequestIdRef.current;

    if (showLoader) {
      setRankingsLoading(true);
    }
    rankingsLoadInFlightRef.current = true;
    rankingsFetchKeyRef.current = fetchKey;

    const run = async () => {
      try {
        const seasonBeginDateTime =
          getRankingsSeasonBeginDateTime(weeks) ?? "-1";

        const query = {
          leagueId,
          year,
          beginDateTime: seasonBeginDateTime,
          endDateTime,
          forRankings: true,
        };

        const priorYear = Number(year) - 1;
        const leagueYears =
          leagues.find((league) => String(league.id) === String(leagueId))
            ?.years || [];
        const shouldLoadPriorSeason =
          isFirstRegularSeasonWeek(currentWeek, weeks) &&
          leagueYears.some((leagueYear) => Number(leagueYear) === priorYear);

        const gamesPromise = callApi({
          method: "GET",
          endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
          signal: controller.signal,
        });

        let fetchedPriorWeeks = [];
        let fetchedPriorGames = [];

        if (shouldLoadPriorSeason) {
          fetchedPriorWeeks =
            (await fetchGameWeeks({
              leagueId,
              year: priorYear,
              signal: controller.signal,
              skipEntireWeek: true,
            })) || [];

          const priorPlayoffBeginDateTime = getEarliestPlayoffWeekBegin(
            fetchedPriorWeeks
          );
          const priorPlayoffEndDateTime = getLatestPlayoffWeekEnd(
            fetchedPriorWeeks
          );

          if (priorPlayoffBeginDateTime && priorPlayoffEndDateTime) {
            fetchedPriorGames =
              (await callApi({
                method: "GET",
                endpoint: `/api/gamemanagement/games?${queryString.stringify({
                  leagueId,
                  year: priorYear,
                  beginDateTime: priorPlayoffBeginDateTime,
                  endDateTime: priorPlayoffEndDateTime,
                  forRankings: true,
                })}`,
                signal: controller.signal,
              })) || [];
          }
        }

        const games = await gamesPromise;

        if (
          controller.signal.aborted ||
          requestId !== rankingsRequestIdRef.current
        ) {
          return;
        }

        const payload = {
          seasonGames: games || [],
          priorYearWeeks: fetchedPriorWeeks,
          priorYearGames: fetchedPriorGames,
        };

        applyRankingsState(payload);
        writeRankingsCache(cacheKey, payload, {
          gamesInProgress: getAreAnyGamesInProgress(games),
        });
        setRankingsSeasonSettled(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load ranking games", error);
          setSeasonGames([]);
          setPriorYearWeeks([]);
          setPriorYearGames([]);
          setRankingsSeasonSettled(true);
        }
      } finally {
        if (requestId === rankingsRequestIdRef.current) {
          rankingsLoadInFlightRef.current = false;
          rankingsInFlightPromiseRef.current = null;
          if (showLoader) {
            setRankingsLoading(false);
          }
        }
      }
    };

    const promise = run();
    rankingsInFlightPromiseRef.current = promise;
    await promise;
  }, [
    applyRankingsState,
    currentWeek,
    endDateTime,
    hydrateRankingsFromCache,
    leagueId,
    weekId,
    weeks,
    year,
    games,
  ]);

  useEffect(() => {
    loadRankingsDataRef.current = loadRankingsData;
  }, [loadRankingsData]);

  const buildRankingsRefreshSignature = useCallback(
    (gamesList = []) =>
      gamesList
        .map(
          (game) =>
            `${game._id}:${game.isGameOver ? 1 : 0}:${game.competitors?.[0]?.score ?? ""}:${game.competitors?.[1]?.score ?? ""}:${game.currentTime ?? ""}`
        )
        .join("|"),
    []
  );

  useEffect(() => {
    if (!rankingsAvailable || !leagueId || !year || !weekId) {
      return;
    }

    const signature = buildRankingsRefreshSignature(games);
    const previous = rankingsScoreSignatureRef.current;

    if (previous && signature !== previous) {
      setSeasonGames((previousSeasonGames) => {
        if (!previousSeasonGames.length) {
          return previousSeasonGames;
        }

        const merged = mergeLiveGamesIntoSeasonGames(
          previousSeasonGames,
          games
        );

        if (merged !== previousSeasonGames) {
          writeRankingsCache(
            buildRankingsCacheKey(leagueId, year, weekId),
            {
              seasonGames: merged,
              priorYearWeeks,
              priorYearGames,
            },
            { gamesInProgress: getAreAnyGamesInProgress(games) }
          );
        }

        return merged;
      });
    }

    rankingsScoreSignatureRef.current = signature;
  }, [
    buildRankingsRefreshSignature,
    games,
    leagueId,
    priorYearGames,
    priorYearWeeks,
    rankingsAvailable,
    weekId,
    year,
  ]);

  useEffect(() => {
    if (!standingsViewActive) {
      if (wasRankingsViewActiveRef.current) {
        setRankingsLoading(false);
      }
      wasRankingsViewActiveRef.current = false;
      return;
    }

    wasRankingsViewActiveRef.current = true;

    if (
      !leagueId ||
      !year ||
      !weekId ||
      !endDateTime ||
      !currentWeek ||
      !weeks.length
    ) {
      return;
    }

    if (!isLatestLeagueYear(leagueId, year)) {
      setSeasonGames([]);
      setPriorYearWeeks([]);
      setPriorYearGames([]);
      setRankingsLoading(false);
      rankingsFetchKeyRef.current = null;
      return;
    }

    const fetchKey = `${leagueId}|${year}|${weekId}`;
    const cacheKey = buildRankingsCacheKey(leagueId, year, weekId);

    const gamesInProgress = getAreAnyGamesInProgress(games);
    if (
      rankingsFetchKeyRef.current === fetchKey &&
      seasonGames.length > 0 &&
      isRankingsCacheKeyValid(cacheKey, { gamesInProgress })
    ) {
      setRankingsSeasonSettled(true);
      setRankingsLoading(false);
      return;
    }

    if (hydrateRankingsFromCache(cacheKey, gamesInProgress)) {
      rankingsFetchKeyRef.current = fetchKey;
      setRankingsSeasonSettled(true);
      setRankingsLoading(false);
      return;
    }

    if (rankingsFetchKeyRef.current === fetchKey) {
      if (!rankingsLoadInFlightRef.current) {
        rankingsFetchKeyRef.current = null;
      }
    }

    setRankingsLoading(true);
    rankingsFetchKeyRef.current = fetchKey;
    void loadRankingsData({ showLoader: true });
  }, [
    currentWeek,
    endDateTime,
    games,
    hydrateRankingsFromCache,
    leagueId,
    loadRankingsData,
    seasonGames.length,
    standingsViewActive,
    weekId,
    weeks.length,
    year,
  ]);

  useEffect(() => {
    if (standingsViewActive) {
      return;
    }

    if (!rankingsAvailable && !playoffsAvailable) {
      return;
    }

    if (
      !leagueId ||
      !year ||
      !weekId ||
      !endDateTime ||
      !currentWeek ||
      !weeks.length
    ) {
      return;
    }

    if (!isLatestLeagueYear(leagueId, year)) {
      return;
    }

    const fetchKey = `${leagueId}|${year}|${weekId}`;
    const cacheKey = buildRankingsCacheKey(leagueId, year, weekId);

    const gamesInProgress = getAreAnyGamesInProgress(games);
    if (
      rankingsFetchKeyRef.current === fetchKey &&
      seasonGames.length > 0 &&
      isRankingsCacheKeyValid(cacheKey, { gamesInProgress })
    ) {
      return;
    }

    if (hydrateRankingsFromCache(cacheKey, gamesInProgress)) {
      rankingsFetchKeyRef.current = fetchKey;
      setRankingsSeasonSettled(true);
      return;
    }

    if (rankingsFetchKeyRef.current === fetchKey) {
      if (rankingsLoadInFlightRef.current) {
        return;
      }
      rankingsFetchKeyRef.current = null;
    }

    rankingsFetchKeyRef.current = fetchKey;
    loadRankingsData({ showLoader: false });

    const cachedTeams = teamsByLeagueRef.current[String(leagueId)];
    if (!cachedTeams?.length && leagueId) {
      void callApi({
        method: "GET",
        endpoint: `/api/gamemanagement/teams?leagueId=${leagueId}`,
      })
        .then((nextTeams) => {
          if (!nextTeams?.length) {
            return;
          }
          teamsByLeagueRef.current[String(leagueId)] = nextTeams;
          setTeams(nextTeams);
        })
        .catch(() => {});
    }
  }, [
    currentWeek,
    endDateTime,
    games,
    hydrateRankingsFromCache,
    leagueId,
    loadRankingsData,
    playoffsAvailable,
    rankingsAvailable,
    seasonGames.length,
    standingsViewActive,
    weekId,
    weeks.length,
    year,
  ]);

  const handleScoreboardTabChange = (_, tabIndex) => {
    if (tabIndex === 1 && !rankingsAvailable) {
      return;
    }

    if (tabIndex === 2 && !playoffsAvailable) {
      return;
    }

    const scoreboardView =
      tabIndex === 1
        ? SCOREBOARD_VIEW_RANKINGS
        : tabIndex === 2
          ? SCOREBOARD_VIEW_BRACKET
          : null;

    const standingsReady =
      rankingsSeasonSettled &&
      !rankingsLoading &&
      (teams.length > 0 ||
        teamsByLeagueRef.current[String(leagueId)]?.length > 0);

    if ((tabIndex === 1 || tabIndex === 2) && !standingsReady) {
      setRankingsLoading(true);
    }

    setScoreboardTabIndex(tabIndex);

    navigate(
      {
        pathname: buildScoreboardPath({ scoreboardView }),
        search: location.search,
        hash: location.hash,
      },
      { replace: tabIndex === 0 }
    );
  };
  const groupedGames = useMemo(() => {
    return getGroupedGames({
      games,
      picks,
      teams,
      spreadMode,
      week: currentWeek,
    });
  }, [currentWeek, games, picks, spreadMode, teams]);

  const gameSlugById = useMemo(() => assignGameSlugs(games), [games]);

  const getGameHref = useCallback(
    (game) =>
      withGameSlug(
        location.pathname,
        "/scoreboards/",
        gameSlugById[game._id]
      ),
    [gameSlugById, location.pathname]
  );

  useScrollToGameSlug({
    games,
    enabled: !dataLoading && !isRankingsViewActive && !isPlayoffsViewActive,
  });
  usePageSeo({
    enabled: !dataLoading,
    pageKind: "scores",
    leagueId,
    year,
    week: currentWeek,
    games,
    gameSlugById,
  });

  const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
  const areAllGamesOver = getAreAllGamesOver(games);
  const gamesNotStarted = games.filter((x) => !hasGameStarted(x.startDateTime));
  const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
  const picksNotSelected = getPicksNotSelected(gamesNotStarted, picks);
  const disableTie = currentWeek?.disableTie;

  const isLoading = dataLoading && !areAnyGamesInProgress;
  const resolvedTeamCount =
    teams.length ||
    teamsByLeagueRef.current[String(leagueId)]?.length ||
    0;
  const standingsSeasonReady =
    !rankingsLoading &&
    rankingsSeasonSettled &&
    resolvedTeamCount > 0;
  const rankingsPanelLoading =
    isRankingsViewActive && !standingsSeasonReady;
  const playoffsPanelLoading =
    isPlayoffsViewActive && !standingsSeasonReady;
  const standingsPanelLoading = rankingsPanelLoading || playoffsPanelLoading;
  const handleFilterDate = undefined;

  const handleMakePick = useCallback(
    (pick) => {
      const gameFound = games.find((x) => x._id === pick.gameId);
      if (!isAuthenticated || gameFound?.isGameOver) return;
      const pickFound = picks.find((x) => x.gameId === pick.gameId);

      const upsertPick = async (id, pick) => {
        setUpdatingPick(true);

        const pickParams = {
          gameId: pick.gameId,
          pickId: pick.pickId,
          guessedAwayScore: pick.guessedAwayScore,
          guessedHomeScore: pick.guessedHomeScore,
        };

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

  const handleUpdateGame = useCallback(async (game) => {
    if (!isAuthenticated) return;

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
      isGameOfTheWeek: game.isGameOfTheWeek,
      homeStadiumName: game.homeStadiumName,
      homeStadiumCity: game.homeStadiumCity,
      homeStadiumLocation: game.homeStadiumLocation,
    };

    await callApi({
      method: "PUT",
      endpoint: `/api/gamemanagement/games/${encodeURIComponent(game.id)}`,
      body: gameParams,
    });

    window.location.reload();
  }, []);

  let gameDate = null;

  return (
    <div>
      <PageContainer>
        {!slimMode && (
          <TinyScoreboard
            {...{
              title: `Let's Go!!!`,
              games: groupedGames.notCompleted,
              loading: false,
              getGameHref,
            }}
          />
        )}
        {!isLoading && !slimMode && (
          <TinyScoreboard
            {...{
              title: `Game Over`,
              games: groupedGames.completed,
              loading: false,
              getGameHref,
            }}
          />
        )}
        <ArcadeGameSearchBar
          leagueId={leagueId}
          leagues={leagues}
          yearSelected={year}
          weekId={weekId}
          weeks={weeks}
          loading={false}
          onFilterLeague={handleFilterLeague}
          onFilterYear={handleFilterYear}
          onFilterWeek={handleFilterWeek}
          onFilterDate={handleFilterDate}
        />
        {isAuthenticated && !slimMode && (
          <div>
            <ArcadePickResult
              loading={picksDataLoading}
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
          handleSlimToggleOn={enableSlimMode}
          handleSlimToggleOff={disableSlimMode}
          spreadMode={spreadMode}
          slimMode={slimMode}
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
                value={activeScoreboardTab}
                onChange={handleScoreboardTabChange}
                variant="scrollable"
                scrollButtons={false}
                aria-label="scoreboard views"
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  paddingBottom: "12px",
                  "& .MuiTabs-scroller": {
                    minWidth: 0,
                  },
                  "& .MuiTabs-list": {
                    justifyContent: "safe center",
                  },
                  "& .MuiTab-root": {
                    minHeight: 48,
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    color: "#000",
                  },
                }}
              >
                <Tab label="Scores" {...a11yProps(0, "scoreboard")} />
                {rankingsAvailable && (
                  <Tab label="Rankings" {...a11yProps(1, "scoreboard")} />
                )}
                {playoffsAvailable && (
                  <Tab label="Playoffs" {...a11yProps(2, "scoreboard")} />
                )}
              </Tabs>
            </Box>
            {!standingsPanelLoading && <LeaderHypeBanner />}
            <TabPanel
              value={activeScoreboardTab}
              index={0}
              idPrefix="scoreboard"
              bold={false}
            >
            <div
              className="scoreboard-tab-panel-main"
              style={slimMode ? styles.rootSlim : styles.root}
            >
              {isLoading && <StandingsTabLoader variant="scores" />}
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
                        <div style={styles.dateHeader(slimMode)}>
                          {gameDate}
                        </div>
                      )}
                      <Game
                        game={game}
                        gameSlug={gameSlugById[game._id]}
                        pick={picks.find((x) => x.gameId === game._id)}
                        handleMakePick={handleMakePick}
                        handleUpdateGame={handleUpdateGame}
                        isAuthenticated={isAuthenticated}
                        userId={userId}
                        disableTie={disableTie}
                        updatingPick={updatingPick}
                        spreadMode={spreadMode}
                        slimMode={slimMode}
                        picksDataLoading={picksDataLoading}
                        fieldPickers={getFieldPickersForGame(
                          game,
                          revealedPicks,
                          pickUsers
                        )}
                      />
                    </div>
                  );
                })}
              {!isLoading && groupedGames.completed.length > 0 && (
                    <div style={styles.dateHeader(slimMode, 10)}>
                      *** Game Over ***
                    </div>
                  )}
              {!isLoading &&
                groupedGames.completed.map((game) => {
                  const newGameDate = moment(get(game, "startDateTime")).format(
                    "dddd MMM D YYYY"
                  );
                  const newDate = gameDate !== newGameDate;
                  if (newDate) gameDate = newGameDate;

                  return (
                    <div key={game._id}>
                      {newDate && (
                        <div style={styles.dateHeader(slimMode, 10)}>
                          {gameDate}
                        </div>
                      )}
                      <Game
                        game={game}
                        gameSlug={gameSlugById[game._id]}
                        pick={picks.find((x) => x.gameId === game._id)}
                        handleMakePick={handleMakePick}
                        handleUpdateGame={handleUpdateGame}
                        isAuthenticated={isAuthenticated}
                        userId={userId}
                        disableTie={disableTie}
                        spreadMode={spreadMode}
                        slimMode={slimMode}
                        picksDataLoading={picksDataLoading}
                        fieldPickers={getFieldPickersForGame(
                          game,
                          revealedPicks,
                          pickUsers
                        )}
                      />
                    </div>
                  );
                })}
            </div>
            </TabPanel>
            {rankingsAvailable && (
              <TabPanel
                value={activeScoreboardTab}
                index={1}
                key="rankings-tab"
                idPrefix="scoreboard"
                bold={false}
              >
                <div className="scoreboard-tab-panel-main">
                  {rankingsPanelLoading ? (
                    <StandingsTabLoader variant="rankings" />
                  ) : (
                    <>
                    <StandingsRefreshNotice />
                    <TeamRankings
                      leagueId={leagueId}
                      seasonGamesCurrent={rankingSnapshots.current}
                      seasonGamesPrevious={rankingSnapshots.previous}
                      usesPriorPlayoffs={rankingSnapshots.usesPriorPlayoffs}
                      rankingsAvailable={rankingSnapshots.rankingsAvailable}
                      teams={teams}
                    />
                    </>
                  )}
                </div>
              </TabPanel>
            )}
            {playoffsAvailable && (
              <TabPanel
                value={activeScoreboardTab}
                index={2}
                key="playoffs-tab"
                idPrefix="scoreboard"
                bold={false}
              >
                <div className="scoreboard-tab-panel-main">
                  {playoffsPanelLoading ? (
                    <StandingsTabLoader variant="playoffs" />
                  ) : (
                    <>
                    <StandingsRefreshNotice />
                    <PlayoffBracket
                      teams={teams}
                      seasonGames={seasonGames}
                      liveGames={games}
                      weeks={weeks}
                    />
                    </>
                  )}
                </div>
              </TabPanel>
            )}
          </Box>
        }
        <RemainingGamesNotifier
          {...{ isAuthenticated, picksNotSelected, picksDataLoading }}
        />
      </PageContainer>
    </div>
  );
};

export default Scoreboard;