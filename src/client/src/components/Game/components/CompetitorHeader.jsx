import Grid from "@mui/material/Grid";

const CompetitorHeader = (props) => {
  const { game, competitor, spreadMode } = props;

  return (
    <Grid item style={{ minHeight: "2rem", textAlign: "right" }}>
      {
      spreadMode &&
        <div
          style={{
            fontSize: "17px",
            display:
              game?.spread?.teamId === competitor._id ? "block" : "none",
            width: "100%",
            height: "2rem", 
          }}
        >
          <div style={{ padding: "5px", fontWeight: "bold", backgroundColor: "#FCE385", borderRadius: "5px", float: "right" }}>{game?.spread?.amount}</div>
        </div>
      }
    </Grid>
  );
};

export default CompetitorHeader;
