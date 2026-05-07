import { useState } from "react";

import { getGameSubtitle, getGameTitle } from "./arcadeGameText";

const getPickLabel = (game, picks) => {
  if (!game?._id || !Array.isArray(picks) || picks.length === 0) return null;
  const pick = picks.find((p) => p?.gameId === game._id);
  if (!pick?.pickId) return null;
  const competitorIndex = game?.competitors?.findIndex((c) => c?._id === pick.pickId);
  if (competitorIndex !== 0 && competitorIndex !== 1) return null;
  const competitor = game?.competitors?.[competitorIndex];
  return competitor?.shortLocation || competitor?.name || null;
};

const getSpreadLabel = (game) => {
  const amount = game?.spread?.amount;
  const teamId = game?.spread?.teamId;
  if (amount == null || !teamId) return null;

  const spreadTeam = game?.competitors?.find((c) => c?._id === teamId);
  const spreadTeamLabel = spreadTeam?.shortLocation || spreadTeam?.name;
  if (!spreadTeamLabel) return String(amount);

  return `${spreadTeamLabel} ${amount}`;
};

const getCompetitorStatsLine = (competitor) => {
  if (!competitor) return null;
  const parts = [];
  if (competitor.rank) parts.push(`#${competitor.rank}`);
  if (competitor.record) parts.push(String(competitor.record));
  return parts.length ? parts.join(" ") : null;
};

const getCompetitorLabel = (competitor) => {
  return competitor?.shortLocation || competitor?.name || null;
};

const getStatsRows = (game, limit = 8) => {
  const stats = Array.isArray(game?.stats) ? game.stats : [];
  return stats.slice(0, limit).filter((s) => s && s.name);
};

const formatStatValue = (value) => {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "";
};

