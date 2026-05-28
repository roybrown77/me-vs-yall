const CompetitorHeader = (props) => {
  const { game, competitor, spreadMode } = props;
  const showConference = Boolean(competitor?.conference);
  const showSpread = Boolean(spreadMode && game?.spread?.teamId === competitor._id);
  const hasHeaderBadge = showConference || showSpread;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: hasHeaderBadge ? "2rem" : "0.5rem",
        marginBottom: hasHeaderBadge ? "0" : "0.15rem",
        width: "100%",
      }}
    >
      {/* Left: Conference */}
      <div style={{ textAlign: "left", flex: 1 }}>
        {showConference && (
          <div
            style={{
              fontSize: ".7em",
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
        {showSpread && (
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
