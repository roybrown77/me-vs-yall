import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import last from "lodash/last";
import moment from "moment-timezone";
import queryString from "query-string";
import Skeleton from "@mui/material/Skeleton";

import GamePickAvatarStack from "../../components/Game/components/GamePickAvatarStack";
import usePollWhileGamesInProgress from "../../hooks/usePollWhileGamesInProgress";
import {
  buildWeekQueryMetaMap,
  shouldSkipWeekSegment,
} from "../../utilities/weekQueryMeta";
import { fetchGameWeeks } from "../../utilities/gameWeeks";
import { callApi, isRequestAborted } from "../../utilities/http";
import { getLeagueName } from "../../utilities/getLeagueName";
import {
  buildGameSlugFromCompetitors,
  buildNavigationPath,
} from "../../utilities/navigationPaths";
import { getFieldPickersForGame } from "../Scoreboard/utilities";
import { hasGameStarted, leagues } from "../../utilities";

const RECENT_GAME_LIMIT = 3;

const findScoreboardWeek = (weeks = []) => {
  const sorted = [...weeks].sort(
    (a, b) => new Date(a.beginDateTime) - new Date(b.beginDateTime)
  );
  const now = moment().tz("America/New_York");

  const active = sorted.find((week) => {
    if (!week?.beginDateTime || !week?.endDateTime) {
      return false;
    }

    const begin = moment(week.beginDateTime).tz("America/New_York");
    const end = moment(week.endDateTime).tz("America/New_York");
    return now.isSameOrAfter(begin) && now.isSameOrBefore(end);
  });

  if (active) {
    return active;
  }

  const completed = sorted.filter(
    (week) =>
      week?.endDateTime &&
      moment(week.endDateTime).tz("America/New_York").isBefore(now)
  );

  if (completed.length) {
    return completed[completed.length - 1];
  }

  return sorted[0] || null;
};

const getScoreValue = (competitor) => {
  const score = competitor?.score;
  if (score !== null && score !== undefined) {
    return score;
  }

  return 0;
};

const getTeamNickname = (competitor = {}) => {
  const location = String(competitor.location || "").trim();
  let nickname = String(competitor.name || "").trim();

  if (location && nickname) {
    const locationPrefix = `${location} `;
    if (nickname.toLowerCase().startsWith(locationPrefix.toLowerCase())) {
      nickname = nickname.slice(locationPrefix.length).trim();
    }
  }

  if (nickname) {
    return nickname;
  }

  if (location) {
    return location;
  }

  return String(competitor.shortLocation || "—").trim() || "—";
};

const enrichGamesWithTeams = (games = [], teams = []) => {
  const teamsById = teams.reduce((acc, team) => {
    acc[String(team._id)] = team;
    return acc;
  }, {});

  return games.map((game) => ({
    ...game,
    competitors: (game.competitors || []).map((competitor) => {
      const team = teamsById[String(competitor._id)];

      if (!team) {
        return competitor;
      }

      return {
        ...team,
        ...competitor,
        name: team.name,
        location: team.location,
        shortLocation: team.shortLocation,
        color: team.color || competitor.color,
      };
    }),
  }));
};

