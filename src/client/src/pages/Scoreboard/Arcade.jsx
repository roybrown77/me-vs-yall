import { useState } from "react";

const ArcadeScoreboard = ({ games = [], controls, onArcadeModeChange }) => {
  const [controlsOpen, setControlsOpen] = useState(false);
  const displayGames = Array.isArray(games) ? games : [];
  const isSingleGame = displayGames.length === 1;

  const getGameTitle = (game) => {
    const away = game?.competitors?.[0]?.name;
    const home = game?.competitors?.[1]?.name;
    if (game?.gameName) return game.gameName;
    if (away && home) return `${away} vs ${home}`;
    return "Game";
  };

  const getGameSubtitle = (game) => {
    const away = game?.competitors?.[0];
    const home = game?.competitors?.[1];
    const awayScore = typeof away?.score === "number" ? away.score : "-";
    const homeScore = typeof home?.score === "number" ? home.score : "-";
    const time = game?.isGameOver ? "FINAL" : (game?.currentTime || game?.gameTime);
    const date = game?.startDateTimeDisplay;
    const scoreLine = away?.name && home?.name ? `${away.name} ${awayScore} - ${homeScore} ${home.name}` : `${awayScore} - ${homeScore}`;
    return [time, date, scoreLine].filter(Boolean).join(" • ");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#B3E6CA",
        fontFamily: "monospace",
        overflowY: "auto",
      }}
    >
      <style>{`
        @keyframes arcadeBob {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes arcadeWiggle {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-2deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

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
          <div style={{ fontWeight: 700 }}>Arcade</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setControlsOpen((x) => !x)}
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
              onClick={() => onArcadeModeChange?.(false)}
              aria-label="Exit Arcade Mode"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 10px",
                borderRadius: "12px",
                background: "#8EB5CC",
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

      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          position: "relative",
          padding: "12px 12px 18px 12px",
        }}
      >
        <div style={{ position: "relative" }}>
          {displayGames.length > 0 && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                top: isSingleGame ? "0px" : "53px",
                bottom: isSingleGame ? undefined : "53px",
                height: isSingleGame ? "63px" : undefined,
                width: "6px",
                transform: "translateX(-50%)",
                borderRadius: "999px",
                background: "rgba(0,0,0,0.12)",
              }}
            />
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
                      >
                        {isLeft ? "🦉" : "🐯"}
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
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArcadeScoreboard;
