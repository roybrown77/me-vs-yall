import PropTypes from "prop-types";

import IconButton from "@mui/material/IconButton";

import ToggleOn from "@mui/icons-material/ToggleOn";
import ToggleOff from "@mui/icons-material/ToggleOff";

import styles from "../styles";

const ArcadeModeToggle = ({ isArcadeMode, onArcadeModeOn, onArcadeModeOff }) => (
  <div
    style={{
      marginTop: "25px",
      padding: "10px",
      backgroundColor: "#fff",
      marginLeft: "auto",
      width: "fit-content",
    }}
  >
    <div style={{ fontSize: "9px", fontWeight: 700 }}>
      {isArcadeMode ? "Classic Mode" : "Arcade Mode"}
    </div>
    <div style={{ marginTop: "6px" }}>
      <IconButton
        style={isArcadeMode ? styles.toggleButtonOn : styles.toggleButtonOff}
        aria-label="toggle arcade mode"
      >
        {isArcadeMode ? (
          <ToggleOn onClick={onArcadeModeOff} />
        ) : (
          <ToggleOff onClick={onArcadeModeOn} />
        )}
      </IconButton>
    </div>
  </div>
);

ArcadeModeToggle.propTypes = {
  isArcadeMode: PropTypes.bool.isRequired,
  onArcadeModeOn: PropTypes.func.isRequired,
  onArcadeModeOff: PropTypes.func.isRequired,
};

export default ArcadeModeToggle;