const HomeRecentScores = () => {
  const [loading, setLoading] = useState(true);
  const [recentGames, setRecentGames] = useState([]);
  const [revealedPicks, setRevealedPicks] = useState([]);
  const [pickUsers, setPickUsers] = useState([]);
  const [navigationContext, setNavigationContext] = useState(null);

  const loadRecentScores = useCallback(async (signal, { showLoader = false } = {}) => {
    if (showLoader) {
      setLoading(true);
    }
    const leagueName = getLeagueName();
    const league =
      leagues.find(
        (entry) => entry.name.toLowerCase() === String(leagueName || "").toLowerCase()
      ) || leagues[0];
    const year = last(league?.years);

    if (!league?.id || !year) {
      setRecentGames([]);
      setNavigationContext(null);
      setLoading(false);
      return;
    }

    try {
      const weeksRaw = await fetchGameWeeks({
        leagueId: league.id,
        year,
        signal,
      });

      if (signal?.aborted) {
        return;
      }

      const selectedWeek = findScoreboardWeek(weeksRaw || []);

      if (!selectedWeek) {
        setRecentGames([]);
        setNavigationContext(null);
        setLoading(false);
        return;
      }

      const weekQueryMetaById = buildWeekQueryMetaMap(weeksRaw || []);
      const weekMeta = weekQueryMetaById[selectedWeek._id];
      const weekSegment =
        weekMeta?.weekSegment && !shouldSkipWeekSegment(selectedWeek)
          ? weekMeta.weekSegment
          : null;

      const query = {
        leagueId: league.id,
        year,
        weekId: selectedWeek._id,
        beginDateTime: selectedWeek.beginDateTime,
        endDateTime: selectedWeek.endDateTime,
      };

      const [games, teams = []] = await Promise.all([
        callApi({
          method: "GET",
          endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
          signal,
        }),
        callApi({
          method: "GET",
          endpoint: `/api/gamemanagement/teams?leagueId=${league.id}`,
          signal,
        }),
      ]);

      if (signal?.aborted) {
        return;
      }

      const scheduleGames = enrichGamesWithTeams(
        Array.isArray(games) ? games : [],
        Array.isArray(teams) ? teams : []
      );
      const startedGames = scheduleGames
        .filter((game) => hasGameStarted(game.startDateTime))
        .sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime))
        .slice(0, RECENT_GAME_LIMIT);

      const anyGameStarted = startedGames.length > 0;
      const communityQuery = {
        ...query,
        communityPicksForStartedGames: true,
      };

      const [communityPicks = [], users = []] = anyGameStarted
        ? await Promise.all([
            callApi({
              method: "GET",
              endpoint: `/api/pickmanagement/picks?${queryString.stringify(
                communityQuery
              )}`,
              signal,
            }),
            callApi({
              method: "GET",
              endpoint: `/api/usermanagement/users?${queryString.stringify(query)}`,
              signal,
            }),
          ])
        : [[], []];

      if (signal?.aborted) {
        return;
      }

      setRecentGames(startedGames);
      setRevealedPicks(anyGameStarted ? communityPicks || [] : []);
      setPickUsers(anyGameStarted ? users || [] : []);
      setNavigationContext({
        leagueName: league.name,
        year,
        seasonType: weekMeta?.seasonType,
        weekSegment,
      });
    } catch (error) {
      if (isRequestAborted(error)) {
        return;
      }

      setRecentGames([]);
      setNavigationContext(null);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadRecentScores(controller.signal, { showLoader: true });

    return () => controller.abort();
  }, [loadRecentScores]);

  const refreshRecentScores = useCallback(() => {
    const controller = new AbortController();
    loadRecentScores(controller.signal);
    return () => controller.abort();
  }, [loadRecentScores]);

  usePollWhileGamesInProgress({
    games: recentGames,
    onPoll: refreshRecentScores,
    enabled: recentGames.length > 0,
  });

  const leadersBasePath = useMemo(() => {
    if (!navigationContext) {
      return "/leaders/nfl";
    }

    return buildNavigationPath({
      routeBase: "/leaders/",
      leagueName: navigationContext.leagueName,
      year: navigationContext.year,
      seasonType: navigationContext.seasonType,
      weekSegment: navigationContext.weekSegment,
    });
  }, [navigationContext]);

  if (!loading && recentGames.length === 0) {
    return null;
  }

  return (
    <section className="home-recent-scores" aria-label="Recent scoreboard results">
      {loading &&
        Array.from({ length: RECENT_GAME_LIMIT }, (_, index) => (
          <Skeleton
            key={`home-recent-scores-skeleton-${index}`}
            animation="pulse"
            height={50}
            variant="rounded"
            className="home-recent-scores__skeleton"
          />
        ))}

      {!loading &&
        recentGames.map((game) => {
          const away = game.competitors?.[0] || {};
          const home = game.competitors?.[1] || {};
          const awayLabel = getTeamNickname(away);
          const homeLabel = getTeamNickname(home);
          const fieldPickers = getFieldPickersForGame(game, revealedPicks, pickUsers);
          const gameSlug = buildGameSlugFromCompetitors(game);
          const scoresHref = buildNavigationPath({
            routeBase: "/scoreboards/",
            leagueName: navigationContext.leagueName,
            year: navigationContext.year,
            seasonType: navigationContext.seasonType,
            weekSegment: navigationContext.weekSegment,
            gameSlug,
          });
          const leadersHref = leadersBasePath;

          return (
            <article key={game._id} className="home-recent-scores__game">
              <Link
                to={scoresHref}
                className="home-recent-scores__scores-link"
                aria-label={`View ${awayLabel} vs ${homeLabel} on Scores`}
              >
                <div className="home-recent-scores__scores-body">
                  <div className="home-recent-scores__half home-recent-scores__half--away">
                    <span className="home-recent-scores__team-label">{awayLabel}</span>
                    <span
                      className="home-recent-scores__score-pill"
                      style={{ backgroundColor: away.color || "#1F2937" }}
                    >
                      {getScoreValue(away)}
                    </span>
                  </div>
                  <span className="home-recent-scores__versus" aria-hidden="true">
                    vs
                  </span>
                  <div className="home-recent-scores__half home-recent-scores__half--home">
                    <span
                      className="home-recent-scores__score-pill"
                      style={{ backgroundColor: home.color || "#1F2937" }}
                    >
                      {getScoreValue(home)}
                    </span>
                    <span className="home-recent-scores__team-label">{homeLabel}</span>
                  </div>
                </div>
                <span className="home-recent-scores__row-arrow" aria-hidden="true">
                  ›
                </span>
              </Link>

              <div className="home-recent-scores__leaders-wrap">
                <div
                  className="home-recent-scores__leaders-row"
                  aria-label="Community picks for this game"
                >
                  <div className="home-recent-scores__leaders-half home-recent-scores__leaders-half--away">
                    <GamePickAvatarStack
                      side="left"
                      pickers={fieldPickers.away}
                      leadersHref={leadersHref}
                      maxVisible={3}
                    />
                  </div>
                  <span className="home-recent-scores__leaders-vs">vs</span>
                  <div className="home-recent-scores__leaders-half home-recent-scores__leaders-half--home">
                    <GamePickAvatarStack
                      side="right"
                      pickers={fieldPickers.home}
                      leadersHref={leadersHref}
                      maxVisible={3}
                    />
                  </div>
                </div>
                <Link
                  to={leadersHref}
                  className="home-recent-scores__leaders-link"
                  aria-label="View Leaders"
                >
                  <span className="home-recent-scores__row-arrow" aria-hidden="true">
                    ›
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
    </section>
  );
};

export default HomeRecentScores;
