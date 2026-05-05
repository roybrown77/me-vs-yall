import { getGameSubtitle, getGameTitle } from "./arcadeGameText";

const ArcadeGameTimeline = ({ displayGames, isSingleGame, listRef, nodeRefs, spinePathD }) => {
  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        position: "relative",
        padding: "12px 12px 18px 12px",
      }}
    >
      <div ref={listRef} style={{ position: "relative" }}>
        {displayGames.length > 1 && spinePathD && (
          <svg
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <path
              d={spinePathD}
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {displayGames.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "28px 0",
              fontWeight: 700,
            }}
          >
            no games
          </div>
        )}

        {displayGames.map((game, index) => {
          const side = isSingleGame ? "center" : index % 2 === 0 ? "left" : "right";
          const isLeft = side === "left";
          const isCenter = side === "center";
          const bobDelay = `${(index % 6) * 0.08}s`;

          return (
            <div
              key={game?._id || index}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isSingleGame ? "36px 0" : "26px 0",
              }}
            >
              {!isCenter && (
                <div
                  style={{
                    position: "absolute",
                    left: isLeft ? "0" : undefined,
                    right: isLeft ? undefined : "0",
                    width: "44%",
                    display: "flex",
                    justifyContent: isLeft ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.85)",
                      boxShadow:
                        "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                      animation: `arcadeBob 1.8s ease-in-out infinite`,
                      animationDelay: bobDelay,
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        fontSize: "28px",
                        lineHeight: 1,
                        animation: `arcadeWiggle 2.6s ease-in-out infinite`,
                        animationDelay: bobDelay,
                      }}
                    />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "32px", fontWeight: 700 }}>
                        {getGameTitle(game)}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 600, opacity: 0.85 }}>
                        {getGameSubtitle(game)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isCenter && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    position: "absolute",
                    top: "-2px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.92)",
                      boxShadow:
                        "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                      animation: `arcadeBob 1.8s ease-in-out infinite`,
                      animationDelay: bobDelay,
                    }}
                  >
                    <div aria-hidden style={{ fontSize: "30px", lineHeight: 1 }}>
                      🎮
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700 }}>
                        {getGameTitle(game)}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 600, opacity: 0.85 }}>
                        {getGameSubtitle(game)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isSingleGame && (
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "999px",
                    background: "#fff",
                    border: "4px solid rgba(0,0,0,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    position: "relative",
                    zIndex: 2,
                  }}
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                >
                  {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArcadeGameTimeline;
