const CompetitorHeader = (props) => {
  const { game, competitor, spreadMode } = props;

  console.log('competitor', competitor);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "2rem", width: "100%" }}>
      {/* Left: Conference */}
      <div style={{ textAlign: "left", flex: 1 }}>
        {competitor?.conference && (
          <div
            style={{
              fontSize: "17px",
              width: "100%",
              height: "2rem",
            }}
          >
            <div
              style={{
                padding: "5px",
                fontWeight: "bold",
                color: "#ffffff",
                backgroundColor:
                  competitor?.conference === "AFC"
                    ? "#FF3344"
                    : "#004C99",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              {competitor?.conference}
            </div>
          </div>
        )}
      </div>
      {/* Right: Spread */}
      <div style={{ textAlign: "right", flex: 1 }}>
        {spreadMode && game?.spread?.teamId === competitor._id && (
          <div
            style={{
              fontSize: "17px",
              width: "100%",
              height: "2rem",
            }}
          >
            <div
              style={{
                padding: "5px",
                fontWeight: "bold",
                backgroundColor: "#FCE385",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              {game?.spread?.amount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorHeader;
