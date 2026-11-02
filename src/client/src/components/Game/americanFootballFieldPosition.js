export const FIELD_LEFT_GOAL_X = 39;
export const FIELD_RIGHT_GOAL_X = 333;
export const FIELD_PLAYABLE_WIDTH = FIELD_RIGHT_GOAL_X - FIELD_LEFT_GOAL_X;

const normalizeToken = (value) => String(value || "").trim().toUpperCase();

const teamTokens = (competitor = {}) => {
  const tokens = [
    competitor.shortLocation,
    competitor.alternateName,
    competitor.name,
  ]
    .map(normalizeToken)
    .filter(Boolean);

  return [...new Set(tokens)];
};

export const matchCompetitorSide = (competitors = [], token) => {
  const needle = normalizeToken(token);
  if (!needle || needle === "N/A") {
    return null;
  }

  for (let index = 0; index < competitors.length; index += 1) {
    const side = index === 0 ? "away" : "home";
    const tokens = teamTokens(competitors[index]);
    if (tokens.some((entry) => entry === needle || entry.startsWith(needle) || needle.startsWith(entry))) {
      return side;
    }
  }

  return null;
};

export const parseSpotFromDown = (downText = "") => {
  const down = String(downText).trim();
  if (!down || down === "N/A") {
    return null;
  }

  const legacyMatch = down.match(/^Down:\s*(.*?)\s*-\s*Poss:/is);
  const source = legacyMatch ? legacyMatch[1].trim() : down;

  if (/\bat\s+50\b/i.test(source)) {
    return { midfield: true, yardLine: 50, teamToken: null };
  }

  const spotMatch = source.match(/\bat\s+([A-Za-z0-9]{2,5})\s+(Goal|\d{1,2})\b/i);
  if (!spotMatch) {
    return null;
  }

  const yardRaw = spotMatch[2];
  const yardLine = /^goal$/i.test(yardRaw) ? 1 : Math.min(50, Math.max(1, parseInt(yardRaw, 10)));

  return {
    midfield: false,
    yardLine,
    teamToken: normalizeToken(spotMatch[1]),
  };
};

export const yardsFromLeftGoalLine = ({ spot, competitors = [] }) => {
  if (!spot) {
    return null;
  }

  if (spot.midfield) {
    return 50;
  }

  const spotSide = matchCompetitorSide(competitors, spot.teamToken);
  if (!spotSide) {
    return null;
  }

  if (spotSide === "away") {
    return spot.yardLine;
  }

  return 100 - spot.yardLine;
};

export const yardLineToFieldX = (yardsFromLeft) => {
  const clamped = Math.min(100, Math.max(0, Number(yardsFromLeft) || 0));
  return FIELD_LEFT_GOAL_X + (clamped / 100) * FIELD_PLAYABLE_WIDTH;
};

export const MIDFIELD_BADGE_OFFSET = 18;
export const RED_ZONE_YARDS = 20;

export const resolveRedZoneSide = ({
  possessionSide,
  yardsFromLeft,
  hasValidSpot = true,
}) => {
  if (!hasValidSpot || yardsFromLeft == null || !possessionSide) {
    return null;
  }
  if (possessionSide === "away" && yardsFromLeft >= 100 - RED_ZONE_YARDS) {
    return "right";
  }
  if (possessionSide === "home" && yardsFromLeft <= RED_ZONE_YARDS) {
    return "left";
  }
  return null;
};

const teamBadgeFromCompetitor = (competitor = {}) => ({
  teamLabel: competitor.shortLocation || competitor.alternateName || "",
  teamColor: competitor.color || "#555555",
});

export const resolveAmericanFootballMidfieldTeams = ({
  game,
  hasGameStarted,
}) => {
  if (!game || game.isGameOver || !hasGameStarted?.(game.startDateTime)) {
    return null;
  }

  const possessionSide = matchCompetitorSide(game.competitors || [], game.possession);
  if (possessionSide) {
    return null;
  }

  const competitors = game.competitors || [];
  if (competitors.length < 2) {
    return null;
  }

  const midX = yardLineToFieldX(50);

  return {
    away: {
      ballX: midX - MIDFIELD_BADGE_OFFSET,
      ...teamBadgeFromCompetitor(competitors[0]),
    },
    home: {
      ballX: midX + MIDFIELD_BADGE_OFFSET,
      ...teamBadgeFromCompetitor(competitors[1]),
    },
  };
};

export const resolveAmericanFootballLiveBall = ({
  game,
  hasGameStarted,
}) => {
  if (!game || game.isGameOver || !hasGameStarted?.(game.startDateTime)) {
    return null;
  }

  const possessionSide = matchCompetitorSide(game.competitors || [], game.possession);
  if (!possessionSide) {
    return null;
  }

  const spot = parseSpotFromDown(game.down);
  const parsedYardsFromLeft = yardsFromLeftGoalLine({ spot, competitors: game.competitors || [] });
  const hasValidSpot = parsedYardsFromLeft != null;
  const yardsFromLeft = hasValidSpot ? parsedYardsFromLeft : 50;
  const redZoneSide = resolveRedZoneSide({
    possessionSide,
    yardsFromLeft,
    hasValidSpot,
  });

  const competitor = game.competitors[possessionSide === "away" ? 0 : 1] || {};

  return {
    ballX: yardLineToFieldX(yardsFromLeft),
    possessionSide,
    yardsFromLeft,
    spot,
    redZoneSide,
    inRedZone: Boolean(redZoneSide),
    ...teamBadgeFromCompetitor(competitor),
  };
};
