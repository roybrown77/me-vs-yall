import PropTypes from "prop-types";
import get from "lodash/get";

import Skeleton from "@mui/material/Skeleton";

const bubbleRowStyles = {
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    gap: "10px",
    padding: "8px 0",
  },
  bubble: {
    flex: "0 0 auto",
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: "12px",
    padding: "10px 12px",
    borderRadius: "999px",
    border: "2px solid #000",
    backgroundColor: "#fff",
    color: "#000",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  bubbleSelected: {
    backgroundColor: "#B3E6CA",
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    boxSizing: "border-box",
  },
};

const toChangeEvent = (value) => ({ target: { value } });

const ArcadeGameSearchBar = ({
  leagueId,
  leagues,
  weekId,
  yearSelected,
  weeks,
  loading,
  onFilterLeague,
  onFilterYear,
  onFilterWeek,
}) => {
  const displayLeagues = Array.isArray(leagues) ? leagues : [];
  const displayWeeks = Array.isArray(weeks) ? weeks : [];

  const leagueSelected = leagueId && displayLeagues.find((l) => l.id === leagueId);
  const displayYears = leagueSelected?.years || [];

  const weekIndexSelected = leagueId && displayWeeks.findIndex((x) => x._id === weekId);
  const selectedWeekIndex = weekIndexSelected === -1 ? 0 : weekIndexSelected;

  const leaguesForRow = leagueId ? [...displayLeagues].reverse() : [];
  const yearsForRow = leagueId ? [...displayYears].reverse() : [];
  const weeksForRow = leagueId
    ? displayWeeks
        .map((w, index) => ({ week: w, index }))
        .reverse()
    : [];

  return (
    <div style={bubbleRowStyles.container}>
      {!leagueId && (
        <div style={{ width: "100%", padding: "10px 0" }}>
          <Skeleton animation="pulse" height="44px" variant="rect" />
        </div>
      )}

      {!!leagueId && (
        <>
          <div style={bubbleRowStyles.row} aria-label="League filters">
            {leaguesForRow.map((league) => {
              const isSelected = league.id === leagueId;
              return (
                <button
                  key={league.id}
                  type="button"
                  disabled={loading}
                  onClick={() => onFilterLeague?.(toChangeEvent(league.id))}
                  style={{
                    ...bubbleRowStyles.bubble,
                    ...(isSelected ? bubbleRowStyles.bubbleSelected : {}),
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {get(league, "description", "").toUpperCase()}
                </button>
              );
            })}
          </div>

          <div style={bubbleRowStyles.row} aria-label="Year filters">
            {yearsForRow.map((year) => {
              const isSelected = Number(yearSelected) === Number(year);
              return (
                <button
                  key={year}
                  type="button"
                  disabled={loading}
                  onClick={() => onFilterYear?.(toChangeEvent(year))}
                  style={{
                    ...bubbleRowStyles.bubble,
                    ...(isSelected ? bubbleRowStyles.bubbleSelected : {}),
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {year}
                </button>
              );
            })}
          </div>

          <div style={bubbleRowStyles.row} aria-label="Week filters">
            {weeksForRow.map(({ week, index }) => {
              const isSelected = Number(selectedWeekIndex) === Number(index);
              return (
                <button
                  key={`${week?._id ?? index}`}
                  type="button"
                  disabled={loading}
                  onClick={() => onFilterWeek?.(toChangeEvent(index))}
                  style={{
                    ...bubbleRowStyles.bubble,
                    ...(isSelected ? bubbleRowStyles.bubbleSelected : {}),
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {week?.displayName ?? "Loading weeks..."}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

ArcadeGameSearchBar.propTypes = {
  leagueId: PropTypes.string,
  leagues: PropTypes.array,
  weekId: PropTypes.string,
  weeks: PropTypes.array,
  yearSelected: PropTypes.number,
  loading: PropTypes.bool,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
};

ArcadeGameSearchBar.defaultProps = {
  loading: false,
};

export default ArcadeGameSearchBar;
