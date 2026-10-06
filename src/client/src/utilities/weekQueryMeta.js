import { buildWeekSegmentFromWeek } from "./navigationPaths";

export const ENTIRE_SEASON_WEEK_SEGMENT = "entire-season";

export const isEntireSeasonWeek = (week = {}) => {
  const labelCandidates = [
    week.displayName,
    week.description,
    week.name,
  ]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);

  return labelCandidates.some((label) => label.startsWith("entire"));
};

export const inferSeasonType = (week = {}) => {
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

export const shouldSkipWeekSegment = (selectedWeek = {}) => {
  const labelCandidates = [
    selectedWeek.displayName,
    selectedWeek.description,
    selectedWeek.name,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return labelCandidates.some((label) =>
    /^week\s+\d+\s*-\s*\d+\b/i.test(label.toLowerCase())
  );
};

const sortWeeksForNumbering = (weeks = []) => {
  return [...weeks].sort((a, b) => {
    const aTime = new Date(a.beginDateTime || 0).getTime();
    const bTime = new Date(b.beginDateTime || 0).getTime();
    return aTime - bTime;
  });
};

export const buildWeekQueryMetaMap = (weeks = []) => {
  const weekMetaById = {};

  (weeks || []).forEach((week) => {
    if (!week?._id || week?.isRollup || !isEntireSeasonWeek(week)) {
      return;
    }

    weekMetaById[String(week._id)] = {
      seasonType: inferSeasonType(week),
      week: null,
      weekSegment: ENTIRE_SEASON_WEEK_SEGMENT,
    };
  });

  const sortedWeeks = sortWeeksForNumbering(weeks).filter(
    (week) =>
      !week?.isRollup && !shouldSkipWeekSegment(week) && !isEntireSeasonWeek(week)
  );
  const countersBySeasonType = { 1: 0, 2: 0, 3: 0 };
  const usedSegmentsBySeasonType = { 1: new Set(), 2: new Set(), 3: new Set() };

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

    weekMetaById[String(week._id)] = {
      seasonType,
      week: weekNumber,
      weekSegment,
    };
  });

  return weekMetaById;
};

export const getWeekSegmentForWeek = (week, weekQueryMetaById = {}) => {
  if (!week?._id) {
    return null;
  }

  const weekMeta = weekQueryMetaById[String(week._id)];
  if (weekMeta?.weekSegment) {
    return weekMeta.weekSegment;
  }

  if (shouldSkipWeekSegment(week)) {
    return null;
  }

  return buildWeekSegmentFromWeek(week, { weekNumber: weekMeta?.week });
};
