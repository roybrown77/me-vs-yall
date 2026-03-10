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
}) => {
  const [areCarsMoving, setAreCarsMoving] = useState(true);
  const [mapApi, setMapApi] = useState(null);

  const isAuthenticated = isConfirmedAuthentication();

  const allGames = [
    ...(groupedGames?.notCompleted || []),
    ...(groupedGames?.completed || []),
  ];

  return (
    <div>
      {/* Top-left: brand + auth */}
      <div style={{ position: "fixed", top: "12px", left: "12px", zIndex: 7 }}>
        <ArcadeBrandBar />
      </div>

      {/* Top-right: mode toggle */}
      <div style={{ position: "fixed", top: "12px", right: "12px", zIndex: 7 }}>
        <ArcadeModeToggle
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={onArcadeModeOn}
          onArcadeModeOff={onArcadeModeOff}
        />
      </div>

      {/* Bottom-left: filters + games list */}
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
        updatingPick={updatingPick}
        onMakePick={onMakePick}
        mapApi={mapApi}
        isAuthenticated={isAuthenticated}
        getPickOutcome={getPickOutcome}
        areCarsMoving={areCarsMoving}
        onToggleCarsMoving={() => setAreCarsMoving((v) => !v)}
      />

      {/* Full-screen: Leaflet map */}
      <LeafletArcadeMap
        allGames={allGames}
        picks={picks}
        updatingPick={updatingPick}
        onMakePick={onMakePick}
        onApiReady={setMapApi}
        vehiclesMoving={areCarsMoving}
      />
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
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
};

export default ArcadeMode;
