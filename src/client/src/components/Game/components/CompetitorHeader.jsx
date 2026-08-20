const CompetitorHeader = (props) => {
  const { game, competitor, spreadMode, slimMode = false, reserveHeaderSpace = false } = props;
  const showConference = Boolean(competitor?.conference) && !slimMode;
  const showSpread = Boolean(spreadMode && game?.spread?.teamId === competitor._id);
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "2rem",
    width: "100%",
  };

  if (!showConference && !showSpread) {
    if (!reserveHeaderSpace) {
      return null;
    }

    return <div style={headerStyle} aria-hidden="true" />;
  }

  return (
    <div style={headerStyle}>
      <div style={{ textAlign: "left", flex: 1 }}>
        {showConference && (
          <span
            style={{
              padding: "5px",
              fontWeight: "bold",
              color: "#ffffff",
              backgroundColor: competitor?.conference === "AFC" ? "#FF3344" : "#004C99",
              borderRadius: "5px",
              display: "inline-block",
              fontSize: ".7em",
            }}
          >
            {competitor?.conference}
          </span>
        )}
      </div>
      <div style={{ textAlign: "right", flex: 1 }}>
        {showSpread && (
          <span
            style={{
              padding: "5px",
              fontWeight: "bold",
              backgroundColor: "#FCE385",
              borderRadius: "5px",
              display: "inline-block",
              fontSize: ".7em",
            }}
          >
            {game?.spread?.amount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CompetitorHeader;
