import { useState } from "react";
import PropTypes from "prop-types";

import { isConfirmedAuthentication } from "../../utilities/authenticationClient";

import ArcadeBrandBar from "./ArcadeMode/ArcadeBrandBar";
import ArcadeHud from "./ArcadeMode/ArcadeHud";
import LeafletArcadeMap from "./ArcadeMode/LeafletArcadeMap";
import ArcadeModeToggle from "./ArcadeMode/ArcadeModeToggle";

import { getPickOutcome } from "./ArcadeMode/arcadePickUtils";

export { default as ArcadeModeToggle } from "./ArcadeMode/ArcadeModeToggle";

const ArcadeMode = ({
  isArcadeMode,
  onArcadeModeOn,
  onArcadeModeOff,
  leagueLabel,
  year,
  weekLabel,
  leagues,
  leagueId,
  weeks,
  weekId,
  dataLoading,
  onFilterLeague,
  onFilterYear,
  onFilterWeek,
  groupedGames,
  picks,
  updatingPick,
  onMakePick,
  leaders,
}) => {
  const [areCarsMoving, setAreCarsMoving] = useState(false);
  const [mapApi, setMapApi] = useState(null);

  const isAuthenticated = isConfirmedAuthentication();

  const allGames = [
    ...(groupedGames?.notCompleted || []),
    ...(groupedGames?.completed || []),
  ];

  const gutter = 12;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Top-left: brand + auth */}
      <div style={{ position: "fixed", top: `${gutter}px`, left: `${gutter}px`, zIndex: 7 }}>
        <ArcadeBrandBar />
      </div>

      {/* Top-right: mode toggle */}
      <div style={{ position: "fixed", top: `${gutter}px`, right: `${gutter}px`, zIndex: 7 }}>
        <ArcadeModeToggle
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={onArcadeModeOn}
          onArcadeModeOff={onArcadeModeOff}
        />
      </div>

      {/* Responsive layout
          All widths: map on top, controls on bottom
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            order: 0,
            flex: "0 0 auto",
            height: "55vh",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <LeafletArcadeMap
            allGames={allGames}
            picks={picks}
            updatingPick={updatingPick}
            onMakePick={onMakePick}
            onApiReady={setMapApi}
            vehiclesMoving={areCarsMoving}
          />
        </div>

        <div
          style={{
            order: 1,
            flex: "1 1 auto",
            width: "100%",
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            pointerEvents: "auto",
            zIndex: 6,
            padding: `${gutter}px`,
            boxSizing: "border-box",
          }}
        >
          <ArcadeHud
            leagueLabel={leagueLabel}
            year={year}
            weekLabel={weekLabel}
            leagues={leagues}
            leagueId={leagueId}
            weeks={weeks}
            weekId={weekId}
            dataLoading={dataLoading}
            onFilterLeague={onFilterLeague}
            onFilterYear={onFilterYear}
            onFilterWeek={onFilterWeek}
            allGames={allGames}
            picks={picks}
            leaders={leaders}
            updatingPick={updatingPick}
            onMakePick={onMakePick}
            mapApi={mapApi}
            isAuthenticated={isAuthenticated}
            getPickOutcome={getPickOutcome}
            areCarsMoving={areCarsMoving}
            onToggleCarsMoving={() => setAreCarsMoving((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
};

ArcadeMode.propTypes = {
  isArcadeMode: PropTypes.bool.isRequired,
  onArcadeModeOn: PropTypes.func.isRequired,
  onArcadeModeOff: PropTypes.func.isRequired,
  leagueLabel: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  weekLabel: PropTypes.string,
  leagues: PropTypes.array,
  leagueId: PropTypes.string,
  weeks: PropTypes.array,
  weekId: PropTypes.string,
  dataLoading: PropTypes.bool,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  groupedGames: PropTypes.shape({
    notCompleted: PropTypes.array,
    completed: PropTypes.array,
  }),
  picks: PropTypes.array,
  leaders: PropTypes.array,
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
};

export default ArcadeMode;
