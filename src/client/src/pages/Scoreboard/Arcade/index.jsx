import { useState } from "react";

import { getLeagueName } from "../../../utilities/getLeagueName";

import useArcadeSpinePath from "./useArcadeSpinePath";
import NflArcadeBackground from "./NflArcadeBackground";
import ArcadeBaseStyles from "./ArcadeBaseStyles";
import ArcadeHeader from "./ArcadeHeader";
import ArcadeGameTimeline from "./ArcadeGameTimeline";

const ArcadeScoreboard = ({
  games = [],
  picks,
  controls,
  headerTop,
  belowControls,
  aboveTimeline,
  onArcadeModeChange,
  soundEnabled = true,
  onSoundChange,
}) => {
  const [controlsOpen, setControlsOpen] = useState(true);
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
          controls={controls}
          headerTop={headerTop}
          belowControls={belowControls}
          soundEnabled={soundEnabled}
          onSoundChange={onSoundChange}
        />

        {!!aboveTimeline && (
          <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 12px" }}>
            {aboveTimeline}
          </div>
        )}

        <ArcadeGameTimeline
          displayGames={displayGames}
          isSingleGame={isSingleGame}
          listRef={listRef}
          nodeRefs={nodeRefs}
          spinePathD={spinePathD}
          picks={picks}
        />
      </div>
    </div>
  );
};

export default ArcadeScoreboard;
