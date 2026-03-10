import { useMemo, useState } from "react";
import PropTypes from "prop-types";

import { getScoreText, getTeamLabel, getTeamTinyLabel, getGameLabelWithScore } from "./arcadeGameText";

import { hasGameStarted } from "../../../utilities";

const ArcadeHud = ({
  leagueLabel,
  year,
  weekLabel,
  leagues,
  leagueId,
  weeks,
  weekId,
  dataLoading,
  onFilterLeague,
  onFilterYear,
  onFilterWeek,
  allGames,
  picks,
  leaders,
  updatingPick,
  onMakePick,
  mapApi,
  isAuthenticated,
  getPickOutcome,
  areCarsMoving,
  onToggleCarsMoving,
}) => {
  const [areFiltersCollapsed, setAreFiltersCollapsed] = useState(true);
  const [areGamesCollapsed, setAreGamesCollapsed] = useState(true);
  const [areLeadersCollapsed, setAreLeadersCollapsed] = useState(true);

  const leagueSelected = (leagues || []).find((l) => l.id === leagueId);
  const years = leagueSelected?.years || [];
  const weekIndexSelected = (weeks || []).findIndex((w) => w?._id === weekId);
  const weekIndexValue = weekIndexSelected === -1 ? 0 : weekIndexSelected;

  const selectStyle = {
    width: "100%",
    fontSize: "12px",
    fontWeight: 700,
    padding: "7px 10px",
    borderRadius: "10px",
    border: "1px solid #E7E7E7",
    backgroundColor: "#fff",
    outline: "none",
  };

  const dispatchChange = (handler, value) => {
    if (!handler) return;
    handler({ target: { value } });
  };

  const filterPanelId = "arcade-scoreboard-filters";
  const gamesPanelId = "arcade-scoreboard-games";
  const leadersPanelId = "arcade-scoreboard-leaders";

  const gameList = useMemo(() => {
    return (allGames || []).map((game) => {
      const away = game?.competitors?.[0];
      const home = game?.competitors?.[1];
      const pick = (picks || []).find((p) => p.gameId === game._id);
      const pickId = pick?.pickId;

      const isOver = !!game.isGameOver;
      const isStarted = hasGameStarted(game.startDateTime);
      const canPick = !isOver && !isStarted && !updatingPick;

      const awaySelected = pickId && away?._id && pickId === away._id;
      const homeSelected = pickId && home?._id && pickId === home._id;

      const pickOutcome = getPickOutcome({ game, pickId });

      return {
        game,
        away,
        home,
        pickId,
        canPick,
        isOver,
        isStarted,
        awaySelected,
        homeSelected,
        pickOutcome,
      };
    });
  }, [allGames, picks, updatingPick, getPickOutcome]);

  const pickRecord = useMemo(() => {
    if (!isAuthenticated) return null;

    let wins = 0;
    let losses = 0;

    gameList.forEach((g) => {
      if (!g.pickId) return;
      if (g.pickOutcome === "win") wins += 1;
      if (g.pickOutcome === "loss") losses += 1;
    });

    return { wins, losses };
  }, [gameList, isAuthenticated]);

  const leaderboardRows = useMemo(() => {
    const list = Array.isArray(leaders) ? leaders : [];
    const areAnyGamesInProgress = (allGames || []).some(
      (g) => hasGameStarted(g?.startDateTime) && !g?.isGameOver
    );

    return list.slice(0, 5).map((l, idx) => {
      const wins = areAnyGamesInProgress ? l?.winsBeforeGameOver : l?.wins;
      const losses = areAnyGamesInProgress ? l?.lossesBeforeGameOver : l?.losses;

      return {
        key: l?.id || `${idx}`,
        rank: idx + 1,
        name: l?.userName || "",
        record: Number.isFinite(wins) && Number.isFinite(losses) ? `${wins}-${losses}` : "",
      };
    });
  }, [leaders, allGames]);

  const leadersVisibleRows = useMemo(() => {
    return areLeadersCollapsed ? leaderboardRows.slice(0, 3) : leaderboardRows;
  }, [leaderboardRows, areLeadersCollapsed]);

  const renderPickBadge = (pickOutcome) => {
    if (!isAuthenticated) return null;
    if (pickOutcome !== "win" && pickOutcome !== "loss") return null;

    const isWin = pickOutcome === "win";
    return (
      <span
        aria-label={isWin ? "Correct pick" : "Incorrect pick"}
        title={isWin ? "Correct" : "Wrong"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 900,
          backgroundColor: isWin ? "#B3E6CA" : "#FF5722",
          color: isWin ? "#000" : "#fff",
          border: "1px solid #E7E7E7",
          flex: "0 0 auto",
        }}
      >
        {isWin ? "✓" : "✕"}
      </span>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "12px",
        bottom: "12px",
        zIndex: 7,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "min(360px, 45vw)",
        maxHeight: "calc(100vh - 24px)",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E7E7E7",
          borderRadius: "14px",
          padding: "10px 12px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, flex: 1 }}>
            🎟️ {leagueLabel || ""}{year ? ` • ${year}` : ""}
          </div>

          <button
            type="button"
            aria-controls={filterPanelId}
            aria-expanded={!areFiltersCollapsed}
            disabled={!!dataLoading}
            onClick={() => setAreFiltersCollapsed((v) => !v)}
            style={{
              fontSize: "11px",
              fontWeight: 800,
              border: "1px solid #E7E7E7",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "6px 10px",
              cursor: dataLoading ? "not-allowed" : "pointer",
            }}
          >
            {areFiltersCollapsed ? "Change" : "Done"}
          </button>
        </div>
        {!!weekLabel && (
          <div style={{ marginTop: "4px", fontSize: "12px", fontWeight: 650 }}>{weekLabel}</div>
        )}

        {!areFiltersCollapsed && (
          <div id={filterPanelId} style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
            <select
              aria-label="League"
              style={selectStyle}
              value={leagueId || ""}
              disabled={!!dataLoading || !(leagues || []).length}
              onChange={(e) => dispatchChange(onFilterLeague, e.target.value)}
            >
              {(leagues || []).map((l) => (
                <option key={l.id} value={l.id}>
                  {String(l.description || l.name || "").toUpperCase()}
                </option>
              ))}
            </select>

            <select
              aria-label="Year"
              style={selectStyle}
              value={year ?? ""}
              disabled={!!dataLoading || !years.length}
              onChange={(e) => dispatchChange(onFilterYear, Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              aria-label="Week"
              style={selectStyle}
              value={weekIndexValue}
              disabled={!!dataLoading || !(weeks || []).length}
              onChange={(e) => dispatchChange(onFilterWeek, Number(e.target.value))}
            >
              {(weeks || []).map((w, idx) => (
                <option key={w?._id || idx} value={idx}>
                  {w?.displayName || w?.description || `Week ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E7E7E7",
          borderRadius: "14px",
          padding: "10px 10px",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: "0 0 auto",
          minHeight: areGamesCollapsed ? "unset" : "220px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, flex: 1 }}>
            Games ({gameList.length})
            {pickRecord && (
              <span style={{ fontSize: "11px", fontWeight: 800, opacity: 0.75 }}>{` • Record ${pickRecord.wins}-${pickRecord.losses}`}</span>
            )}
          </div>
          {!areGamesCollapsed && (
            <div style={{ fontSize: "11px", fontWeight: 650, opacity: 0.75 }}>Tap to view</div>
          )}

          <button
            type="button"
            onClick={onToggleCarsMoving}
            style={{
              fontSize: "11px",
              fontWeight: 800,
              border: "1px solid #E7E7E7",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "6px 10px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            aria-label={areCarsMoving ? "Stop cars" : "Start cars"}
          >
            {areCarsMoving ? "Stop Cars" : "Start Cars"}
          </button>

          <button
            type="button"
            aria-controls={gamesPanelId}
            aria-expanded={!areGamesCollapsed}
            onClick={() => setAreGamesCollapsed((v) => !v)}
            style={{
              fontSize: "11px",
              fontWeight: 800,
              border: "1px solid #E7E7E7",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            {areGamesCollapsed ? "Expand" : "Minimize"}
          </button>
        </div>

        {areGamesCollapsed ? (
          <div
            id={gamesPanelId}
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: "2px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {gameList.map(({ game, away, home, isOver, isStarted, awaySelected, homeSelected, pickOutcome }) => {
              const awayTiny = getTeamTinyLabel(away);
              const homeTiny = getTeamTinyLabel(home);
              const scoreText = getScoreText(game);
              const status = isOver ? "Final" : isStarted ? "Live" : "Pick";
              const isSelected = awaySelected || homeSelected;

              return (
                <button
                  key={game._id}
                  type="button"
                  onClick={() => mapApi?.openGamePopup?.(game._id)}
                  style={{
                    flex: "0 0 auto",
                    textAlign: "left",
                    border: isSelected ? "2px solid #3772FA" : "1px solid #E7E7E7",
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "6px 8px",
                    minWidth: "160px",
                    cursor: "pointer",
                  }}
                  aria-label={`Open ${awayTiny} ${scoreText} ${homeTiny}`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 900,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {awayTiny} {scoreText} {homeTiny}
                    </div>
                    {renderPickBadge(pickOutcome)}
                  </div>
                  <div style={{ marginTop: "2px", fontSize: "9px", fontWeight: 700, opacity: 0.7 }}>{status}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            id={gamesPanelId}
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(2, 108px)",
              gap: "14px",
              alignContent: "start",
              overflowX: "auto",
              overflowY: "hidden",
              padding: "2px 6px 8px 2px",
              WebkitOverflowScrolling: "touch",
              height: "min(230px, calc(100vh - 260px))",
            }}
          >
            {gameList.map(({ game, away, home, canPick, isOver, isStarted, awaySelected, homeSelected, pickOutcome }) => {
              const title = getGameLabelWithScore(game, away, home);
              const status = isOver ? "Final" : isStarted ? "Live" : "Pick";

              const pickBtnStyle = (selected) => ({
                flex: 1,
                padding: "6px 7px",
                borderRadius: "10px",
                border: "1px solid #E7E7E7",
                backgroundColor: selected ? "#B3E6CA" : "#fff",
                fontWeight: selected ? 750 : 650,
                fontSize: "10px",
                cursor: canPick ? "pointer" : "default",
                opacity: canPick ? 1 : 0.6,
              });

              return (
                <div
                  key={game._id}
                  style={{
                    border: "1px solid #E7E7E7",
                    borderRadius: "12px",
                    padding: "7px 8px",
                    width: "260px",
                    height: "108px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => mapApi?.openGamePopup?.(game._id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 900,
                          lineHeight: 1.15,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1,
                        }}
                        title={title}
                      >
                        {title}
                      </div>
                      {renderPickBadge(pickOutcome)}
                    </div>
                    <div style={{ marginTop: "2px", fontSize: "10px", fontWeight: 700, opacity: 0.75 }}>{status}</div>
                  </button>

                  <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                    <button
                      type="button"
                      disabled={!canPick}
                      onClick={() => {
                        if (!canPick) return;
                        onMakePick({ gameId: game._id, pickId: away?._id });
                      }}
                      style={pickBtnStyle(awaySelected)}
                    >
                      Pick {getTeamLabel(away)}
                    </button>
                    <button
                      type="button"
                      disabled={!canPick}
                      onClick={() => {
                        if (!canPick) return;
                        onMakePick({ gameId: game._id, pickId: home?._id });
                      }}
                      style={pickBtnStyle(homeSelected)}
                    >
                      Pick {getTeamLabel(home)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #E7E7E7",
          borderRadius: "14px",
          padding: "10px 12px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, flex: 1 }}>Leader Board</div>
          <div style={{ fontSize: "11px", fontWeight: 650, opacity: 0.75 }}>
            {areLeadersCollapsed ? "Top 3" : "All"}
            {!!leaderboardRows.length ? ` (${leaderboardRows.length})` : ""}
          </div>

          <button
            type="button"
            aria-controls={leadersPanelId}
            aria-expanded={!areLeadersCollapsed}
            onClick={() => setAreLeadersCollapsed((v) => !v)}
            style={{
              fontSize: "11px",
              fontWeight: 800,
              border: "1px solid #E7E7E7",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "6px 10px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {areLeadersCollapsed ? "Expand" : "Minimize"}
          </button>
        </div>

        {dataLoading && !leaderboardRows.length ? (
          <div style={{ marginTop: "8px", fontSize: "11px", fontWeight: 650, opacity: 0.75 }}>Loading…</div>
        ) : !leaderboardRows.length ? (
          <div style={{ marginTop: "8px", fontSize: "11px", fontWeight: 650, opacity: 0.75 }}>No leaders yet</div>
        ) : (
          <div
            id={leadersPanelId}
            style={{
              marginTop: "8px",
              display: "grid",
              gap: "6px",
              maxHeight: areLeadersCollapsed ? "unset" : "160px",
              overflowY: areLeadersCollapsed ? "visible" : "auto",
              paddingRight: areLeadersCollapsed ? 0 : "2px",
            }}
          >
            {leadersVisibleRows.map((row) => (
              <div
                key={row.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "11px",
                  fontWeight: 750,
                }}
              >
                <div style={{ width: "18px", textAlign: "right", opacity: 0.8 }}>{row.rank}</div>
                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={row.name}
                >
                  {row.name}
                </div>
                <div style={{ fontWeight: 800, opacity: 0.85 }}>{row.record}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ArcadeHud.propTypes = {
  leagueLabel: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  weekLabel: PropTypes.string,
  leagues: PropTypes.array,
  leagueId: PropTypes.string,
  weeks: PropTypes.array,
  weekId: PropTypes.string,
  dataLoading: PropTypes.bool,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  allGames: PropTypes.array.isRequired,
  picks: PropTypes.array,
  leaders: PropTypes.array,
  updatingPick: PropTypes.bool,
  onMakePick: PropTypes.func.isRequired,
  mapApi: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  getPickOutcome: PropTypes.func.isRequired,
  areCarsMoving: PropTypes.bool.isRequired,
  onToggleCarsMoving: PropTypes.func.isRequired,
};

export default ArcadeHud;
