import Grid from "@mui/material/Grid";

const CompetitorHeader = (props) => {
  const { game, competitor } = props;

  return (
    <Grid item style={{ minHeight: "32px" }}>
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
