
import Button from "@mui/material/Button";

const TieButton = (props) => {
  const { game, handleTie } = props;
  return (
    <div>
      <Button
        size="small"
        style={{
          fontWeight: "700",
          marginTop: "10px",
          width: "25%",
          backgroundColor: "#3772FA",
          color: "#FFFFFF",
          borderColor: "#3772FA",
          "&:hover": {
            backgroundColor: "#3772FA",
            color: "#FFFFFF",
            borderColor: "#3772FA",
          },
        }}
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