import PropTypes from "prop-types";

import Skeleton from "@mui/material/Skeleton";

import {
  attachRankMovement,
  buildTeamRankings,
} from "./rankings";

const movementLabel = (entry) => {
  if (entry.movement === "up") {
    return { symbol: "↑", color: "#0B6E4F", title: `Up ${entry.rankDelta}` };
  }
  if (entry.movement === "down") {
    return {
      symbol: "↓",
      color: "#C62828",
      title: `Down ${Math.abs(entry.rankDelta)}`,
    };
  }
  if (entry.movement === "new") {
    return { symbol: "•", color: "#666", title: "New to rankings window" };
  }
  return { symbol: "→", color: "#666", title: "No change since last week" };
};

const TeamRankings = ({
  loading,
  leagueId,
  seasonGamesCurrent = [],
  seasonGamesPrevious = [],
  teams = [],
  usesPriorPlayoffs = false,
  rankingsAvailable = true,
}) => {
  if (!rankingsAvailable) {
    return (
      <div style={styles.note}>
        Team rankings begin at regular season week 2. Preseason and week 1 are
        not included.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ margin: "12px 0" }}>
        <Skeleton animation="pulse" height="4em" variant="rect" />
        <Skeleton animation="pulse" height="3em" variant="rect" />
        <Skeleton animation="pulse" height="3em" variant="rect" />
      </div>
    );
  }

  const currentRankings = buildTeamRankings({
    games: seasonGamesCurrent,
    teams,
  });
  const previousRankings = buildTeamRankings({
    games: seasonGamesPrevious,
    teams,
  });
  const rankings = attachRankMovement(currentRankings, previousRankings);

  if (rankings.length === 0) {
    return (
      <div style={styles.note}>
        Rankings will appear once completed games are on the board for this
        season.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.note}>
        Rankings blend season results, point differential, and recent play
        history from the last few games. Each team shows an arrow for movement
        versus
        last week&apos;s snapshot.
        {usesPriorPlayoffs
          ? " Week 1 also folds in last season's playoff games; every later week uses this season only."
          : " All games in the table use the current season (regular season and playoffs)."}
      </p>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Move</th>
              <th style={styles.thLeft}>Team</th>
              <th style={styles.th}>Record</th>
              <th style={styles.th}>Diff</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((entry) => {
              const move = movementLabel(entry);
              return (
                <tr key={entry.teamId} style={styles.row}>
                  <td style={styles.td}>{entry.rank}</td>
                  <td style={{ ...styles.td, color: move.color, fontWeight: 700 }}>
                    <span title={move.title}>{move.symbol}</span>
                  </td>
                  <td style={styles.tdLeft}>{entry.shortLocation}</td>
                  <td style={styles.td}>
                    {entry.wins}-{entry.losses}
                    {entry.ties > 0 ? `-${entry.ties}` : ""}
                  </td>
                  <td style={styles.td}>
                    {entry.pointDifferential > 0 ? "+" : ""}
                    {entry.pointDifferential}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "0 0.5rem 1rem",
  },
  note: {
    margin: "0.75rem auto 1rem",
    maxWidth: "44rem",
    padding: "8px 12px",
    color: "#475569",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.8rem",
    fontWeight: 600,
    lineHeight: 1.45,
    textAlign: "center",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "monospace",
    fontSize: "0.85rem",
  },
  th: {
    padding: "10px 8px",
    borderBottom: "2px solid #111",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  thLeft: {
    padding: "10px 8px",
    borderBottom: "2px solid #111",
    textAlign: "left",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  tdLeft: {
    padding: "10px 8px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    fontWeight: 700,
  },
  row: {
    backgroundColor: "#fff",
  },
};

TeamRankings.propTypes = {
  loading: PropTypes.bool,
  leagueId: PropTypes.string,
  seasonGamesCurrent: PropTypes.array,
  seasonGamesPrevious: PropTypes.array,
  teams: PropTypes.array,
  usesPriorPlayoffs: PropTypes.bool,
  rankingsAvailable: PropTypes.bool,
};

export default TeamRankings;
