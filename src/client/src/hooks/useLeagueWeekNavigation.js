import { useCallback, useEffect, useRef, useState } from "react";
import get from "lodash/get";
import last from "lodash/last";

import { formatWeeks, leagues } from "../utilities";
import { fetchGameWeeks } from "../utilities/gameWeeks";

const getFirstQueryParamValue = (searchParams, keys = []) => {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }

  return null;
};

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
  const sortedWeeks = sortWeeksForNumbering(weeks);
  const countersBySeasonType = { 1: 0, 2: 0, 3: 0 };
  const weekMetaById = {};

  sortedWeeks.forEach((week) => {
    const seasonType = inferSeasonType(week);
    countersBySeasonType[seasonType] = (countersBySeasonType[seasonType] || 0) + 1;

    weekMetaById[week._id] = {
      seasonType,
      week: countersBySeasonType[seasonType],
    };
  });

  return weekMetaById;
};

const getInitialSelectionFromQuery = ({ initialLeagueId, initialYear }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const leagueQuery = getFirstQueryParamValue(searchParams, ["league", "leagueId"]);
  const yearQueryRaw = getFirstQueryParamValue(searchParams, ["year", "gameYear"]);
  const seasonTypeQuery = Number(getFirstQueryParamValue(searchParams, ["seasonType"]));
  const weekQueryRaw = getFirstQueryParamValue(searchParams, ["week"]);
  const weekIdQuery = getFirstQueryParamValue(searchParams, ["weekId"]);
  const weekQuery = Number(weekQueryRaw);
  const yearQuery = Number(yearQueryRaw);

  const leagueFromQuery = leagues.find((league) => {
    if (!leagueQuery) return false;
    return (
      league.id === leagueQuery ||
      league.name.toLowerCase() === leagueQuery.toLowerCase()
    );
  });

  const selectedLeague =
    leagueFromQuery || leagues.find((league) => league.id === initialLeagueId) || leagues[0];
  const fallbackYear = last(selectedLeague?.years) || initialYear;

  const selectedYear = selectedLeague?.years?.includes(yearQuery)
    ? yearQuery
    : fallbackYear;

  return {
    leagueId: selectedLeague?.id,
    year: selectedYear,
    seasonTypeQuery,
    weekQuery,
    weekIdQuery,
  };
};

