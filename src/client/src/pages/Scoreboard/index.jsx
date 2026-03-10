import { Component } from 'react';
import get from "lodash/get";
import last from "lodash/last";
import moment from "moment-timezone";
import { createBrowserHistory } from "history";
import queryString from "query-string";

import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import RemainingGamesNotifier from "./RemainingGamesNotifier";
import ArcadeMode, { ArcadeModeToggle } from "./ArcadeMode";
import PageContainer from "../../components/PageContainer";
import GameSearchBar from "../../components/GameSearchBar";
import PickResult from "../../components/PickResult";
import Game from "../../components/Game";
import Countdown from "../../components/Countdown";
import TinyScoreboard from "../../components/TinyScoreboard";
import GameEngagementBar from "../../components/GameEngagementBar";

import { getPicksNotSelected, getGroupedGames } from "./utilities";
import a11yProps from "../../utilities/a11yProps";
import { callApi } from "../../utilities/http";
import { getLeagueName } from '../../utilities/getLeagueName';
import {
    formatWeeks,
    hasGameStarted,
    getAreAllGamesOver,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
    leagues,
  } from "../../utilities";
import {
  googleLogin,
  isConfirmedAuthentication,
  getUser,
} from "../../utilities/authenticationClient";

import styles from "./styles";

const isAuthenticated = isConfirmedAuthentication();

const history = createBrowserHistory({ forceRefresh: false });

const getSpreadMode = () => localStorage.getItem("spreadModeToggle", "0");

const SCOREBOARD_VIEW_MODE_KEY = "scoreboardViewMode";
const getScoreboardViewMode = () =>
  localStorage.getItem(SCOREBOARD_VIEW_MODE_KEY) || "classic";
const setScoreboardViewMode = (mode) =>
  localStorage.setItem(SCOREBOARD_VIEW_MODE_KEY, mode);

let gameDate;

class Scoreboard extends Component {
  constructor(props) {
    super(props);

    const league = leagues.find((league) => league.name === getLeagueName()) || leagues[0];
    const leagueId = league?.id;
    const year = last(league?.years);
    
    this.state = {
      dataLoading: true,

      weeks: [],
      games: [],
      picks: [],
      teams: [],

      leagueId,
      year,
      weekId: null,
      beginDateTime: null,
      endDateTime: null,

      groupedGames: [],

      updatingPick: false,

      isShareClicked: false,

      isSpreadModeAlertOpen: false,

      isArcadeMode: getScoreboardViewMode() === "arcade",
    };
  }

  initializeClassicScoreboard = async () => {
    const { leagueId, year } = this.state;

    const weeks = await this.loadGameWeeks({ leagueId, year: year });

    if (weeks) {
      const currentWeek = last(weeks);
      this.loadData({
        weeks,
        leagueId,
        year: currentWeek.year,
        weekId: currentWeek._id,
        beginDateTime: currentWeek.beginDateTime,
        endDateTime: currentWeek.endDateTime,
      });
    }
  };

