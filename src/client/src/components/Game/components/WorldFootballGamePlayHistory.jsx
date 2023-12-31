
const WorldFootballGamePlayHistory = (props) => {
  const { classes, game } = props;

  return (
    <div className={"play-history " + classes.lastPlay}>
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