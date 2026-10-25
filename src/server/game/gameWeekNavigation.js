const moment = require('moment-timezone');

const SEASON_TYPE_TO_SEGMENT = {
  1: 'preseason',
  2: 'regular',
  3: 'playoffs',
};

const ENTIRE_SEASON_WEEK_SEGMENT = 'entire-season';

const slugify = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'game';

const PLAYOFF_WEEK_SEGMENT_RULES = [
  { pattern: /super\s*bowl/i, segment: 'super-bowl' },
  { pattern: /conference/i, segment: 'conference-championship' },
  { pattern: /divisional/i, segment: 'divisional-round' },
  { pattern: /wild\s*card/i, segment: 'wild-card' },
  { pattern: /hall\s*of\s*fame/i, segment: 'hall-of-fame' },
];

const inferSeasonType = (week = {}) => {
  const description = String(week.description || '').toLowerCase();

  if (
    description.includes('preseason') ||
    description.includes('hall of fame') ||
    /pre\s*season/.test(description)
  ) {
    return 1;
  }

  if (
    description.includes('playoff') ||
    description.includes('wild card') ||
    description.includes('divisional') ||
    description.includes('conference') ||
    description.includes('super bowl') ||
    description.includes('final')
  ) {
    return 3;
  }

  return 2;
};

const isEntireSeasonWeek = (week = {}) => {
  const labelCandidates = [week.displayName, week.description, week.name]
    .map((value) => String(value || '').trim().toLowerCase())
    .filter(Boolean);

  return labelCandidates.some((label) => label.startsWith('entire'));
};

const shouldSkipWeekSegment = (selectedWeek = {}) => {
  const labelCandidates = [selectedWeek.displayName, selectedWeek.description, selectedWeek.name]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return labelCandidates.some((label) =>
    /^week\s+\d+\s*-\s*\d+\b/i.test(label.toLowerCase())
  );
};

const getWeekLabelSources = (week = {}) =>
  [week.description, week.name, week.displayName]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

const buildWeekSegmentFromWeek = (week = {}, { weekNumber } = {}) => {
  const sources = getWeekLabelSources(week);

  for (const source of sources) {
    for (const { pattern, segment } of PLAYOFF_WEEK_SEGMENT_RULES) {
      if (pattern.test(source)) {
        return segment;
      }
    }

    const weekMatch = /week\s+(\d+)/i.exec(source);
    if (weekMatch) {
      return `week-${weekMatch[1]}`;
    }
  }

  const primary = sources[0]?.split(/\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/i)[0] || '';
  const fallback = slugify(primary);
  if (fallback && fallback !== 'game') {
    return fallback;
  }

  return weekNumber ? `week-${weekNumber}` : 'week';
};

const buildWeekQueryMetaMap = (weeks = []) => {
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

  const sortedWeeks = [...weeks]
    .sort(
      (a, b) =>
        new Date(a.beginDateTime || 0).getTime() - new Date(b.beginDateTime || 0).getTime()
    )
    .filter(
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

const getNavigableWeeks = (weeks = []) =>
  [...weeks]
    .filter(
      (week) =>
        !week?.isRollup && !shouldSkipWeekSegment(week) && !isEntireSeasonWeek(week)
    )
    .sort((a, b) => new Date(a.beginDateTime) - new Date(b.beginDateTime));

const findNavigableWeekForGame = (game, gameWeeks = []) => {
  const start = new Date(game.startDateTime).getTime();

  return getNavigableWeeks(gameWeeks).find((week) => {
    const begin = new Date(week.beginDateTime).getTime();
    const end = new Date(week.endDateTime).getTime();
    return start >= begin && start <= end;
  });
};

const findEntireSeasonWeek = (gameWeeks = []) =>
  (gameWeeks || []).find((week) => week?._id && !week?.isRollup && isEntireSeasonWeek(week));

const findGameWeekForEspnWeek = (gameWeeks = [], { seasonType, weekNumber } = {}) => {
  if (!seasonType || !weekNumber) {
    return null;
  }

  const weekMetaById = buildWeekQueryMetaMap(gameWeeks);

  return (
    getNavigableWeeks(gameWeeks).find((week) => {
      const meta = weekMetaById[String(week._id)];
      return meta?.seasonType === seasonType && meta?.week === weekNumber;
    }) || null
  );
};

const findCurrentWeek = (weeks = []) => {
  const sorted = getNavigableWeeks(weeks);
  const now = moment().tz('America/New_York');

  return (
    sorted.find((week) => {
      if (!week?.beginDateTime || !week?.endDateTime) {
        return false;
      }

      const begin = moment(week.beginDateTime).tz('America/New_York');
      const end = moment(week.endDateTime).tz('America/New_York');
      return now.isSameOrAfter(begin) && now.isSameOrBefore(end);
    }) || null
  );
};

const findPriorWeek = (weeks = []) => {
  const sorted = getNavigableWeeks(weeks);
  const now = moment().tz('America/New_York');

  const completed = sorted.filter(
    (week) =>
      week?.endDateTime &&
      moment(week.endDateTime).tz('America/New_York').isBefore(now)
  );

  return completed.length ? completed[completed.length - 1] : null;
};

const isWednesdayInTimezone = ({ timezone, dateValue = new Date() }) =>
  moment(dateValue).tz(timezone).day() === 3;

const resolveLeaderboardNotificationWeek = ({
  referenceGame,
  gameWeeks = [],
  timezone,
  dateValue = new Date(),
}) => {
  const weekQueryMetaById = buildWeekQueryMetaMap(gameWeeks);
  const useEntireSeason = isWednesdayInTimezone({ timezone, dateValue });

  const week = useEntireSeason
    ? findEntireSeasonWeek(gameWeeks)
    : findNavigableWeekForGame(referenceGame, gameWeeks);

  return { week, weekQueryMetaById, useEntireSeason };
};

const buildLeaderboardPath = ({ leagueName, year, week, weekQueryMetaById = {} }) => {
  if (!leagueName || !year || !week?._id) {
    return `/leaders/${leagueName || 'nfl'}`;
  }

  const meta = weekQueryMetaById[String(week._id)] || {};
  const parts = [`/leaders/${leagueName}`, String(year)];

  const seasonSegment = SEASON_TYPE_TO_SEGMENT[Number(meta.seasonType)];
  if (seasonSegment) {
    parts.push(seasonSegment);
  }

  if (meta.weekSegment) {
    parts.push(meta.weekSegment);
  }

  return parts.join('/');
};

module.exports = {
  ENTIRE_SEASON_WEEK_SEGMENT,
  buildLeaderboardPath,
  buildWeekQueryMetaMap,
  findCurrentWeek,
  findEntireSeasonWeek,
  findGameWeekForEspnWeek,
  findNavigableWeekForGame,
  findPriorWeek,
  getNavigableWeeks,
  inferSeasonType,
  isEntireSeasonWeek,
  isWednesdayInTimezone,
  resolveLeaderboardNotificationWeek,
  shouldSkipWeekSegment,
};
