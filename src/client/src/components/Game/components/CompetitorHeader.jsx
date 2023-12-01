import Grid from "@material-ui/core/Grid";
import classNames from "classnames";

const CompetitorHeader = (props) => {
  const { classes, game, competitor } = props;

  return (
    <Grid item className={classNames(classes.competitorHeader)}>
      <div
        style={{
          fontSize: "17px",
          display:
            game?.spread?.teamId === competitor._id ? "block" : "none",
          textAlign: "right",
        }}
      >
        {game?.spread?.amount}
      </div>
    </Grid>
  );
};

export default CompetitorHeader;
