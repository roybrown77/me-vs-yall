import { useCallback, useEffect, useRef, useState } from "react";
import get from "lodash/get";
import last from "lodash/last";

import { formatWeeks, leagues } from "../utilities";
import { fetchGameWeeks } from "../utilities/gameWeeks";
import {
  buildNavigationPath,
  buildWeekSegmentFromWeek,
  getLegacySelectionFromQuery,
  parseNavigationPath,
  parseWeekSegment,
} from "../utilities/navigationPaths";

const inferSeasonType = (week = {}) => {
  const description = String(week.description || "").toLowerCase();

  if (
    description.includes("preseason") ||
    description.includes("hall of fame") ||
    /pre\s*season/.test(description)
  ) {
    return 1;
  }

  if (
    description.includes("playoff") ||
    description.includes("wild card") ||
    description.includes("divisional") ||
    description.includes("conference") ||
    description.includes("super bowl") ||
    description.includes("final")
  ) {
    return 3;
  }

  return 2;
};

const sortWeeksForNumbering = (weeks = []) => {
  return [...weeks].sort((a, b) => {
    const aTime = new Date(a.beginDateTime || 0).getTime();
    const bTime = new Date(b.beginDateTime || 0).getTime();
    return aTime - bTime;
  });
};

const buildWeekQueryMetaMap = (weeks = []) => {
  const sortedWeeks = sortWeeksForNumbering(weeks).filter(
    (week) => !week?.isRollup && !shouldSkipWeekSegment(week)
  );
  const countersBySeasonType = { 1: 0, 2: 0, 3: 0 };
  const usedSegmentsBySeasonType = { 1: new Set(), 2: new Set(), 3: new Set() };
  const weekMetaById = {};

  sortedWeeks.forEach((week) => {
    const seasonType = inferSeasonType(week);
    countersBySeasonType[seasonType] = (countersBySeasonType[seasonType] || 0) + 1;
    const weekNumber = countersBySeasonType[seasonType];
    let weekSegment = buildWeekSegmentFromWeek(week, { weekNumber });
    const usedSegments = usedSegmentsBySeasonType[seasonType];

    if (usedSegments.has(weekSegment)) {
      let duplicateIndex = 2;
      while (usedSegments.has(`${weekSegment}-${duplicateIndex}`)) {
        duplicateIndex += 1;
      }
      weekSegment = `${weekSegment}-${duplicateIndex}`;
    }

    usedSegments.add(weekSegment);

    weekMetaById[week._id] = {
      seasonType,
      week: weekNumber,
      weekSegment,
    };
  });

  return weekMetaById;
};

const shouldSkipWeekSegment = (selectedWeek = {}) => {
  const labelCandidates = [
    selectedWeek.displayName,
    selectedWeek.description,
    selectedWeek.name,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return labelCandidates.some((label) => {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel.startsWith("entire")) {
      return true;
    }

    return /^week\s+\d+\s*-\s*\d+\b/i.test(label);
  });
};

const findLeagueByName = (leagueName) =>
  leagues.find(
    (league) => league.name.toLowerCase() === String(leagueName || "").toLowerCase()
  );

const getInitialSelection = ({ routeBase, initialLeagueId, initialYear }) => {
  const fromPath = parseNavigationPath(window.location.pathname, routeBase);
  const fromQuery = getLegacySelectionFromQuery();

  const leagueFromPath = findLeagueByName(fromPath.leagueName);
  const leagueFromQuery = leagues.find((league) => {
    if (!fromQuery.leagueQuery) return false;

    return (
      league.id === fromQuery.leagueQuery ||
      league.name.toLowerCase() === fromQuery.leagueQuery.toLowerCase()
    );
  });

  const selectedLeague =
    leagueFromPath ||
    leagueFromQuery ||
    leagues.find((league) => league.id === initialLeagueId) ||
    leagues[0];
  const fallbackYear = last(selectedLeague?.years) || initialYear;

  const selectedYear = [fromPath.year, fromQuery.yearQuery].find((year) =>
    selectedLeague?.years?.includes(year)
  ) ?? fallbackYear;

  return {
    leagueId: selectedLeague?.id,
    year: selectedYear,
    seasonTypeQuery: fromPath.seasonType ?? fromQuery.seasonTypeQuery,
    weekSegmentQuery: fromPath.weekSegment,
    weekQuery: fromPath.week ?? fromQuery.weekQuery,
    weekIdQuery: fromQuery.weekIdQuery,
    gameSlug: fromPath.gameSlug,
  };
};

