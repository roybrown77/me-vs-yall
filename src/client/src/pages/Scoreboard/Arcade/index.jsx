import { useState } from "react";

import { getLeagueName } from "../../../utilities/getLeagueName";

import useArcadeSpinePath from "./useArcadeSpinePath";
import NflArcadeBackground from "./NflArcadeBackground";
import ArcadeBaseStyles from "./ArcadeBaseStyles";
import ArcadeHeader from "./ArcadeHeader";
import ArcadeGameTimeline from "./ArcadeGameTimeline";

const ArcadeScoreboard = ({ games = [], controls, onArcadeModeChange }) => {
  const [controlsOpen, setControlsOpen] = useState(false);
  const displayGames = Array.isArray(games) ? games : [];
  const isSingleGame = displayGames.length === 1;

  const leagueName = (getLeagueName?.() || "").toLowerCase();
  const isNFLSelected = leagueName === "nfl";

  const { listRef, nodeRefs, spinePathD } = useArcadeSpinePath({
    itemCount: displayGames.length,
    controlsOpen,
  });

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: "56px",
        bottom: 0,
        zIndex: 98,
        backgroundColor: "#B3E6CA",
        fontFamily: "monospace",
        overflowY: "auto",
        paddingBottom: "90px",
      }}
    >
      <ArcadeBaseStyles />

      <NflArcadeBackground enabled={isNFLSelected} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <ArcadeHeader
          controlsOpen={controlsOpen}
          onControlsToggle={() => setControlsOpen((x) => !x)}
          onExitArcadeMode={() => onArcadeModeChange?.(false)}
          controls={controls}
        />

        <ArcadeGameTimeline
          displayGames={displayGames}
          isSingleGame={isSingleGame}
          listRef={listRef}
          nodeRefs={nodeRefs}
          spinePathD={spinePathD}
        />
      </div>
    </div>
  );
};

export default ArcadeScoreboard;
