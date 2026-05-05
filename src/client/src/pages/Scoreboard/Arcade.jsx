import Box from "@mui/material/Box";

const ArcadeScoreboard = () => {
  const nodes = Array.from({ length: 14 }).map((_, index) => {
    const side = index % 2 === 0 ? "left" : "right";
    const emoji = side === "left" ? "🦉" : "🐯";
    return {
      id: index + 1,
      side,
      emoji,
      title: `Path ${index + 1}`,
    };
  });

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: "2",
        backgroundColor: "#B3E6CA",
        padding: "18px",
        fontFamily: "monospace",
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
          maxWidth: "560px",
          margin: "0 auto",
          position: "relative",
          padding: "10px 0 40px 0",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          arcade scoreboard
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "52px",
            bottom: "0px",
            width: "6px",
            transform: "translateX(-50%)",
            borderRadius: "999px",
            background: "rgba(0,0,0,0.12)",
          }}
        />

        {nodes.map((node, index) => {
          const isLeft = node.side === "left";
          const bobDelay = `${(index % 6) * 0.08}s`;

          return (
            <div
              key={node.id}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "26px 0",
              }}
            >
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
                    {node.emoji}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>
                    {node.title}
                  </div>
                </div>
              </div>

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
                {node.id}
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export default ArcadeScoreboard;
