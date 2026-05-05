import PumpUpMusic from "../../../components/PumpUpMusic";

const ArcadeHeader = ({
  controlsOpen,
  onControlsToggle,
  onExitArcadeMode,
  controls,
  soundEnabled = true,
  onSoundChange,
}) => {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={onControlsToggle}
            aria-expanded={controlsOpen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 10px",
              borderRadius: "12px",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            Controls {controlsOpen ? "▴" : "▾"}
          </button>

          <button
            type="button"
            onClick={onExitArcadeMode}
            aria-label="Exit Arcade Mode"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 10px",
              borderRadius: "12px",
              background: "dodgerblue",
              border: "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
              color: "#000",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            Arcade Mode ON
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <PumpUpMusic
            enabled={soundEnabled}
            onEnabledChange={onSoundChange}
            autoStartOnFirstGesture={soundEnabled}
          />
        </div>
      </div>

      {controlsOpen && (
        <div
          style={{
            padding: "0 12px 12px 12px",
            maxHeight: "70vh",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {controls}
        </div>
      )}
    </div>
  );
};

export default ArcadeHeader;
