import { Component } from "react";
import classNames from "classnames";
import ReactGA from "react-ga";
import get from "lodash/get";
import last from "lodash/last";
import moment from "moment-timezone";
import { createBrowserHistory } from "history";
import queryString from "query-string";
import URLSearchParams from 'url-search-params';

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import ToggleOn from "@material-ui/icons/ToggleOn";
import ToggleOff from "@material-ui/icons/ToggleOff";

import RemainingGamesNotifier from "./RemainingGamesNotifier";
import PageContainer from "../../components/PageContainer";
import GameSearchBar from "../../components/GameSearchBar";
import PickResult from "../../components/PickResult";
import Game from "../../components/Game";
import Countdown from "../../components/Countdown";
import Popover from "../../components/Popover";
import TinyScoreboard from "../../components/TinyScoreboard";

import { getPicksNotSelected } from "./utilities";
import a11yProps from "../../utilities/a11yProps";
import { callApi } from "../../utilities/http";
import {
    formatWeeks,
    hasGameStarted,
    getAreAllGamesOver,
    getGroupedGames,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
    leagues,
  } from "../../utilities";
import {
  googleLogin,
  isConfirmedAuthentication,
  getUser,
} from "../../middleware/authenticationClient";

import styles from "./styles";

const isAuthenticated = isConfirmedAuthentication();

const history = createBrowserHistory({ forceRefresh: false });

const getSpreadMode = () => localStorage.getItem("spreadModeToggle", "0");

let gameDate;

