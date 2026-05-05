import { useCallback, useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { getLeagueName } from "../../utilities/getLeagueName";

const ArcadeScoreboard = ({ games = [], controls, onArcadeModeChange }) => {
  const [controlsOpen, setControlsOpen] = useState(false);
  const displayGames = Array.isArray(games) ? games : [];
  const isSingleGame = displayGames.length === 1;

  const leagueName = (getLeagueName?.() || "").toLowerCase();
  const isNFLSelected = leagueName === "nfl";

  const nflBackgroundSprites = useMemo(() => {
    if (!isNFLSelected) return [];

    const kinds = ["pass", "td", "fg"];
    const count = 24;
    return Array.from({ length: count }).map((_, i) => {
      const kind = kinds[i % kinds.length];
      const left = Math.random() * 100;
      const top = 8 + Math.random() * 90; // avoid very top a bit
      const scale = 0.9 + Math.random() * 0.8;
      const opacity = 0.12 + Math.random() * 0.2;
      const delay = -(Math.random() * 2.5);
      const durationJitter = 0.85 + Math.random() * 0.6;

      return {
        id: `${kind}-${i}`,
        kind,
        left,
        top,
        scale,
        opacity,
        delay,
        durationJitter,
      };
    });
  }, [isNFLSelected]);

  const collapseGameName = (name) => {
    if (typeof name !== "string") return name;
    const trimmed = name.trim();
    if (!trimmed) return trimmed;

    if (trimmed.length <= 3) return trimmed;

    const words = trimmed.split(/\s+/).filter(Boolean);
    const maxWords = 3;
    const collapsed = words.slice(0, maxWords).join(" ");
    return words.length > maxWords ? `${collapsed}…` : collapsed;
  };

  const listRef = useRef(null);
  const nodeRefs = useRef([]);
  const [spinePathD, setSpinePathD] = useState("");

  const getGameTitle = (game) => {
    const away = game?.competitors?.[0]?.name;
    const home = game?.competitors?.[1]?.name;
    if (game?.gameName) return collapseGameName(game.gameName);
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

  const computeSpinePath = useCallback(() => {
    const listEl = listRef.current;
    if (!listEl) {
      setSpinePathD("");
      return;
    }

    const listRect = listEl.getBoundingClientRect();
    const points = nodeRefs.current
      .filter(Boolean)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - listRect.left + r.width / 2,
          y: r.top - listRect.top + r.height / 2,
        };
      })
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

    if (points.length < 2) {
      setSpinePathD("");
      return;
    }

    const totalHeight = listRect.height || 1;
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i += 1) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const yMid = (p0.y + p1.y) / 2;
      const progress = Math.max(0, Math.min(1, yMid / totalHeight));

      // More winding as you scroll down: amplitude increases with progress.
      const baseAmplitudePx = 14;
      const extraAmplitudePx = 54;
      const amplitude = baseAmplitudePx + extraAmplitudePx * progress;
      const direction = i % 2 === 0 ? -1 : 1;
      const dx = direction * amplitude;

      d += ` C ${p0.x + dx} ${yMid}, ${p1.x + dx} ${yMid}, ${p1.x} ${p1.y}`;
    }

    setSpinePathD(d);
  }, []);

  useLayoutEffect(() => {
    nodeRefs.current.length = displayGames.length;
    computeSpinePath();
  }, [computeSpinePath, displayGames.length, controlsOpen]);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => computeSpinePath());
    observer.observe(listEl);
    return () => observer.disconnect();
  }, [computeSpinePath]);

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

        @keyframes nflPassBall {
          0% { transform: translateX(0px); opacity: 0; }
          4% { transform: translateX(0px); opacity: 1; }
          78% { transform: translateX(26px); opacity: 1; }
          82% { transform: translateX(26px); opacity: 0; }
          100% { transform: translateX(0px); opacity: 0; }
        }
        @keyframes nflLegs {
          0% { transform: rotate(22deg); }
          50% { transform: rotate(-22deg); }
          100% { transform: rotate(22deg); }
        }
        @keyframes nflHurdleTD {
          0% { transform: translate(36px, 0px); }
          38% { transform: translate(24px, 0px); }
          52% { transform: translate(18px, -7px); }
          68% { transform: translate(12px, 0px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes nflKickBall {
          0% { transform: translate(10px, 12px); }
          40% { transform: translate(24px, 4px); }
          75% { transform: translate(34px, 2px); }
          100% { transform: translate(40px, 5px); }
        }
        @keyframes nflKickLeg {
          0% { transform: rotate(25deg); }
          40% { transform: rotate(-35deg); }
          100% { transform: rotate(25deg); }
        }

        .nflBg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          user-select: none;
          overflow: hidden;
          z-index: 0;
        }
        .nflSprite {
          position: absolute;
          width: 44px;
          height: 18px;
          filter: grayscale(1);
        }
        .nflScene {
          width: 44px;
          height: 18px;
          position: relative;
        }
        .nflPx {
          position: absolute;
          background: rgba(0, 0, 0, 0.55);
          box-sizing: border-box;
          border-radius: 1px;
        }
        .nflHead { width: 4px; height: 4px; }
        .nflBody { width: 2px; height: 7px; }
        .nflArm { width: 6px; height: 2px; }
        .nflLeg {
          width: 7px;
          height: 2px;
          transform-origin: 1px 1px;
          animation: nflLegs 0.55s ease-in-out infinite;
        }
        .nflLeg.b { animation-delay: 0.275s; }
        .nflGround {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2px;
          height: 2px;
          background: rgba(0, 0, 0, 0.14);
          border-radius: 2px;
        }
        .nflBall {
          width: 3px;
          height: 3px;
        }
        .nflBall.pass {
          animation: nflPassBall 1.25s ease-in-out infinite;
        }
        .nflBall.kick {
          animation: nflKickBall 1.15s ease-in-out infinite;
        }

        .nflMover {
          position: absolute;
          left: 0;
          top: 1px;
          width: 18px;
          height: 18px;
        }
        .nflTDRunner {
          animation: nflHurdleTD 1.25s ease-in-out infinite;
        }

        .nflKickLeg {
          width: 8px;
          height: 2px;
          transform-origin: 1px 1px;
          animation: nflKickLeg 1.15s ease-in-out infinite;
        }

        .nflGoalLine {
          position: absolute;
          left: 1px;
          bottom: 2px;
          width: 2px;
          height: 12px;
          background: rgba(0,0,0,0.25);
          border-radius: 1px;
        }

        .nflPosts {
          position: absolute;
          right: 0;
          top: 1px;
          width: 10px;
          height: 16px;
        }
        .nflPosts::before {
          content: "";
          position: absolute;
          left: 4px;
          top: 6px;
          width: 2px;
          height: 10px;
          background: rgba(0,0,0,0.25);
          border-radius: 1px;
        }
        .nflPosts::after {
          content: "";
          position: absolute;
          left: 1px;
          top: 6px;
          width: 8px;
          height: 2px;
          background: rgba(0,0,0,0.25);
          border-radius: 1px;
        }
        .nflHurdle {
          position: absolute;
          left: 28px;
          bottom: 4px;
          width: 10px;
          height: 2px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 1px;
        }
        .nflHurdle::before {
          content: "";
          position: absolute;
          left: 1px;
          bottom: 0;
          width: 2px;
          height: 7px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 1px;
        }
        .nflHurdle::after {
          content: "";
          position: absolute;
          right: 1px;
          bottom: 0;
          width: 2px;
          height: 7px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 1px;
        }
      `}</style>

      {isNFLSelected && nflBackgroundSprites.length > 0 && (
        <div className="nflBg" aria-hidden>
          {nflBackgroundSprites.map((s) => (
            <div
              key={s.id}
              className="nflSprite"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                transform: `translate(-50%, -50%) scale(${s.scale})`,
                opacity: s.opacity,
              }}
            >
              {s.kind === "pass" && (
                <div className="nflScene">
                  <div className="nflGround" />

                  <span className="nflPx nflHead" style={{ left: 4, top: 4 }} />
                  <span className="nflPx nflBody" style={{ left: 5, top: 8 }} />
                  <span className="nflPx nflArm" style={{ left: 6, top: 9 }} />

                  <span className="nflPx nflHead" style={{ left: 36, top: 4 }} />
                  <span className="nflPx nflBody" style={{ left: 37, top: 8 }} />
                  <span className="nflPx nflArm" style={{ left: 30, top: 9 }} />

                  <span
                    className="nflPx nflBall pass"
                    style={{
                      left: 8,
                      top: 8,
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${(1.25 * s.durationJitter).toFixed(2)}s`,
                    }}
                  />
                </div>
              )}

              {s.kind === "td" && (
                <div className="nflScene">
                  <div className="nflGround" />
                  <div className="nflGoalLine" />

                  <span className="nflPx nflHead" style={{ left: 24, top: 9 }} />
                  <span className="nflPx nflBody" style={{ left: 25, top: 11, height: 5 }} />

                  <div
                    className="nflMover nflTDRunner"
                    style={{
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${(1.25 * s.durationJitter).toFixed(2)}s`,
                    }}
                  >
                    <span className="nflPx nflHead" style={{ left: 2, top: 3 }} />
                    <span className="nflPx nflBody" style={{ left: 3, top: 7 }} />
                    <span className="nflPx nflArm" style={{ left: 4, top: 8 }} />
                    <span
                      className="nflPx nflLeg"
                      style={{
                        left: 3,
                        top: 13,
                        animationDelay: `${s.delay}s`,
                        animationDuration: `${(0.55 * s.durationJitter).toFixed(2)}s`,
                      }}
                    />
                    <span
                      className="nflPx nflLeg b"
                      style={{
                        left: 3,
                        top: 13,
                        animationDelay: `${s.delay}s`,
                        animationDuration: `${(0.55 * s.durationJitter).toFixed(2)}s`,
                      }}
                    />
                  </div>
                </div>
              )}

              {s.kind === "fg" && (
                <div className="nflScene">
                  <div className="nflGround" />
                  <div className="nflPosts" />

                  <span className="nflPx nflHead" style={{ left: 5, top: 6 }} />
                  <span className="nflPx nflBody" style={{ left: 6, top: 9, height: 6 }} />
                  <span className="nflPx nflArm" style={{ left: 7, top: 10 }} />
                  <span
                    className="nflPx nflKickLeg"
                    style={{
                      left: 6,
                      top: 14,
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${(1.15 * s.durationJitter).toFixed(2)}s`,
                    }}
                  />

                  <span
                    className="nflPx nflBall kick"
                    style={{
                      left: 0,
                      top: 0,
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${(1.15 * s.durationJitter).toFixed(2)}s`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
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
                      >
                      </div>
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

                {!isSingleGame && <div
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
                  { index + 1}
                </div>}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ArcadeScoreboard;
