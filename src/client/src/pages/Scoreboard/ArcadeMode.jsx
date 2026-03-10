import PropTypes from "prop-types";

import IconButton from "@mui/material/IconButton";

import ToggleOn from "@mui/icons-material/ToggleOn";
import ToggleOff from "@mui/icons-material/ToggleOff";

import PageContainer from "../../components/PageContainer";
import styles from "./styles";

export const ArcadeModeToggle = ({ isArcadeMode, onArcadeModeOn, onArcadeModeOff }) => (
  <div
    style={{
      marginTop: "25px",
      padding: "10px",
      backgroundColor: "#fff",
      marginLeft: "auto",
      width: "fit-content",
    }}
  >
    <div style={{ fontSize: "9px", fontWeight: 700 }}>Arcade Mode</div>
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

const ArcadeMode = ({ isArcadeMode, onArcadeModeOn, onArcadeModeOff }) => {
  return (
    <div>
      <PageContainer>
        <ArcadeModeToggle
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={onArcadeModeOn}
          onArcadeModeOff={onArcadeModeOff}
        />
        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "2px",
            fontSize: "clamp(32px, 6vw, 84px)",
          }}
        >
          Under Construction
        </div>
      </PageContainer>
    </div>
  );
};

ArcadeMode.propTypes = {
  isArcadeMode: PropTypes.bool.isRequired,
  onArcadeModeOn: PropTypes.func.isRequired,
  onArcadeModeOff: PropTypes.func.isRequired,
};

export default ArcadeMode;
