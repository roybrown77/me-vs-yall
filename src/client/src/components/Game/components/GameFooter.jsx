import { hasGameStarted } from "../../../utilities";

const GameFooter = (props) => {
  const { classes, game, isAuthenticated, userId } = props;

  return (
    <div
      style={{ marginTop: "10px" }}
      className={"game-footer " + classes.startDateTime}
    >
      {game.gameName && (
        <div style={{ marginTop: "5px", fontSize: "15px" }}>
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
        <div className={classes.startDateTime}>
          {game.possession} {game.down}
        </div>
      )}
    </div>
  );
};

export default GameFooter;