const syncSelectionToPath = ({
  routeBase,
  leagueId,
  year,
  selectedWeek,
  weekQueryMetaById,
  gameSlug = null,
}) => {
  const league = leagues.find((x) => x.id === leagueId);
  const selectedWeekId = selectedWeek?._id;
  const weekMeta = selectedWeekId ? weekQueryMetaById?.[selectedWeekId] : null;

  const scoreboardView = routeBase.includes("scoreboards")
    ? parseNavigationPath(window.location.pathname, routeBase).scoreboardView
    : null;

  const nextUrl = buildNavigationPath({
    routeBase,
    leagueName: league?.name,
    year,
    seasonType: weekMeta?.seasonType,
    weekSegment:
      weekMeta?.weekSegment && !shouldSkipWeekSegment(selectedWeek)
        ? weekMeta.weekSegment
        : null,
    scoreboardView,
    gameSlug: scoreboardView ? null : gameSlug,
  });

  const currentPathAndSearch = `${window.location.pathname}${window.location.search}`;

  if (currentPathAndSearch !== nextUrl || window.location.hash) {
    window.history.replaceState({}, "", nextUrl);
  }
};

const useLeagueWeekNavigation = ({
  routeBase,
  initialLeagueId,
  initialYear,
  gameWeeksQueryExtras = {},
  onLoadData,
}) => {
  const [weeks, setWeeks] = useState([]);
  const [leagueId, setLeagueId] = useState(initialLeagueId);
  const [year, setYear] = useState(initialYear);
  const [weekId, setWeekId] = useState(null);
  const [beginDateTime, setBeginDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  const weeksRawRef = useRef([]);
  const gameWeeksQueryExtrasRef = useRef(gameWeeksQueryExtras);
  const onLoadDataRef = useRef(onLoadData);
  const weekQueryMetaByIdRef = useRef({});
  const initialWeekQueryRef = useRef(null);
  const initialWeekSegmentRef = useRef(null);
  const initialWeekIdQueryRef = useRef(null);
  const initialSeasonTypeQueryRef = useRef(null);
  const initialGameSlugRef = useRef(null);
  const activeScoresRequestRef = useRef(null);
  const scoresRequestEpochRef = useRef(0);

  const beginCriteriaChangeRequest = useCallback(() => {
    activeScoresRequestRef.current?.abort();
    activeScoresRequestRef.current = new AbortController();
    scoresRequestEpochRef.current += 1;

    return {
      signal: activeScoresRequestRef.current.signal,
      requestEpoch: scoresRequestEpochRef.current,
    };
  }, []);

  useEffect(() => {
    gameWeeksQueryExtrasRef.current = gameWeeksQueryExtras;
  }, [gameWeeksQueryExtras]);

  useEffect(() => {
    onLoadDataRef.current = onLoadData;
  }, [onLoadData]);

  const loadGameWeeks = useCallback(
    async ({ leagueId: leagueIdToLoad, year: yearToLoad, signal }) => {
      const weeks = await fetchGameWeeks({
        leagueId: leagueIdToLoad,
        year: yearToLoad,
        signal,
        ...gameWeeksQueryExtrasRef.current,
      });

      return weeks;
    },
    []
  );

  const selectWeekAndLoadData = useCallback(
    async ({
      weeksRaw,
      leagueId,
      year,
      selectedWeek,
      gameSlug = null,
      signal,
      requestEpoch,
    }) => {
      if (signal?.aborted) return;
      if (
        requestEpoch != null &&
        requestEpoch !== scoresRequestEpochRef.current
      ) {
        return;
      }
      if (!weeksRaw?.length) return;

      const currentWeek = selectedWeek || last(weeksRaw);
      if (!currentWeek) return;

      weeksRawRef.current = weeksRaw;

      const selectedYear = year ?? currentWeek.year;
      const weekQueryMetaById = buildWeekQueryMetaMap(weeksRaw);

      if (signal?.aborted) return;

      setWeeks(formatWeeks(weeksRaw));
      setLeagueId(leagueId);
      setYear(selectedYear);
      setWeekId(currentWeek._id);
      setBeginDateTime(currentWeek.beginDateTime);
      setEndDateTime(currentWeek.endDateTime);

      weekQueryMetaByIdRef.current = weekQueryMetaById;

      syncSelectionToPath({
        routeBase,
        leagueId,
        year: selectedYear,
        selectedWeek: currentWeek,
        weekQueryMetaById,
        gameSlug,
      });

      await onLoadDataRef.current?.({
        weeks: weeksRaw,
        leagueId,
        year: selectedYear,
        weekId: currentWeek._id,
        beginDateTime: currentWeek.beginDateTime,
        endDateTime: currentWeek.endDateTime,
        signal,
        requestEpoch,
      });
    },
    [routeBase]
  );

  useEffect(() => {
    const { signal, requestEpoch } = beginCriteriaChangeRequest();

    (async () => {
      const {
        leagueId: initialLeagueIdResolved,
        year: initialYearResolved,
        seasonTypeQuery,
        weekQuery,
        weekSegmentQuery,
        weekIdQuery,
        gameSlug,
      } = getInitialSelection({
        routeBase,
        initialLeagueId,
        initialYear,
      });

      initialWeekQueryRef.current = weekQuery;
      initialWeekSegmentRef.current = weekSegmentQuery;
      initialWeekIdQueryRef.current = weekIdQuery;
      initialSeasonTypeQueryRef.current = seasonTypeQuery;
      initialGameSlugRef.current = gameSlug;

      const weeksRaw = await loadGameWeeks({
        leagueId: initialLeagueIdResolved,
        year: initialYearResolved,
        signal,
      });
      if (signal.aborted || requestEpoch !== scoresRequestEpochRef.current) {
        return;
      }
      if (!weeksRaw) return;

      const weekQueryMetaById = buildWeekQueryMetaMap(weeksRaw);
      weekQueryMetaByIdRef.current = weekQueryMetaById;

      const selectedWeekFromPath = weeksRaw.find((week) => {
        if (shouldSkipWeekSegment(week)) {
          return false;
        }

        const weekMeta = weekQueryMetaById?.[week._id];
        if (!weekMeta) {
          return false;
        }

        if (initialWeekIdQueryRef.current) {
          return week._id === initialWeekIdQueryRef.current;
        }

        if (initialWeekSegmentRef.current) {
          const seasonMatches =
            !initialSeasonTypeQueryRef.current ||
            Number(weekMeta.seasonType) === Number(initialSeasonTypeQueryRef.current);
          const legacyWeekNumber = parseWeekSegment(initialWeekSegmentRef.current);

          return (
            seasonMatches &&
            (weekMeta.weekSegment === initialWeekSegmentRef.current ||
              (legacyWeekNumber &&
                Number(weekMeta.week) === Number(legacyWeekNumber)))
          );
        }

        if (initialSeasonTypeQueryRef.current && initialWeekQueryRef.current) {
          return (
            Number(weekMeta.seasonType) === Number(initialSeasonTypeQueryRef.current) &&
            Number(weekMeta.week) === Number(initialWeekQueryRef.current)
          );
        }

        return false;
      });

      await selectWeekAndLoadData({
        weeksRaw,
        leagueId: initialLeagueIdResolved,
        year: last(weeksRaw)?.year ?? initialYearResolved,
        selectedWeek: selectedWeekFromPath,
        gameSlug: initialGameSlugRef.current,
        signal,
        requestEpoch,
      });
    })();

    return undefined;
  }, [
    beginCriteriaChangeRequest,
    initialLeagueId,
    initialYear,
    loadGameWeeks,
    routeBase,
    selectWeekAndLoadData,
  ]);

  const handleFilterLeague = useCallback(
    async (event) => {
      const { signal, requestEpoch } = beginCriteriaChangeRequest();
      const leagueSelected = event.target.value;
      const leagueFound = leagues.find((league) => league.id === leagueSelected);
      if (!leagueFound) return;

      const years = get(leagueFound, "years", []);
      const year = last(years);

      const weeksRaw = await loadGameWeeks({
        leagueId: leagueFound.id,
        year,
        signal,
      });
      if (signal.aborted || requestEpoch !== scoresRequestEpochRef.current) {
        return;
      }

      await selectWeekAndLoadData({
        weeksRaw,
        leagueId: leagueFound.id,
        year,
        gameSlug: null,
        signal,
        requestEpoch,
      });
    },
    [beginCriteriaChangeRequest, loadGameWeeks, selectWeekAndLoadData]
  );

  const handleFilterYear = useCallback(
    async (event) => {
      const { signal, requestEpoch } = beginCriteriaChangeRequest();
      const yearSelected = Number(event.target.value);

      const league = leagues.find((league) => league.id === leagueId);
      const yearFound = league?.years?.find(
        (year) => Number(year) === yearSelected
      );
      if (!Number.isFinite(yearSelected) || !yearFound) return;

      const weeksRaw = await loadGameWeeks({ leagueId, year: yearFound, signal });
      if (signal.aborted || requestEpoch !== scoresRequestEpochRef.current) {
        return;
      }

      await selectWeekAndLoadData({
        weeksRaw,
        leagueId,
        year: yearFound,
        gameSlug: null,
        signal,
        requestEpoch,
      });
    },
    [beginCriteriaChangeRequest, leagueId, loadGameWeeks, selectWeekAndLoadData]
  );

  const handleFilterWeek = useCallback(
    async (event) => {
      const { signal, requestEpoch } = beginCriteriaChangeRequest();
      const weekIndex = event.target.value;
      const currentWeek = weeks[weekIndex];
      if (!currentWeek) return;

      setWeekId(currentWeek._id);
      setBeginDateTime(currentWeek.beginDateTime);
      setEndDateTime(currentWeek.endDateTime);

      if (requestEpoch !== scoresRequestEpochRef.current) {
        return;
      }

      if (!shouldSkipWeekSegment(currentWeek)) {
        syncSelectionToPath({
          routeBase,
          leagueId,
          year,
          selectedWeek: currentWeek,
          weekQueryMetaById: weekQueryMetaByIdRef.current,
          gameSlug: null,
        });
      }

      await onLoadDataRef.current?.({
        weeks: weeksRawRef.current,
        leagueId,
        year,
        weekId: currentWeek._id,
        beginDateTime: currentWeek.beginDateTime,
        endDateTime: currentWeek.endDateTime,
        signal,
        requestEpoch,
      });
    },
    [beginCriteriaChangeRequest, leagueId, routeBase, weeks, year]
  );

  const getActiveScoresRequestSignal = useCallback(
    () => activeScoresRequestRef.current?.signal,
    []
  );

  const getActiveScoresRequestEpoch = useCallback(
    () => scoresRequestEpochRef.current,
    []
  );

  return {
    weeks,
    leagueId,
    year,
    weekId,
    beginDateTime,
    endDateTime,
    getActiveScoresRequestSignal,
    getActiveScoresRequestEpoch,

    handleFilterLeague,
    handleFilterYear,
    handleFilterWeek,
  };
};

export default useLeagueWeekNavigation;
