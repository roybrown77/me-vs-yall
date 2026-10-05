import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import last from "lodash/last";
import queryString from "query-string";

import GamePickAvatarStack from "../../components/Game/components/GamePickAvatarStack";
import usePollWhileGamesInProgress from "../../hooks/usePollWhileGamesInProgress";
import { callApi, isRequestAborted } from "../../utilities/http";
import { getLeagueName } from "../../utilities/getLeagueName";
import {
  buildGameSlugFromCompetitors,
  buildNavigationPath,
} from "../../utilities/navigationPaths";
import { getAreAnyGamesInProgress, leagues } from "../../utilities";

const RECENT_GAME_LIMIT = 3;

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

const HomeRecentGameCard = memo(function HomeRecentGameCard({
  game,
  navigationContext,
  leadersHref,
}) {
  const away = game.competitors?.[0] || {};
  const home = game.competitors?.[1] || {};
  const awayLabel = getTeamNickname(away);
  const homeLabel = getTeamNickname(home);
  const fieldPickers = game.fieldPickers || { away: [], home: [] };
  const gameSlug = buildGameSlugFromCompetitors(game);
  const scoresHref = buildNavigationPath({
    routeBase: "/scoreboards/",
    leagueName: navigationContext.leagueName,
    year: navigationContext.year,
    seasonType: navigationContext.seasonType,
    weekSegment: navigationContext.weekSegment,
    gameSlug,
  });

  return (
    <article className="home-recent-scores__game">
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
});

const HomeRecentScoresSkeleton = () => (
  <section
    className="home-recent-scores home-recent-scores--loading"
    aria-busy="true"
    aria-label="Loading recent scoreboard results"
  >
    {Array.from({ length: RECENT_GAME_LIMIT }, (_, index) => (
      <Skeleton
        key={`recent-scores-skeleton-${index}`}
        className="home-recent-scores__skeleton"
        animation="pulse"
        height="2.15rem"
        variant="rect"
        width="100%"
      />
    ))}
  </section>
);

const HomeRecentScores = () => {
  const [loading, setLoading] = useState(true);
  const [recentGames, setRecentGames] = useState([]);
  const [navigationContext, setNavigationContext] = useState(null);

  const loadRecentScores = useCallback(async (signal) => {
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
      const payload = await callApi({
        method: "GET",
        endpoint: `/api/gamemanagement/home-recent-scores?${queryString.stringify({
          leagueId: league.id,
          year,
        })}`,
        signal,
      });

      if (signal?.aborted) {
        return;
      }

      const games = Array.isArray(payload?.games) ? payload.games.slice(0, RECENT_GAME_LIMIT) : [];
      setRecentGames(games);
      setNavigationContext(payload?.navigation || null);
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
    setLoading(true);
    loadRecentScores(controller.signal);

    return () => controller.abort();
  }, [loadRecentScores]);

  usePollWhileGamesInProgress({
    games: recentGames,
    onPoll: () => {
      const controller = new AbortController();
      loadRecentScores(controller.signal);
      return () => controller.abort();
    },
    enabled: recentGames.length > 0 && getAreAnyGamesInProgress(recentGames),
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

  if (loading && recentGames.length === 0) {
    return <HomeRecentScoresSkeleton />;
  }

  if (!navigationContext) {
    return null;
  }

  return (
    <section className="home-recent-scores" aria-label="Recent scoreboard results">
      {recentGames.map((game) => (
        <HomeRecentGameCard
          key={game._id}
          game={game}
          navigationContext={navigationContext}
          leadersHref={leadersBasePath}
        />
      ))}
    </section>
  );
};

export default HomeRecentScores;
