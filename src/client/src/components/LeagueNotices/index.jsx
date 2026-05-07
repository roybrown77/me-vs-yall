import Countdown from "../Countdown";
import { getLeagueGameNoun } from "../../utilities/leagueCopy";

const LeagueNotices = ({
  leagueId,
  areAllGamesOver,
  areAnyGamesInProgress,
  timeUntilNextGameStarts,
  isAuthenticated,
}) => {
  const singularNoun = getLeagueGameNoun({ leagueId, plural: false });
  const pluralNoun = getLeagueGameNoun({ leagueId, plural: true });

  return (
    <>
      {!areAllGamesOver && !areAnyGamesInProgress && (
        <div
          style={{
            margin: "4px 14%",
            padding: "4px",
            border: "4px solid deeppink",
          }}
        >
          <div style={{ color: "deeppink", fontSize: "17px" }}>
            next {singularNoun} starts in
          </div>
          <Countdown date={timeUntilNextGameStarts} />
        </div>
      )}
      {areAnyGamesInProgress && (
        <div
          style={{
            color: "deeppink",
            fontSize: "17px",
            margin: "4px 17%",
            padding: "4px",
            border: "4px solid deeppink",
          }}
        >
          <div className="fast-flash">** {pluralNoun} in progress **</div>
        </div>
      )}
    </>
  );
};

export default LeagueNotices;
