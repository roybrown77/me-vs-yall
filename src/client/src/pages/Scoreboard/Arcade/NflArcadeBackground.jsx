import { useMemo } from "react";

const NflArcadeBackground = ({ enabled }) => {
  const sprites = useMemo(() => {
    if (!enabled) return [];

    const kinds = ["pass", "td", "fg"];
    const count = 24;
    return Array.from({ length: count }).map((_, i) => {
      const kind = kinds[i % kinds.length];
      const left = Math.random() * 100;
      const top = 8 + Math.random() * 90;
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
  }, [enabled]);

  if (!enabled || sprites.length === 0) return null;

  return (
    <>
      <style>{`
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
          22% { transform: translate(30px, 0px); }
          32% { transform: translate(28px, -6px); }
          38% { transform: translate(24px, -14px); }
          50% { transform: translate(16px, 0px); }
          70% { transform: translate(10px, 0px); }
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
          animation: nflHurdleTD 1.9s ease-in-out infinite;
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
      `}</style>

      <div className="nflBg" aria-hidden>
        {sprites.map((s) => (
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
                    animationDuration: `${(1.9 * s.durationJitter).toFixed(2)}s`,
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
    </>
  );
};

export default NflArcadeBackground;