class Scoreboard extends Component {
  constructor(props) {
    super(props);
    const { leagueName } = this.props.match.params;
    const league = leagues.find(
      (league) =>
        get(league, "name", "nfl").toLowerCase() ===
        (leagueName || "").toLowerCase()
    );
    const leagueId = league.id;
    const year = last(league.years);

    this.state = {
      openCopyAlert: false,

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

      updatingPick: false
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

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

      this.startPolling();
    }

    if (isAuthenticated) {
      await this.createUser({ user: getUser() });
    }

    const league = leagues.find((league) => league.id === leagueId);
    ReactGA.ga("send", "pageview", "/scoreboards/" + league.name);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  loadGameWeeks = async ({ leagueId, year }) => {
    const gameWeeksQuery = { leagueId, year };

    const weeks = await callApi({
      method: "GET",
      endpoint: `/api/gamemanagement/gameweeks?${queryString.stringify(
        gameWeeksQuery
      )}`,
    });

    return weeks;
  };

  updateGame = async (game) => {
    const gameParams = new URLSearchParams();
    gameParams.set('id', game.id);
    gameParams.set('awayScore', game.awayScore);
    gameParams.set('homeScore', game.homeScore);
    gameParams.set('awayRank', game.awayRank);
    gameParams.set('homeRank', game.homeRank);
    gameParams.set('awayRecord', game.awayRecord);
    gameParams.set('homeRecord', game.homeRecord);
    gameParams.set('awaySpread', game.awaySpread);
    gameParams.set('homeSpread', game.homeSpread);
    gameParams.set('gameName', game.gameName);
    gameParams.set('isGameOver', game.isGameOver);
    gameParams.set('currentTime', game.currentTime);
    gameParams.set('gameTime', game.gameTime);
    gameParams.set('liveVideoUrl', game.liveVideoUrl);
    gameParams.set('highlightVideoUrl', game.highlightVideoUrl);
    gameParams.set('isHidden', game.isHidden);

    await callApi({
      method: "PUT",
      endpoint: `/api/gamemanagement/games/${encodeURIComponent(game.id)}`,
      body: gameParams
    });
  };

  upsertPick = async (id, pick) => {
    this.setState(() => ({ updatingPick: true }));

    const pickParams = new URLSearchParams();
    pickParams.set('gameId', pick.gameId);
    pickParams.set('pickId', pick.pickId);

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

  createUser = async ({ user }) => {
    await callApi({
      method: "GET",
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
      callApi({ method: "GET", endpoint: `/api/gamemanagement/teams` }),
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
  };

  startPolling = () => {
    clearInterval(this.timerID);
    const { games, weeks, leagueId, year, weekId, beginDateTime, endDateTime } =
      this.state;
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

    ReactGA.ga("send", "pageview", "/leaders/" + leagueFound.name);
    history.push("/leaders/" + leagueFound.name);

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

  handleSpreadToggle = () => {
    const value = getSpreadMode() === "1" ? "0" : "1";
    localStorage.setItem("spreadModeToggle", value);
    const { games, picks, teams } = this.state;
    const groupedGames = getGroupedGames({
      games,
      picks,
      teams,
      spreadMode: value === "1",
    });
    this.setState({ groupedGames });
  };

  handleMakePick = (pick) => {
    const gameFound = this.state.games.find((x) => x._id === pick.gameId);
    if (!isAuthenticated || gameFound.isGameOver) return;
    const pickFound = this.state.picks.find((x) => x.gameId === pick.gameId);
    this.upsertPick(pickFound?._id, pick);
  };

  handleUpdateGame = (game) => {
    if (!isAuthenticated) return;
    this.updateGame(game);
  };

  handleSharePicks = () => {
    const copyText = document.getElementById("copyInput");

    copyText.select();

    /* for mobile devices */
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");

    this.setState((state) => ({
      openCopyAlert: true,
    }));
  };

  handleCopyAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState((state) => ({
      openCopyAlert: false,
    }));
  };

  render() {
    const { classes } = this.props;

    const {
      dataLoading,

      userId,

      weeks,
      games,
      picks,

      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,

      groupedGames,

      updatingPick,
    } = this.state;
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

    return (
      <div>
        <PageContainer>
          <TinyScoreboard
            {...{
              title: `Let's Go!!!`,
              games: groupedGames.notCompleted,
              loading: dataLoading && !areAnyGamesInProgress,
            }}
          />
          <TinyScoreboard
            {...{
              title: `Game Over`,
              games: groupedGames.completed,
              loading: dataLoading && !areAnyGamesInProgress,
            }}
          />
          <GameSearchBar
            leagueId={leagueId}
            leagues={leagues}
            yearSelected={year}
            weekId={weekId}
            weeks={weeks}
            beginDateTime={beginDateTime}
            endDateTime={endDateTime}
            onFilterLeague={this.handleFilterLeague}
            onFilterYear={this.handleFilterYear}
            onFilterWeek={this.handleFilterWeek}
            onFilterDate={this.handleFilterDate}
          />
          {!isAuthenticated && (
            <Button
              variant="contained"
              className={classNames(classes.button)}
              onClick={googleLogin}
            >
              Make Your Picks
            </Button>
          )}
          {isAuthenticated && (
            <div className={classNames(classes.pickResultContainer)}>
              <PickResult
                loading={dataLoading && !areAnyGamesInProgress}
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
          {get(currentWeek, "prize") && (
            <Popover
              borderStyle={{
                margin: "4px 14%",
                border: "4px solid lightgreen",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              titleStyle={{
                color: "darkgreen",
                fontSize: "17px",
                borderBottom: "3px solid lightgreen",
                padding: "4px",
              }}
              subTitleStyle={{
                color: "darkgreen",
                fontSize: "17px",
                borderTop: "3px solid lightgreen",
                padding: "4px",
              }}
              title={"player with the most correct wins!"}
              subTitle={"tap to view rules."}
              segments={get(currentWeek, "prizes")}
            >
              {
                <div style={{ padding: "16px" }}>
                  <div style={{ paddingBottom: "12px" }}>
                    {get(currentWeek, "prize.message")}
                  </div>
                  {get(currentWeek, "prize.rules", []).map(
                    (rule, ruleIndex) => {
                      return <div key={ruleIndex}>{rule}</div>;
                    }
                  )}
                </div>
              }
            </Popover>
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
          <div
            onClick={this.handleSpreadToggle}
            style={{
              marginTop: "25px",
              padding: "10px",
              marginLeft: "auto",
              textAlign: "right",
              backgroundColor: "#fff",
              width: "40px",
            }}
          >
            <div style={{ fontSize: "9px" }}>vs Spread</div>
            <div>
              <IconButton
                className={
                  spreadMode ? classes.toggleButtonOn : classes.toggleButtonOff
                }
                aria-label="spreadModeToggle"
              >
                {spreadMode ? <ToggleOn /> : <ToggleOff />}
              </IconButton>
            </div>
          </div>
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
                  <Tab label="Scores" {...a11yProps(0)} />
                </Tabs>
              </Box>
              <div className={classes.root}>
                {!areAnyGamesInProgress && dataLoading && (
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
                {!(!areAnyGamesInProgress && dataLoading) &&
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
                {!(!areAnyGamesInProgress && dataLoading) && (
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

export default withStyles(styles, { withTheme: true })(Scoreboard);