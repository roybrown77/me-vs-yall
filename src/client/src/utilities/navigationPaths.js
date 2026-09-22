const SEASON_TYPE_TO_SEGMENT = {
  1: "preseason",
  2: "regular",
  3: "playoffs",
};

const SEGMENT_TO_SEASON_TYPE = {
  preseason: 1,
  regular: 2,
  playoffs: 3,
};

export const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "game";

export const buildGameSlugFromCompetitors = (game = {}) => {
  const away = slugify(
    game?.competitors?.[0]?.name ||
      game?.competitors?.[0]?.shortLocation ||
      "away"
  );
  const home = slugify(
    game?.competitors?.[1]?.name ||
      game?.competitors?.[1]?.shortLocation ||
      "home"
  );

  return `${away}-vs-${home}`;
};

const getCompetitorDisplayName = (competitor, { short = false } = {}) => {
  if (short) {
    return (
      competitor?.shortLocation ||
      competitor?.name ||
      ""
    );
  }

  return (
    competitor?.name ||
    competitor?.shortLocation ||
    ""
  );
};

export const buildGameLinkLabel = (game = {}) => {
  const away = getCompetitorDisplayName(game?.competitors?.[0], { short: true });
  const home = getCompetitorDisplayName(game?.competitors?.[1], { short: true });

  if (!away || !home) {
    return "View game";
  }

  return `${away} vs ${home}`;
};

export const buildGameHeadingText = (game = {}) => {
  const away = getCompetitorDisplayName(game?.competitors?.[0]);
  const home = getCompetitorDisplayName(game?.competitors?.[1]);

  if (!away || !home) {
    return "Game picks";
  }

  return `${away} vs ${home}`;
};

export const assignGameSlugs = (games = []) => {
  const used = new Set();
  const slugByGameId = {};

  games.forEach((game) => {
    let slug = buildGameSlugFromCompetitors(game);

    if (used.has(slug)) {
      let duplicateIndex = 2;
      while (used.has(`${slug}-${duplicateIndex}`)) {
        duplicateIndex += 1;
      }
      slug = `${slug}-${duplicateIndex}`;
    }

    used.add(slug);
    slugByGameId[game._id] = slug;
  });

  return slugByGameId;
};

export const getSeasonTypeSegment = (seasonType) =>
  SEASON_TYPE_TO_SEGMENT[Number(seasonType)] || null;

export const parseSeasonTypeSegment = (segment) => {
  if (!segment) return null;
  return SEGMENT_TO_SEASON_TYPE[String(segment).toLowerCase()] ?? null;
};

const PLAYOFF_WEEK_SEGMENT_RULES = [
  { pattern: /super\s*bowl/i, segment: "super-bowl" },
  { pattern: /conference/i, segment: "conference-championship" },
  { pattern: /divisional/i, segment: "divisional-round" },
  { pattern: /wild\s*card/i, segment: "wild-card" },
  { pattern: /hall\s*of\s*fame/i, segment: "hall-of-fame" },
];

const getWeekLabelSources = (week = {}) =>
  [week.description, week.name, week.displayName]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

export const buildWeekSegmentFromWeek = (week = {}, { weekNumber } = {}) => {
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

  const primary = sources[0]?.split(/\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/i)[0] || "";
  const fallback = slugify(primary);
  if (fallback && fallback !== "game") {
    return fallback;
  }

  return weekNumber ? `week-${weekNumber}` : "week";
};

export const isGameSlugSegment = (segment) => /-vs-/.test(String(segment || ""));

export const buildWeekSegment = (weekNumber) => `week-${weekNumber}`;

export const parseWeekSegment = (segment) => {
  const match = /^week-(\d+)$/i.exec(String(segment || ""));
  return match ? Number(match[1]) : null;
};

export const SCOREBOARD_VIEW_RANKINGS = "rankings";

export const isRankingsPathSegment = (segment) =>
  String(segment || "").toLowerCase() === SCOREBOARD_VIEW_RANKINGS;