const ArcadeGameTimeline = ({
  displayGames,
  isSingleGame,
  listRef,
  nodeRefs,
  spinePathD,
  picks,
  spreadMode,
}) => {
  const [expandedByKey, setExpandedByKey] = useState({});

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
          const pickLabel = getPickLabel(game, picks);
          const spreadLabel = spreadMode ? getSpreadLabel(game) : null;

          const key = String(game?._id ?? index);
          const expanded = !!expandedByKey[key];

          const away = game?.competitors?.[0];
          const home = game?.competitors?.[1];
          const awayStats = getCompetitorStatsLine(away);
          const homeStats = getCompetitorStatsLine(home);
          const gameStatsRows = getStatsRows(game, 8);
          const awayHeader = getCompetitorLabel(away);
          const homeHeader = getCompetitorLabel(home);

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
                        {getGameTitle(game, { isSingleGame })}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 600, opacity: 0.85 }}>
                        {getGameSubtitle(game)}
                      </div>
                      {!!spreadLabel && (
                        <div style={{ fontSize: "10px", fontWeight: 800, marginTop: "4px" }}>
                          SPREAD: {String(spreadLabel)}
                        </div>
                      )}
                      {!!pickLabel && (
                        <div style={{ fontSize: "10px", fontWeight: 800, marginTop: "4px" }}>
                          YOUR PICK: {String(pickLabel)}
                        </div>
                      )}

                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setExpandedByKey((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        style={{
                          marginTop: "8px",
                          padding: "6px 10px",
                          borderRadius: "10px",
                          border: "1px solid rgba(0,0,0,0.18)",
                          background: "rgba(255,255,255,0.95)",
                          cursor: "pointer",
                          fontWeight: 800,
                          fontSize: "10px",
                        }}
                      >
                        {expanded ? "Show less" : "Show more"}
                      </button>

                      {expanded && (
                        <div style={{ marginTop: "8px", fontSize: "10px", fontWeight: 600 }}>
                          {!!game?.gameName && (
                            <div style={{ marginBottom: "6px", opacity: 0.9 }}>
                              {String(game.gameName)}
                            </div>
                          )}
                          {(away?.shortLocation || away?.name) && (
                            <div style={{ opacity: 0.9 }}>
                              {String(away?.shortLocation || away?.name)}: {String(away?.name || "")}
                              {!!awayStats && <span style={{ opacity: 0.85 }}> • {awayStats}</span>}
                            </div>
                          )}
                          {(home?.shortLocation || home?.name) && (
                            <div style={{ opacity: 0.9 }}>
                              {String(home?.shortLocation || home?.name)}: {String(home?.name || "")}
                              {!!homeStats && <span style={{ opacity: 0.85 }}> • {homeStats}</span>}
                            </div>
                          )}

                          <div style={{ marginTop: "10px", opacity: 0.95 }}>
                            <div style={{ fontWeight: 800, marginBottom: "4px" }}>GAME STATS</div>
                            {gameStatsRows.length === 0 && (
                              <div style={{ opacity: 0.8 }}>Stats not available.</div>
                            )}
                            {gameStatsRows.length > 0 && (
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    fontWeight: 800,
                                    opacity: 0.85,
                                    marginBottom: "2px",
                                  }}
                                >
                                  <div style={{ flex: 1 }} />
                                  <div style={{ width: "64px", textAlign: "right" }}>
                                    {awayHeader ? String(awayHeader) : "Away"}
                                  </div>
                                  <div
                                    style={{
                                      width: "64px",
                                      textAlign: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {homeHeader ? String(homeHeader) : "Home"}
                                  </div>
                                </div>

                                {gameStatsRows.map((stat) => (
                                  <div
                                    key={`${game?._id || "game"}-${stat.name}`}
                                    style={{ display: "flex", opacity: 0.9 }}
                                  >
                                    <div style={{ flex: 1, paddingRight: "8px" }}>
                                      {String(stat.name)}
                                    </div>
                                    <div style={{ width: "64px", textAlign: "right" }}>
                                      {formatStatValue(stat?.awayTeam?.value)}
                                    </div>
                                    <div
                                      style={{
                                        width: "64px",
                                        textAlign: "right",
                                        marginLeft: "10px",
                                      }}
                                    >
                                      {formatStatValue(stat?.homeTeam?.value)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700 }}>
                        {getGameTitle(game, { isSingleGame })}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 600, opacity: 0.85 }}>
                        {getGameSubtitle(game)}
                      </div>
                      {!!spreadLabel && (
                        <div style={{ fontSize: "10px", fontWeight: 800, marginTop: "4px" }}>
                          SPREAD: {String(spreadLabel)}
                        </div>
                      )}
                      {!!pickLabel && (
                        <div style={{ fontSize: "10px", fontWeight: 800, marginTop: "4px" }}>
                          YOUR PICK: {String(pickLabel)}
                        </div>
                      )}

                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setExpandedByKey((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        style={{
                          marginTop: "8px",
                          padding: "6px 10px",
                          borderRadius: "10px",
                          border: "1px solid rgba(0,0,0,0.18)",
                          background: "rgba(255,255,255,0.95)",
                          cursor: "pointer",
                          fontWeight: 800,
                          fontSize: "10px",
                        }}
                      >
                        {expanded ? "Show less" : "Show more"}
                      </button>

                      {expanded && (
                        <div style={{ marginTop: "8px", fontSize: "10px", fontWeight: 600 }}>
                          {!!game?.gameName && (
                            <div style={{ marginBottom: "6px", opacity: 0.9 }}>
                              {String(game.gameName)}
                            </div>
                          )}
                          {(away?.shortLocation || away?.name) && (
                            <div style={{ opacity: 0.9 }}>
                              {String(away?.shortLocation || away?.name)}: {String(away?.name || "")}
                              {!!awayStats && <span style={{ opacity: 0.85 }}> • {awayStats}</span>}
                            </div>
                          )}
                          {(home?.shortLocation || home?.name) && (
                            <div style={{ opacity: 0.9 }}>
                              {String(home?.shortLocation || home?.name)}: {String(home?.name || "")}
                              {!!homeStats && <span style={{ opacity: 0.85 }}> • {homeStats}</span>}
                            </div>
                          )}

                          <div style={{ marginTop: "10px", opacity: 0.95 }}>
                            <div style={{ fontWeight: 800, marginBottom: "4px" }}>GAME STATS</div>
                            {gameStatsRows.length === 0 && (
                              <div style={{ opacity: 0.8 }}>Stats not available.</div>
                            )}
                            {gameStatsRows.length > 0 && (
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    fontWeight: 800,
                                    opacity: 0.85,
                                    marginBottom: "2px",
                                  }}
                                >
                                  <div style={{ flex: 1 }} />
                                  <div style={{ width: "64px", textAlign: "right" }}>
                                    {awayHeader ? String(awayHeader) : "Away"}
                                  </div>
                                  <div
                                    style={{
                                      width: "64px",
                                      textAlign: "right",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {homeHeader ? String(homeHeader) : "Home"}
                                  </div>
                                </div>

                                {gameStatsRows.map((stat) => (
                                  <div
                                    key={`${game?._id || "game"}-${stat.name}`}
                                    style={{ display: "flex", opacity: 0.9 }}
                                  >
                                    <div style={{ flex: 1, paddingRight: "8px" }}>
                                      {String(stat.name)}
                                    </div>
                                    <div style={{ width: "64px", textAlign: "right" }}>
                                      {formatStatValue(stat?.awayTeam?.value)}
                                    </div>
                                    <div
                                      style={{
                                        width: "64px",
                                        textAlign: "right",
                                        marginLeft: "10px",
                                      }}
                                    >
                                      {formatStatValue(stat?.homeTeam?.value)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
