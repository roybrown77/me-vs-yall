import Grid from "@mui/material/Grid";

const CompetitorHeader = (props) => {
  const { game, competitor, spreadMode } = props;

  return (
    <Grid item style={{ minHeight: "20px" }}>
      <div
        style={{
          fontSize: "17px",
          display:
            game?.spread?.teamId === competitor._id ? "block" : "none",
          textAlign: "right",
        }}
      >
        {spreadMode && <span>{game?.spread?.amount}</span>}
      </div>
    </Grid>
  );
};

export default CompetitorHeader;
