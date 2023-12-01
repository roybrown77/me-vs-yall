
import Button from "@material-ui/core/Button";

const TieButton = (props) => {
  const { classes, game, handleTie } = props;
  return (
    <div>
      <Button
        size="small"
        className={classes.tieButton}
        onClick={() => handleTie(game._id)}
      >
        {[
          "59723313734d1d6202a85f25",
          "59723313734d1d6202a85f27",
          "59723313734d1d6202a85f17",
        ].includes(game?.leagueId)
          ? "Draw"
          : "Tie"}
      </Button>
    </div>
  );
};

export default TieButton;