const syncSelectionToQueryParams = ({ leagueId, year, selectedWeek, weekQueryMetaById }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const league = leagues.find((x) => x.id === leagueId);
  const selectedWeekId = selectedWeek?._id;
  const weekMeta = selectedWeekId ? weekQueryMetaById?.[selectedWeekId] : null;

  if (league?.name) {
    searchParams.set("league", league.name);
  }

  if (year) {
    searchParams.set("year", String(year));
  }

  if (weekMeta?.seasonType) {
    searchParams.set("seasonType", String(weekMeta.seasonType));
  } else {
    searchParams.delete("seasonType");
  }

  if (weekMeta?.week) {
    searchParams.set("week", String(weekMeta.week));
  } else {
    searchParams.delete("week");
  }

  // Migrate from old id-style query params to ESPN-style query params.
  searchParams.delete("weekId");

  const query = searchParams.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", nextUrl);
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
  const initialWeekIdQueryRef = useRef(null);
  const initialSeasonTypeQueryRef = useRef(null);

  useEffect(() => {
    gameWeeksQueryExtrasRef.current = gameWeeksQueryExtras;
  }, [gameWeeksQueryExtras]);

  useEffect(() => {
    onLoadDataRef.current = onLoadData;
  }, [onLoadData]);

  const loadGameWeeks = useCallback(async ({ leagueId: leagueIdToLoad, year: yearToLoad }) => {
    const weeks = await fetchGameWeeks({
      leagueId: leagueIdToLoad,
      year: yearToLoad,
      ...gameWeeksQueryExtrasRef.current,
    });

    return weeks;
  }, []);

  const selectWeekAndLoadData = useCallback(async ({
    weeksRaw,
    leagueId,
    year,
    selectedWeek,
  }) => {
      if (!weeksRaw?.length) return;

      const currentWeek = selectedWeek || last(weeksRaw);
      if (!currentWeek) return;

      weeksRawRef.current = weeksRaw;

      const selectedYear = currentWeek.year ?? year;
      const weekQueryMetaById = buildWeekQueryMetaMap(weeksRaw);

      setWeeks(formatWeeks(weeksRaw));
      setLeagueId(leagueId);
      setYear(selectedYear);
      setWeekId(currentWeek._id);
      setBeginDateTime(currentWeek.beginDateTime);
      setEndDateTime(currentWeek.endDateTime);

      weekQueryMetaByIdRef.current = weekQueryMetaById;

      syncSelectionToQueryParams({
        leagueId,
        year: selectedYear,
        selectedWeek: currentWeek,
        weekQueryMetaById,
      });

      await onLoadDataRef.current?.({
        weeks: weeksRaw,
        leagueId,
        year: selectedYear,
        weekId: currentWeek._id,
        beginDateTime: currentWeek.beginDateTime,
        endDateTime: currentWeek.endDateTime,
      });
    }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const {
        leagueId: initialLeagueIdResolved,
        year: initialYearResolved,
        seasonTypeQuery,
        weekQuery,
        weekIdQuery,
      } = getInitialSelectionFromQuery({
        initialLeagueId,
        initialYear,
      });

      initialWeekQueryRef.current = weekQuery;
      initialWeekIdQueryRef.current = weekIdQuery;
      initialSeasonTypeQueryRef.current = seasonTypeQuery;

      const selectedLeague = leagues.find((league) => league.id === initialLeagueIdResolved);
      if (selectedLeague?.name) {
        window.history.replaceState(
          {},
          "",
          `${routeBase}${selectedLeague.name}${window.location.search || ""}`
        );
      }

      const weeksRaw = await loadGameWeeks({
        leagueId: initialLeagueIdResolved,
        year: initialYearResolved,
      });
      if (cancelled) return;
      if (!weeksRaw) return;

      const weekQueryMetaById = buildWeekQueryMetaMap(weeksRaw);
      weekQueryMetaByIdRef.current = weekQueryMetaById;

      const selectedWeekFromQuery = weeksRaw.find((week) => {
        const weekMeta = weekQueryMetaById?.[week._id];

        if (
          initialSeasonTypeQueryRef.current &&
          initialWeekQueryRef.current &&
          weekMeta
        ) {
          return (
            Number(weekMeta.seasonType) === Number(initialSeasonTypeQueryRef.current) &&
            Number(weekMeta.week) === Number(initialWeekQueryRef.current)
          );
        }

        if (initialWeekIdQueryRef.current) {
          return week._id === initialWeekIdQueryRef.current;
        }

        if (!initialWeekQueryRef.current) return false;

        return (
          Number(week.week) === Number(initialWeekQueryRef.current) ||
          Number(week.number) === Number(initialWeekQueryRef.current)
        );
      });

      await selectWeekAndLoadData({
        weeksRaw,
        leagueId: initialLeagueIdResolved,
        year: last(weeksRaw)?.year ?? initialYearResolved,
        selectedWeek: selectedWeekFromQuery,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [initialLeagueId, initialYear, loadGameWeeks, selectWeekAndLoadData]);

  const handleFilterLeague = useCallback(
    async (event) => {
      const leagueSelected = event.target.value;
      const leagueFound = leagues.find((league) => league.id === leagueSelected);
      if (!leagueFound) return;

      window.history.pushState({}, "", `${routeBase}${leagueFound.name}`);

      const years = get(leagueFound, "years", []);
      const year = last(years);

      const weeksRaw = await loadGameWeeks({ leagueId: leagueFound.id, year });

      await selectWeekAndLoadData({
        weeksRaw,
        leagueId: leagueFound.id,
        year,
      });
    },
    [loadGameWeeks, routeBase, selectWeekAndLoadData]
  );

  const handleFilterYear = useCallback(
    async (event) => {
      const yearSelected = event.target.value;

      const league = leagues.find((league) => league.id === leagueId);
      const yearFound = league?.years?.find((year) => year === yearSelected);
      if (!yearFound) return;

      const weeksRaw = await loadGameWeeks({ leagueId, year: yearFound });
      await selectWeekAndLoadData({
        weeksRaw,
        leagueId,
        year: yearFound,
      });
    },
    [leagueId, loadGameWeeks, selectWeekAndLoadData]
  );

  const handleFilterWeek = useCallback(
    async (event) => {
      const weekIndex = event.target.value;
      const currentWeek = weeks[weekIndex];
      if (!currentWeek) return;

      setWeekId(currentWeek._id);
      setBeginDateTime(currentWeek.beginDateTime);
      setEndDateTime(currentWeek.endDateTime);

      syncSelectionToQueryParams({
        leagueId,
        year,
        selectedWeek: currentWeek,
        weekQueryMetaById: weekQueryMetaByIdRef.current,
      });

      await onLoadDataRef.current?.({
        weeks: weeksRawRef.current,
        leagueId,
        year,
        weekId: currentWeek._id,
        beginDateTime: currentWeek.beginDateTime,
        endDateTime: currentWeek.endDateTime,
      });
    },
    [leagueId, weeks, year]
  );

  return {
    weeks,
    leagueId,
    year,
    weekId,
    beginDateTime,
    endDateTime,

    handleFilterLeague,
    handleFilterYear,
    handleFilterWeek,
  };
};

export default useLeagueWeekNavigation;
