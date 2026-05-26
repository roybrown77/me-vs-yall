import BottomNavigation from "@mui/material/BottomNavigation";

import { getLeagueName } from "../../utilities/getLeagueName";

const styles = {
  root: {
    zIndex: 99,
    position: "fixed",
    bottom: "0",
    backgroundColor: "#f5fffa",
    boxShadow: "none",
    width: "100%",
    color: "#000",
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
  const currentSearch = window?.location?.search || "";

  const navigateWithCurrentQuery = (basePath) => {
    window.location.href = `${basePath}${currentSearch}`;
  };

  const selected = window?.location?.pathname?.includes("scoreboards")
    ? "scoreboards"
    : window?.location?.pathname?.includes("leaders")
    ? "leaders"
    : window?.location?.pathname?.includes("oftheweek")
    ? "oftheweek"
    : "MvY";

  return (
    <BottomNavigation style={styles.root}>
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
          navigateWithCurrentQuery(`/scoreboards/${leagueName}`);
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
          navigateWithCurrentQuery(`/leaders/${leagueName}`);
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
    </BottomNavigation>
  );
};

export default Footer;
