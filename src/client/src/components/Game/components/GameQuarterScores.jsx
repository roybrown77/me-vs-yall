const FOOTBALL_LEAGUE_IDS = new Set([
  "59723313734d1d6202a85f10",
  "59723313734d1d6202a85f15",
]);

const normalizeLinescores = (competitor) => {
  const raw = competitor?.linescores;
  if (!Array.isArray(raw) || raw.length === 0) {
    return null;
  }

  return raw.map((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  });
};

const buildPeriodLabels = (periodCount) => {
  const labels = [];

  for (let index = 1; index <= periodCount; index += 1) {
    if (index <= 4) {
      labels.push(String(index));
    } else {
      labels.push(`OT${index - 4}`);
    }
  }

  return labels;
};

const GameQuarterScores = ({ game }) => {
  if (!FOOTBALL_LEAGUE_IDS.has(String(game?.leagueId || ""))) {
    return null;
  }

  const away = game.competitors?.[0] || {};
  const home = game.competitors?.[1] || {};
  const awayLines = normalizeLinescores(away);
  const homeLines = normalizeLinescores(home);
  const periodCount = Math.max(awayLines?.length || 0, homeLines?.length || 0, 4);
  const periodLabels = buildPeriodLabels(periodCount);

  if (!awayLines && !homeLines) {
    return (
      <div style={{ marginTop: "1.25rem", fontSize: "0.875rem" }}>
        Quarter-to-quarter scoring is not available yet.
      </div>
    );
  }

  const getPeriodScore = (lines, index) => {
    if (!lines || index >= lines.length) {
      return "—";
    }

    return lines[index];
  };

  const getTotalScore = (competitor, lines) => {
    const score = competitor?.score;
    if (score !== null && score !== undefined && score !== "") {
      return score;
    }

    if (!lines) {
      return "—";
    }

    return lines.reduce((sum, value) => sum + value, 0);
  };

  const rows = [
    {
      competitor: away,
      lines: awayLines,
      side: "away",
    },
    {
      competitor: home,
      lines: homeLines,
      side: "home",
    },
  ];

  const awayTotal = Number(getTotalScore(away, awayLines));
  const homeTotal = Number(getTotalScore(home, homeLines));
  const awayWinner = Number.isFinite(awayTotal) && awayTotal > homeTotal;
  const homeWinner = Number.isFinite(homeTotal) && homeTotal > awayTotal;

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div
        style={{
          margin: "4px 0",
          display: "flex",
        }}
      >
        <div
          style={{
            minWidth: "40px",
            padding: "4px",
            backgroundColor: "#374151",
            color: "#fff",
            marginRight: "4px",
          }}
        >
          Qtr to Qtr
        </div>
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `minmax(5.5rem, 1fr) repeat(${periodCount}, 2rem) 2.25rem`,
            gap: "0.25rem",
            alignItems: "center",
            padding: "0.35rem 0.25rem",
            borderBottom: "1px solid #e5e7eb",
            color: "#6b7280",
            fontWeight: 700,
          }}
        >
          <div />
          {periodLabels.map((label) => (
            <div key={`heading-${label}`} style={{ textAlign: "center" }}>
              {label}
            </div>
          ))}
          <div style={{ textAlign: "right", paddingRight: "0.15rem" }}>T</div>
        </div>
        {rows.map(({ competitor, lines, side }) => {
          const isWinner =
            (side === "away" && awayWinner) || (side === "home" && homeWinner);
          const teamLabel =
            competitor.shortLocation ||
            competitor.name ||
            (side === "away" ? "Away" : "Home");

          return (
            <div
              key={side}
              style={{
                display: "grid",
                gridTemplateColumns: `minmax(5.5rem, 1fr) repeat(${periodCount}, 2rem) 2.25rem`,
                gap: "0.25rem",
                alignItems: "center",
                padding: "0.45rem 0.25rem",
                borderBottom: "1px solid #f3f4f6",
                fontWeight: isWinner ? 800 : 600,
              }}
            >
              <div
                style={{
                  textAlign: "left",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: competitor.color || "#111827",
                }}
              >
                {teamLabel}
              </div>
              {periodLabels.map((label, index) => (
                <div
                  key={`${side}-${label}`}
                  style={{ textAlign: "center" }}
                >
                  {getPeriodScore(lines, index)}
                </div>
              ))}
              <div style={{ textAlign: "right", paddingRight: "0.15rem" }}>
                {getTotalScore(competitor, lines)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameQuarterScores;
