import { useMemo } from "react";
import PropTypes from "prop-types";

import Skeleton from "@mui/material/Skeleton";

import { buildPlayoffBracket } from "./playoffSeeds";
import "./playoff-bracket.css";

const TeamRow = ({ team }) => (
  <div className="playoff-team" style={{ borderLeftColor: team.color }}>
    <span className="playoff-seed">{team.seed}</span>
    <span>
      <span className="playoff-team-name">{team.shortLocation}</span>
      <span className="playoff-team-meta">
        {team.name}
        {team.division ? ` · ${team.division}` : ""}
      </span>
    </span>
    <span className="playoff-record">
      {team.recordLabel}
      {team.live ? <span className="playoff-live">LIVE</span> : null}
    </span>
  </div>
);

TeamRow.propTypes = {
  team: PropTypes.shape({
    seed: PropTypes.number,
    color: PropTypes.string,
    shortLocation: PropTypes.string,
    name: PropTypes.string,
    division: PropTypes.string,
    recordLabel: PropTypes.string,
    live: PropTypes.bool,
  }).isRequired,
};

const PlayoffBracket = ({
  loading = false,
  teams = [],
  seasonGames = [],
  liveGames = [],
  weeks = [],
}) => {
  const bracket = useMemo(
    () =>
      buildPlayoffBracket({
        teams,
        seasonGames,
        liveGames,
        weeks,
      }),
    [liveGames, seasonGames, teams, weeks]
  );

  if (loading && !bracket.hasResults) {
    return (
      <div className="playoff-bracket">
        <Skeleton animation="pulse" height="4em" variant="rectangular" />
        <Skeleton animation="pulse" height="8em" variant="rectangular" />
        <Skeleton animation="pulse" height="8em" variant="rectangular" />
      </div>
    );
  }

  if (!bracket.hasResults) {
    return (
      <div className="playoff-bracket">
        <p className="playoff-bracket-note">
          Playoff seeds appear once regular-season games are on the board.
        </p>
      </div>
    );
  }

  return (
    <div className="playoff-bracket">
      <p className="playoff-bracket-note">
        Seeded as if the regular season ended on the current score. A game in
        progress counts once a team leads, and the record updates as the score
        changes. The 1 seed has a bye. Wild Card is 2 vs 7, 3 vs 6, and 4 vs 5.
      </p>
      <div className="playoff-conferences">
        {bracket.conferences.map((conference) => (
          <section key={conference.conference}>
            <h2 className="playoff-conference-title">{conference.conference}</h2>
            {conference.bye ? (
              <>
                <div className="playoff-round-label">Bye</div>
                <div className="playoff-bye">
                  <TeamRow team={conference.bye} />
                </div>
              </>
            ) : null}
            <div className="playoff-round-label">Wild Card</div>
            {conference.wildCard.map((game) => (
              <div
                className="playoff-match"
                key={`${game.higher.teamId}-${game.lower.teamId}`}
              >
                <TeamRow team={game.higher} />
                <TeamRow team={game.lower} />
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

PlayoffBracket.propTypes = {
  loading: PropTypes.bool,
  teams: PropTypes.array,
  seasonGames: PropTypes.array,
  liveGames: PropTypes.array,
  weeks: PropTypes.array,
};

export default PlayoffBracket;
