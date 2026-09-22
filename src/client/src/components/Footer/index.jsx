import { getLeagueName } from "../../utilities/getLeagueName";
import {
  buildNavigationPath,
  detectRouteBase,
  parseNavigationPath,
} from "../../utilities/navigationPaths";

const styles = {
  root: {
    zIndex: 99,
    position: "fixed",
    bottom: "0",
    backgroundColor: "#ffe8a3",
    boxShadow: "none",
    width: "100%",
    color: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  action: {
    fontSize: "15px",
    padding: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
};

const Footer = () => {
  const leagueName = getLeagueName();
  const currentPath = window?.location?.pathname || "";
  const currentRouteBase = detectRouteBase(currentPath);
  const navigationState = parseNavigationPath(currentPath, currentRouteBase);

  const navigateWithCurrentNavigation = (targetRouteBase) => {
    const isLeavingScores =
      currentRouteBase === "/scoreboards/" && targetRouteBase !== "/scoreboards/";

    window.location.href = buildNavigationPath({
      routeBase: targetRouteBase,
      leagueName: navigationState.leagueName || leagueName,
      year: navigationState.year,
      seasonType: navigationState.seasonType,
      weekSegment: navigationState.weekSegment,
      gameSlug: isLeavingScores ? null : navigationState.gameSlug,
    });
  };

  const selected = window?.location?.pathname?.includes("scoreboards")
    ? "scoreboards"
    : window?.location?.pathname?.includes("leaders")
    ? "leaders"
    : window?.location?.pathname?.includes("oftheweek")
    ? "oftheweek"
    : "MvY";

  return (
    <nav style={styles.root} aria-label="Main navigation">
      <div
        style={styles.action}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        MvY
      </div>
      <div
        style={{
          ...styles.action,
          borderBottom: selected === "scoreboards" ? "7px solid #1e90ff" : "",
        }}
        onClick={() => {
          navigateWithCurrentNavigation("/scoreboards/");
        }}
      >
        Scores
      </div>
      <div
        style={{
          ...styles.action,
          borderBottom: selected === "leaders" ? "7px solid #1e90ff" : "",
        }}
        onClick={() => {
          navigateWithCurrentNavigation("/leaders/");
        }}
      >
        Leaders
      </div>
      <div
        style={{
          ...styles.action,
          borderBottom: selected === "oftheweek" ? "7px solid #1e90ff" : "",
        }}
        onClick={() => {
          window.location.href = "/oftheweek";
        }}
      >
        OTW
      </div>
    </nav>
  );
};

export default Footer;