  async componentDidMount() {
    window.scrollTo(0, 0);

    await this.initializeClassicScoreboard();

    if (isAuthenticated) {
      const createUser = async ({ user }) => {
        await callApi({
          method: "POST",
          endpoint: `/api/usermanagement/users`,
          body: {
            sub: user.sub,
            email: user.email,
            family_name: user.family_name,
            given_name: user.given_name,
            picture: user.picture,
          },
        });
      };

      await createUser({ user: getUser() });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleArcadeModeOn = () => {
    setScoreboardViewMode("arcade");
    this.setState(() => ({ isArcadeMode: true }));
  };

  handleArcadeModeOff = async () => {
    setScoreboardViewMode("classic");
    this.setState(() => ({ isArcadeMode: false, dataLoading: true }));

    if (!this.state.weeks?.length) {
      await this.initializeClassicScoreboard();
    }
  };

  loadGameWeeks = async ({ leagueId, year }) => {
    const gameWeeksQuery = { leagueId, year, skipEntireWeek: true };

    const weeks = await callApi({
      method: "GET",
      endpoint: `/api/gamemanagement/gameweeks?${queryString.stringify(
        gameWeeksQuery
      )}`,
    });

    return weeks;
  };

  loadData = async ({
    weeks,
    leagueId,
    year,
    weekId,
    beginDateTime,
    endDateTime,
    showLoader = true,
  }) => {
    const user = getUser();
    const userId = get(user, "sub");

    if (showLoader) {
      this.setState({
        dataLoading: true,
      });
    }

    const query = {
      userId,
      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,
    };

    const [games = [], picks = [], teams = []] = await Promise.all([
      callApi({
        method: "GET",
        endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
      }),
      isAuthenticated
        ? callApi({
            method: "GET",
            endpoint: `/api/pickmanagement/picks?${queryString.stringify(
              query
            )}`,
          })
        : undefined,
      callApi({ method: "GET", endpoint: `/api/gamemanagement/teams?leagueId=${query?.leagueId}` }),
    ]);

    const groupedGames = getGroupedGames({
      games,
      picks,
      teams,
      spreadMode: getSpreadMode() === "1",
    });
    this.setState(() => ({
      weeks: formatWeeks(weeks),

      userId,
      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,

      games,
      picks,
      teams,

      groupedGames,
      dataLoading: false,
    }));

    this.startPolling({ games, weeks, leagueId, year, weekId, beginDateTime, endDateTime });
  };

  startPolling = ({ games, weeks, leagueId, year, weekId, beginDateTime, endDateTime }) => {
    clearInterval(this.timerID);
    this.timerID = setInterval(
      () =>
        this.poll({
          games,
          weeks,
          leagueId,
          year,
          weekId,
          beginDateTime,
          endDateTime,
        }),
      15000
    );
  };

  poll = ({
    games,
    weeks,
    leagueId,
    year,
    weekId,
    beginDateTime,
    endDateTime,
  }) => {
    const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
    if (!areAnyGamesInProgress) return;

    this.loadData({
      weeks,
      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,
      showLoader: false,
    });
  };

  handleFilterLeague = async (event) => {
    const leagueSelected = event.target.value;
    const leagueId = leagueSelected;
    const leagueFound = leagues.find((league) => league.id === leagueId);

    history.push("/scoreboards/" + leagueFound.name);

    const years = get(leagueFound, "years", []);
    const year = last(years);
    const weeks = await this.loadGameWeeks({ leagueId, year });
    const currentWeek = last(weeks);
    this.setState(() => ({ leagueId: leagueFound.id }));

    const request = {
      weeks,
      leagueId: currentWeek.leagueId,
      year,
      weekId: currentWeek._id,
      beginDateTime: currentWeek.beginDateTime,
      endDateTime: currentWeek.endDateTime,
    };

    this.loadData(request);
  };

  handleFilterYear = async (event) => {
    const yearSelected = event.target.value;
    const { leagueId } = this.state;
    const league = leagues.find((league) => league.id === leagueId);
    const yearFound = league.years.find((year) => year === yearSelected);

    const weeks = await this.loadGameWeeks({ leagueId, year: yearFound });
    const currentWeek = last(weeks);
    this.setState(() => ({ weeks, year: yearFound, weekId: currentWeek._id }));

    const request = {
      weeks,
      leagueId,
      year: yearFound,
      weekId: currentWeek._id,
      beginDateTime: currentWeek.beginDateTime,
      endDateTime: currentWeek.endDateTime,
    };

    this.loadData(request);
  };

  handleFilterWeek = (event) => {
    const weekId = event.target.value;
    const { weeks, leagueId, year } = this.state;
    const currentWeek = weeks[weekId];
    this.setState(() => ({ weekId: currentWeek._id }));

    const request = {
      weeks,
      leagueId,
      year,
      weekId: currentWeek._id,
      beginDateTime: currentWeek.beginDateTime,
      endDateTime: currentWeek.endDateTime,
    };

    this.loadData(request);
  };

  handleMakePick = (pick) => {
    const gameFound = this.state.games.find((x) => x._id === pick.gameId);
    if (!isAuthenticated || gameFound.isGameOver) return;
    const pickFound = this.state.picks.find((x) => x.gameId === pick.gameId);

    const upsertPick = async (id, pick) => {
      this.setState(() => ({ updatingPick: true }));
  
      const pickParams = queryString.stringify({ gameId:pick.gameId, pickId: pick.pickId });
  
      await callApi({
        method: id ? 'PUT' : 'POST',
        endpoint: id ? `/api/pickmanagement/picks/${encodeURIComponent(id)}` : '/api/pickmanagement/picks',
        body: pickParams
      });
  
      const user = getUser();
      const userId = get(user, "sub");
  
      const query = {
        userId,
        leagueId: this.state.leagueId,
        year: this.state.year,
        weekId: this.state.weekId,
        beginDateTime: this.state.beginDateTime,
        endDateTime: this.state.endDateTime,
      };
      const picks = await callApi({
        method: "GET",
        endpoint: `/api/pickmanagement/picks?${queryString.stringify(
          query
        )}`,
      });
      const groupedGames = getGroupedGames({
        games: this.state.games,
        picks,
        teams: this.state.teams,
        spreadMode: getSpreadMode() === "1",
      });
      this.setState(() => ({ updatingPick: false, picks, groupedGames }));
    };

    upsertPick(pickFound?._id, pick);
  };

  handleUpdateGame = (game) => {
    if (!isAuthenticated) return;

    const updateGame = async (game) => {
      const gameParams = {
        id: game.id,
        awayScore: game.awayScore,
        homeScore: game.homeScore,
        awayRank: game.awayRank,
        homeRank: game.homeRank,
        awayRecord: game.awayRecord,
        homeRecord: game.homeRecord,
        awaySpread: game.awaySpread,
        homeSpread: game.homeSpread,
        gameName: game.gameName,
        isGameOver: game.isGameOver,
        currentTime: game.currentTime,
        gameTime: game.gameTime,
        liveVideoUrl: game.liveVideoUrl,
        highlightVideoUrl: game.highlightVideoUrl,
        isHidden: game.isHidden
      };
  
      await callApi({
        method: "PUT",
        endpoint: `/api/gamemanagement/games/${encodeURIComponent(game.id)}`,
        body: gameParams
      });
    };
    
    updateGame(game);
  };

    handleSpreadToggleOn = () => {
    const value = "1";
    localStorage.setItem("spreadModeToggle", value);
    const { games, picks, teams } = this.state;
    const groupedGames = getGroupedGames({
      games,
      picks,
      teams,
      spreadMode: value === "1",
    });

    this.setState(() => ({
      groupedGames,
    }));
  };

    handleSpreadToggleOff = () => {
    const value = "0";
    localStorage.setItem("spreadModeToggle", value);
    const { games, picks, teams } = this.state;
    const groupedGames = getGroupedGames({
      games,
      picks,
      teams,
      spreadMode: value === "1",
    });

    this.setState(() => ({
      groupedGames,
    }));
  };

  render() {
    const {
      dataLoading,

      userId,

      weeks,
      games,
      picks,

      leagueId,
      year,
      weekId,

      groupedGames,

      updatingPick,

      isArcadeMode,
    } = this.state;

    if (isArcadeMode) {
      const leagueLabelRaw =
        leagues.find((l) => l.id === leagueId)?.description || getLeagueName() || "";
      const leagueLabel = String(leagueLabelRaw).toUpperCase();
      const currentWeek = weeks.find((x) => x._id === weekId);
      const weekLabel = currentWeek?.displayName || currentWeek?.description || "";

      return (
        <ArcadeMode
          isArcadeMode={isArcadeMode}
          onArcadeModeOn={this.handleArcadeModeOn}
          onArcadeModeOff={this.handleArcadeModeOff}
          leagueLabel={leagueLabel}
          year={year}
          weekLabel={weekLabel}
          games={games}
          picks={picks}
          teams={this.state.teams}
          groupedGames={groupedGames}
          updatingPick={updatingPick}
          onMakePick={this.handleMakePick}
        />
      );
    }

    const spreadMode = getSpreadMode() === "1";
    const currentWeek = weeks.find((x) => x._id === weekId);
    const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
    const areAllGamesOver = getAreAllGamesOver(games);
    const gamesNotStarted = games.filter(
      (x) => !hasGameStarted(x.startDateTime)
    );
    const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
    const picksNotSelected = getPicksNotSelected(gamesNotStarted, picks);

    gameDate = null;

    const disableTie = currentWeek?.disableTie;

    const isLoading = dataLoading && !areAnyGamesInProgress;

    return (
      <div>
        <PageContainer>
          <ArcadeModeToggle
            isArcadeMode={isArcadeMode}
            onArcadeModeOn={this.handleArcadeModeOn}
            onArcadeModeOff={this.handleArcadeModeOff}
          />
          <TinyScoreboard
            {...{
              title: `Let's Go!!!`,
              games: groupedGames.notCompleted,
              loading: isLoading,
            }}
          />
          {!isLoading && <TinyScoreboard
            {...{
              title: `Game Over`,
              games: groupedGames.completed,
              loading: isLoading,
            }}
          />}
          <GameSearchBar
            leagueId={leagueId}
            leagues={leagues}
            yearSelected={year}
            weekId={weekId}
            weeks={weeks}
            loading={isLoading}
            onFilterLeague={this.handleFilterLeague}
            onFilterYear={this.handleFilterYear}
            onFilterWeek={this.handleFilterWeek}
            onFilterDate={this.handleFilterDate}
          />
          {!isAuthenticated && (
            <Button
              variant="contained"
              style={styles.button}
              onClick={googleLogin}
            >
              Make Your Picks
            </Button>
          )}
          {isAuthenticated && (
            <div>
              <PickResult
                loading={isLoading}
                spreadMode={spreadMode}
                games={groupedGames.completed}
                picks={picks}
              />
            </div>
          )}
          {!areAllGamesOver && !areAnyGamesInProgress && (
            <div
              style={{
                margin: "4px 14%",
                padding: "4px",
                border: "4px solid deeppink",
              }}
            >
              <div style={{ color: "deeppink", fontSize: "17px" }}>
                next{" "}
                {[
                  "59723313734d1d6202a85f25",
                  "59723313734d1d6202a85f27",
                ].includes(leagueId)
                  ? "fight"
                  : "game"}{" "}
                starts in
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
              <div className="fast-flash">
                **{" "}
                {[
                  "59723313734d1d6202a85f25",
                  "59723313734d1d6202a85f27",
                ].includes(leagueId)
                  ? "fights"
                  : "games"}{" "}
                in progress **
              </div>
            </div>
          )}
          {!isAuthenticated && (
            <div
              style={{
                color: "darkviolet",
                fontSize: "17px",
                margin: "4px 17%",
                padding: "4px",
                border: "4px solid darkviolet",
                borderRadius: "8px",
              }}
            >
              ** sign in then tap{" "}
              {[
                "59723313734d1d6202a85f25",
                "59723313734d1d6202a85f27",
              ].includes(leagueId)
                ? "fighter"
                : "team"}{" "}
              **
            </div>
          )}
          <GameEngagementBar
            handleSpreadToggleOn={this.handleSpreadToggleOn}
            handleSpreadToggleOff={this.handleSpreadToggleOff}
            games={games}
            picks={picks}
            teams={this.state.teams}
            isAuthenticated={isAuthenticated}
            userId={userId}
          />
          {
            <Box
              sx={{
                position: "relative",
                zIndex: "2",
                backgroundColor: "#EFFBF8",
              }}
            >
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  position: "relative",
                  zIndex: "3",
                  backgroundColor: "#fff",
                }}
              >
                <Tabs
                  value={0}
                  aria-label="game types"
                  style={{
                    paddingBottom: "20px",
                    width: "fit-content",
                    margin: "auto",
                  }}
                >
                  <Tab style={{ color: '#000' }} label="Scores" {...a11yProps(0)} />
                </Tabs>
              </Box>
              <div style={styles.root}>
                {isLoading && (
                  <div style={{ margin: "10px 0" }}>
                    <Skeleton animation="pulse" height="5em" variant="rect" />
                    <div style={{ display: "flex" }}>
                      <Skeleton
                        style={{ margin: "20px" }}
                        animation="pulse"
                        height="10em"
                        width="50%"
                        variant="rect"
                      />
                      <Skeleton
                        style={{ margin: "20px" }}
                        animation="pulse"
                        height="10em"
                        width="50%"
                        variant="rect"
                      />
                    </div>
                  </div>
                )}
                {!isLoading &&
                  groupedGames.notCompleted.map((game) => {
                    let newGameDate = moment(get(game, "startDateTime")).format(
                      "dddd MMM D YYYY"
                    );
                    let newDate = gameDate !== newGameDate;
                    if (newDate) gameDate = newGameDate;

                    return (
                      <div key={game._id}>
                        {newDate && (
                          <div
                            style={{
                              position: "relative",
                              zIndex: 3,
                              fontFamily: "monospace",
                              backgroundColor: "rgba(0,0,0,0.87)",
                              color: "#ffffff",
                              width: "100%",
                              padding: "2px 0",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                margin: "16px 0",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              {gameDate}
                            </div>
                          </div>
                        )}
                        <Game
                          game={game}
                          pick={picks.find((x) => x.gameId === game._id)}
                          handleMakePick={this.handleMakePick}
                          handleUpdateGame={this.handleUpdateGame}
                          isAuthenticated={isAuthenticated}
                          userId={userId}
                          disableTie={disableTie}
                          updatingPick={updatingPick}
                        />
                      </div>
                    );
                  })}
                {!isLoading && (
                  <div>
                    {groupedGames.completed.length > 0 && (
                      <div
                        style={{
                          position: "relative",
                          zIndex: 10,
                          fontFamily: "monospace",
                          backgroundColor: "rgba(0,0,0,0.87)",
                          color: "#ffffff",
                          width: "100%",
                          padding: "2px 0",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            margin: "16px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          *** Game Over ***
                        </div>
                      </div>
                    )}
                    {groupedGames.completed.map((game) => {
                      let newGameDate = moment(
                        get(game, "startDateTime")
                      ).format("dddd MMM D YYYY");
                      let newDate = gameDate !== newGameDate;
                      if (newDate) gameDate = newGameDate;

                      return (
                        <div key={game._id}>
                          {newDate && (
                            <div
                              style={{
                                position: "relative",
                                zIndex: 10,
                                fontFamily: "monospace",
                                backgroundColor: "rgba(0,0,0,0.87)",
                                color: "#ffffff",
                                width: "100%",
                                padding: "2px 0",
                                marginBottom: "8px",
                              }}
                            >
                              <div
                                style={{
                                  margin: "16px 0",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                }}
                              >
                                {gameDate}
                              </div>
                            </div>
                          )}
                          <Game
                            game={game}
                            pick={picks.find((x) => x.gameId === game._id)}
                            handleMakePick={this.handleMakePick}
                            handleUpdateGame={this.handleUpdateGame}
                            isAuthenticated={isAuthenticated}
                            userId={userId}
                            disableTie={disableTie}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Box>
          }
          <RemainingGamesNotifier {...{ isAuthenticated, picksNotSelected }} />
        </PageContainer>
      </div>
    );
  }
}

export default Scoreboard;