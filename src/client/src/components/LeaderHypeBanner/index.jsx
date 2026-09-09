const styles = {
  banner: {
    margin: "1em",
    maxWidth: "42rem",
    padding: "10px 12px",
    border: "3px solid #0f172a",
    boxShadow: "4px 4px 0 0 #f2c34a",
    backgroundColor: "#fff7e8",
    color: "#0f172a",
    fontFamily: "'Courier New', Courier, monospace",
    fontWeight: "700",
    fontSize: "0.82rem",
    lineHeight: 1.45,
    textAlign: "center",
    letterSpacing: "0.03em",
  },
};

const LeaderHypeBanner = () => (
  <div style={styles.banner} role="status" aria-live="polite">
    Tap a team then watch the drama and leaders emerge after games start and points are put on the board! 🍿
  </div>
);

export default LeaderHypeBanner;
