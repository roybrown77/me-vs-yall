
const WorldFootballGamePlayHistory = (props) => {
  const { game } = props;

  return (
    <div className={"play-history"} style={{
      fontSize: "1rem",
      fontWeight: "bold",
      color: "rgba(0,0,0,.87)",
    }}>
      {(game.playHistory || []).map((play, playIndex) => (
        <div key={playIndex} style={{ margin: "4px 0", display: "flex" }}>
          <div
            style={{
              minWidth: "40px",
              padding: "4px",
              backgroundColor: play.color,
              marginRight: "4px",
              color: "#fff",
            }}
          >
            {play.shortLocation}
          </div>
          <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
        </div>
      ))}
    </div>
  );
};

export default WorldFootballGamePlayHistory;