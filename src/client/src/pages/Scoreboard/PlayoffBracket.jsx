import { useMemo } from "react";
import PropTypes from "prop-types";

import { buildPlayoffBracket } from "./playoffSeeds";
import "./playoff-bracket.css";

const teamShape = {
  seed: PropTypes.number,
  color: PropTypes.string,
  shortLocation: PropTypes.string,
  name: PropTypes.string,
  division: PropTypes.string,
  recordLabel: PropTypes.string,
  live: PropTypes.bool,
};

const TeamNameBlock = ({ team }) => (
  <>
    <span className="playoff-team-name">{team.shortLocation}</span>
    <span className="playoff-team-meta">
      {team.name}
      {team.division ? ` · ${team.division}` : ""}
    </span>
  </>
);

TeamNameBlock.propTypes = {
  team: PropTypes.shape(teamShape).isRequired,
};

const TeamRow = ({ team }) => (
  <div className="playoff-team" style={{ borderLeftColor: team.color }}>
    <span className="playoff-seed">{team.seed}</span>
    <span>
      <TeamNameBlock team={team} />
    </span>
    <span className="playoff-record">
      {team.recordLabel}
      {team.live ? <span className="playoff-live">LIVE</span> : null}
    </span>
  </div>
);

const MatchRow = ({ higher, lower }) => (
  <div className="playoff-match">
    <div
      className="playoff-match-team playoff-match-team--left"
      style={{ borderLeftColor: lower.color }}
    >
      <span className="playoff-seed">{lower.seed}</span>
      <TeamNameBlock team={lower} />
      <span className="playoff-record">
        {lower.recordLabel}
        {lower.live ? <span className="playoff-live">LIVE</span> : null}
      </span>
    </div>
    <span className="playoff-match-at" aria-hidden="true">
      @
    </span>
    <div
      className="playoff-match-team playoff-match-team--right"
      style={{ borderRightColor: higher.color }}
    >
      <span className="playoff-seed">{higher.seed}</span>
      <TeamNameBlock team={higher} />
      <span className="playoff-record">
        {higher.recordLabel}
        {higher.live ? <span className="playoff-live">LIVE</span> : null}
      </span>
    </div>
  </div>
);

MatchRow.propTypes = {
  higher: PropTypes.shape(teamShape).isRequired,
  lower: PropTypes.shape(teamShape).isRequired,
};

TeamRow.propTypes = {
  team: PropTypes.shape(teamShape).isRequired,
};

const PlayoffBracket = ({
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
              <MatchRow
                higher={game.higher}
                key={`${game.higher.teamId}-${game.lower.teamId}`}
                lower={game.lower}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

PlayoffBracket.propTypes = {
  teams: PropTypes.array,
  seasonGames: PropTypes.array,
  liveGames: PropTypes.array,
  weeks: PropTypes.array,
};

export default PlayoffBracket;
