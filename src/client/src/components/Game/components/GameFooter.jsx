import { hasGameStarted } from "../../../utilities";

const FOOTBALL_LEAGUE_IDS = new Set([
  "59723313734d1d6202a85f10",
  "59723313734d1d6202a85f15",
]);

const isAllEmojis = (input) => {
  const emojiPattern =
    /^(?:[\u203C-\u3299\uD83C\uD83D\uD83E][\u0020-\uFE0F]*|[\uD83C-\uDBFF][\uDC00-\uDFFF])+$/;

  return emojiPattern.test(input);
};

const getFontSize = (game) => {
  if (isAllEmojis(game.gameName) && game.leagueId.toLowerCase() === "59723313734d1d6202a85f10")
    return "2rem";
  return "1rem";
};

const normalizeToken = (value) => String(value || "").trim().toUpperCase();

const getPossessionLabel = (game) => {
  const possessionToken = normalizeToken(game.possession);
  if (!possessionToken || possessionToken === "N/A") {
    return "";
  }

  const competitors = game.competitors || [];
  const match = competitors.find((competitor) => {
    const shortLocation = normalizeToken(competitor.shortLocation);
    const alternateName = normalizeToken(competitor.alternateName);
    const name = normalizeToken(competitor.name);

    return (
      possessionToken === shortLocation ||
      possessionToken === alternateName ||
      possessionToken === name
    );
  });

  return match?.shortLocation || match?.alternateName || possessionToken;
};

const getDownDistanceLabel = (game) => {
  const down = String(game.down || "").trim();
  if (!down || down === "N/A") {
    return "";
  }

  const legacyMatch = down.match(
    /^Down:\s*(.*?)\s*-\s*Poss:\s*(.*?)\s*-\s*Last\s*play:\s*(.*)$/is
  );
  if (legacyMatch) {
    return legacyMatch[1]?.trim() || "";
  }

  return down;
};

const getLastPlayLabel = (game) => {
  const fromHistory = game.playHistory?.[0]?.lastPlay;
  if (fromHistory) {
    const stripped = String(fromHistory)
      .replace(/^Last Play:\s*/i, "")
      .replace(/^Last play:\s*/i, "")
      .trim();
    return stripped ? `Last Play: ${stripped}` : "";
  }

  const down = String(game.down || "");
  const legacyMatch = down.match(
    /^Down:\s*(.*?)\s*-\s*Poss:\s*(.*?)\s*-\s*Last\s*play:\s*(.*)$/is
  );
  if (legacyMatch) {
    const lastPlay = legacyMatch[3]?.trim();
    if (lastPlay && lastPlay !== "N/A") {
      return `Last Play: ${lastPlay}`;
    }
  }

  return "";
};

const buildLiveSituationLine = (game) => {
  if (!FOOTBALL_LEAGUE_IDS.has(String(game?.leagueId || ""))) {
    const possession = game.possession ? String(game.possession).trim() : "";
    const down = game.down ? String(game.down).trim() : "";
    return [possession, down].filter(Boolean).join(" ");
  }

  return [
    getPossessionLabel(game),
    getDownDistanceLabel(game),
    getLastPlayLabel(game),
  ]
    .filter(Boolean)
    .join(" ");
};

const GameFooter = (props) => {
  const { game } = props;
  const liveSituationLine = buildLiveSituationLine(game);

  return (
    <div
      style={{
        color: "rgba(0, 0, 0, .87)",
        fontSize: "14px",
        marginTop: "5px",
        fontWeight: "bold",
      }}
      className={"game-footer "}
    >
      {game.gameName && (
        <div style={{ marginTop: "5px", fontSize: getFontSize(game) }}>
          {game.gameName}
        </div>
      )}
      {game.startDateTimeDisplay && (
        <div style={{ marginTop: "5px" }}>{game.startDateTimeDisplay}</div>
      )}
      {game?.isGameOver && <div style={{ marginTop: "5px" }}>Final</div>}
      {!game?.isGameOver && hasGameStarted(game.startDateTime) && (
        <div
          className="fast-flash"
          style={{ color: "deeppink", marginTop: "5px" }}
        >
          {game.currentTime || "in progress"}
        </div>
      )}
      {hasGameStarted(game.startDateTime) && !game?.isGameOver && liveSituationLine && (
        <div style={{ marginTop: "5px" }}>{liveSituationLine}</div>
      )}
    </div>
  );
};

export default GameFooter;
