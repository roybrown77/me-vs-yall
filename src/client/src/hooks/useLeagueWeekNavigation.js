import { useCallback, useEffect, useRef, useState } from "react";
import get from "lodash/get";
import last from "lodash/last";
import { createBrowserHistory } from "history";

import { formatWeeks, leagues } from "../utilities";
import { fetchGameWeeks } from "../utilities/gameWeeks";

const history = createBrowserHistory({ forceRefresh: false });

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

      setWeeks(formatWeeks(weeksRaw));
      setLeagueId(leagueId);
      setYear(selectedYear);
      setWeekId(currentWeek._id);
      setBeginDateTime(currentWeek.beginDateTime);
      setEndDateTime(currentWeek.endDateTime);

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
      const weeksRaw = await loadGameWeeks({ leagueId: initialLeagueId, year: initialYear });
      if (cancelled) return;
      if (!weeksRaw) return;

      await selectWeekAndLoadData({
        weeksRaw,
        leagueId: initialLeagueId,
        year: last(weeksRaw)?.year ?? initialYear,
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

      history.push(`${routeBase}${leagueFound.name}${window.location.search || ""}`);

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