const parseWeekAndGameSegments = (segments = []) => {
  const fourth = segments[3];
  const fifth = segments[4];

  if (!fourth) {
    return { weekSegment: null, gameSlug: null, scoreboardView: null };
  }

  if (isGameSlugSegment(fourth)) {
    return { weekSegment: null, gameSlug: fourth, scoreboardView: null };
  }

  if (isRankingsPathSegment(fourth) && !fifth) {
    return {
      weekSegment: null,
      gameSlug: null,
      scoreboardView: SCOREBOARD_VIEW_RANKINGS,
    };
  }

  if (isRankingsPathSegment(fifth)) {
    return {
      weekSegment: fourth,
      gameSlug: null,
      scoreboardView: SCOREBOARD_VIEW_RANKINGS,
    };
  }

  if (fifth && isGameSlugSegment(fifth)) {
    return { weekSegment: fourth, gameSlug: fifth, scoreboardView: null };
  }

  return { weekSegment: fourth, gameSlug: fifth || null, scoreboardView: null };
};

export const detectRouteBase = (pathname = "") => {
  if (pathname.includes("/leaders/")) {
    return "/leaders/";
  }

  return "/scoreboards/";
};

export const parseNavigationPath = (pathname = "", routeBase = detectRouteBase(pathname)) => {
  const normalizedBase = routeBase.replace(/\/$/, "");
  const normalizedPath = pathname.replace(/\/$/, "");

  if (!normalizedPath.startsWith(normalizedBase)) {
    return {};
  }

  const remainder = normalizedPath.slice(normalizedBase.length);
  const segments = remainder.split("/").filter(Boolean);
  const [leagueName, yearRaw, seasonSegment] = segments;
  const { weekSegment, gameSlug, scoreboardView } = parseWeekAndGameSegments(segments);
  const year = yearRaw ? Number(yearRaw) : null;

  return {
    leagueName,
    year: Number.isFinite(year) ? year : null,
    seasonType: parseSeasonTypeSegment(seasonSegment),
    weekSegment,
    week: parseWeekSegment(weekSegment),
    gameSlug,
    scoreboardView,
  };
};

export const buildNavigationPath = ({
  routeBase,
  leagueName,
  year,
  seasonType,
  weekSegment,
  week,
  scoreboardView,
  gameSlug,
}) => {
  const parts = [routeBase.replace(/\/$/, ""), leagueName].filter(Boolean);

  if (year) {
    parts.push(String(year));
  }

  const seasonSegment = getSeasonTypeSegment(seasonType);
  if (seasonSegment) {
    parts.push(seasonSegment);
  }

  const resolvedWeekSegment =
    weekSegment || (week ? buildWeekSegment(week) : null);

  if (resolvedWeekSegment) {
    parts.push(resolvedWeekSegment);
  }

  if (scoreboardView === SCOREBOARD_VIEW_RANKINGS) {
    parts.push(SCOREBOARD_VIEW_RANKINGS);
  } else if (gameSlug) {
    parts.push(gameSlug);
  }

  return parts.join("/");
};

export const withGameSlug = (pathname, routeBase, gameSlug) =>
  buildNavigationPath({
    routeBase,
    ...parseNavigationPath(pathname, routeBase),
    scoreboardView: null,
    gameSlug,
  });

export const isScoreboardRankingsPath = (
  pathname = "",
  routeBase = "/scoreboards/"
) =>
  parseNavigationPath(pathname, routeBase).scoreboardView ===
  SCOREBOARD_VIEW_RANKINGS;

export const getLeagueNameFromPath = (pathname = window?.location?.pathname) => {
  const parsed =
    parseNavigationPath(pathname, "/scoreboards/").leagueName ||
    parseNavigationPath(pathname, "/leaders/").leagueName;

  return parsed || "nfl";
};

const getFirstQueryParamValue = (searchParams, keys = []) => {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }

  return null;
};

export const getLegacySelectionFromQuery = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const leagueQuery = getFirstQueryParamValue(searchParams, ["league", "leagueId"]);
  const yearQueryRaw = getFirstQueryParamValue(searchParams, ["year", "gameYear"]);
  const seasonTypeQuery = Number(getFirstQueryParamValue(searchParams, ["seasonType"]));
  const weekQueryRaw = getFirstQueryParamValue(searchParams, ["week"]);
  const weekIdQuery = getFirstQueryParamValue(searchParams, ["weekId"]);
  const weekQuery = Number(weekQueryRaw);
  const yearQuery = Number(yearQueryRaw);

  return {
    leagueQuery,
    yearQuery: Number.isFinite(yearQuery) ? yearQuery : null,
    seasonTypeQuery: Number.isFinite(seasonTypeQuery) ? seasonTypeQuery : null,
    weekQuery: Number.isFinite(weekQuery) ? weekQuery : null,
    weekIdQuery,
  };
};
