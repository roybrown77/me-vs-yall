import { hasGameStarted } from "../../../utilities";
import { getScoreGuessLabel } from "../../../utilities/scoreGuess";

const isAllEmojis = (input) => {
  // Define regex pattern for emojis
  const emojiPattern = 
    /^(?:[\u203C-\u3299\uD83C\uD83D\uD83E][\u0020-\uFE0F]*|[\uD83C-\uDBFF][\uDC00-\uDFFF])+$/;

  // Test if the input matches the pattern
  return emojiPattern.test(input);
};

const getFontSize = (game) => {
  if (isAllEmojis(game.gameName) && game.leagueId.toLowerCase() === "59723313734d1d6202a85f10") return "2rem"; // 32px
  return "1rem"; // 16px
};

const GameFooter = (props) => {
  const {
    game,
    isAuthenticated,
    userId,
    pick,
  } = props;

  const scoreGuessLabel = getScoreGuessLabel(pick, game);

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
      {(userId !== "google-oauth2|114172296334563495985" ||
        !isAuthenticated) && (
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
      {hasGameStarted(game.startDateTime) && !game?.isGameOver && (
        <div>
          {game.possession} {game.down}
        </div>
      )}
      {scoreGuessLabel && <div style={{ marginTop: "5px" }}>{scoreGuessLabel}</div>}
    </div>
  );
};

export default GameFooter;
