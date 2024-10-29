import { Component } from 'react';
import classNames from "classnames";
import get from "lodash/get";
import last from "lodash/last";
import { createBrowserHistory } from "history";
import queryString from "query-string";

import { withStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import ToggleOn from "@material-ui/icons/ToggleOn";
import ToggleOff from "@material-ui/icons/ToggleOff";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import VegasWinCalculationPopup from "./VegasWinCalculationPopup";
import PageContainer from "../../components/PageContainer";
import GameSearchBar from "../../components/GameSearchBar";
import Countdown from "../../components/Countdown";
import Popover from "../../components/Popover";

import a11yProps from "../../utilities/a11yProps";
import { callApi } from "../../utilities/http";
import { getLeagueName } from '../../utilities/getLeagueName';
import {
  formatWeeks,
  getAreAllGamesOver,
  getAreAnyGamesInProgress,
  getLeagueStartDateTime,
  getLeaders,
  leagues,
} from "../../utilities";
import {
  googleLogin,
  isConfirmedAuthentication,
} from "../../utilities/authenticationClient";

import styles from "./styles";

const isAuthenticated = isConfirmedAuthentication();

const history = createBrowserHistory({ forceRefresh: false });

const getSpreadMode = () => localStorage.getItem("spreadModeToggle", "0");

class Leader extends Component {
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
      users: [],
      teams: [],

      leagueId,
      year,
      weekId: null,
      beginDateTime: null,
      endDateTime: null,

      leaders: [],
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
    }

    const league = leagues.find((league) => league.id === leagueId);
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

  loadData = async ({
    weeks,
    leagueId,
    year,
    weekId,
    beginDateTime,
    endDateTime,
    showLoader = true,
  }) => {
    if (showLoader) {
      this.setState({
        dataLoading: true,
      });
    }

    const query = {
      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,

      includeStrategies: true,
    };

    const [games = [], picks = [], users = [], teams = []] = await Promise.all([
      callApi({
        method: "GET",
        endpoint: `/api/gamemanagement/games?${queryString.stringify(query)}`,
      }),
      callApi({
        method: "GET",
        endpoint: `/api/pickmanagement/picks?${queryString.stringify(query)}`,
      }),
      callApi({
        method: "GET",
        endpoint: `/api/usermanagement/users?${queryString.stringify(query)}`,
      }),
      callApi({ method: "GET", endpoint: `/api/gamemanagement/teams` }),
    ]);

    const leaders = getLeaders({
      games,
      picks,
      users,
      teams,
      spreadMode: getSpreadMode() === "1",
    });
    this.setState(() => ({
      weeks: formatWeeks(weeks),

      leagueId,
      year,
      weekId,
      beginDateTime,
      endDateTime,

      games,
      picks,
      users,
      teams,

      leaders,
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
    const { games, picks, users, teams } = this.state;
    const spreadToggleLeaders = getLeaders({
      games,
      picks,
      users,
      teams,
      spreadMode: value === "1",
    });
    this.setState({ leaders: spreadToggleLeaders });
  };

  render() {
    const { classes } = this.props;
    const {
      dataLoading,

      weeks,
      games,

      leagueId,
      year,
      weekId,

      leaders,
    } = this.state;
    const spreadMode = getSpreadMode() === "1";
    const currentWeek = weeks.find((x) => x._id === weekId);
    const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
    const areAllGamesOver = getAreAllGamesOver(games);
    const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);

    const leaderSummaryPadding = (areAnyGamesInProgress ? .5 : 0) + (spreadMode ? .5 : 0);

    const isLoading = dataLoading && !areAnyGamesInProgress;

    return (
      <div>
        <PageContainer>
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
              className={classNames(classes.button)}
              onClick={googleLogin}
            >
              Make Your Picks
            </Button>
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
              backgroundColor: "#fff",
              width: "57px",
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
                backgroundColor: "#fff",
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
                  <Tab label="Leaders" {...a11yProps(0)} />
                </Tabs>
              </Box>
              <Slide
                direction={"up"}
                in={true}
                mountOnEnter
                unmountOnExit
                timeout={250}
              >
                <div className={classes.root}>
                  {isLoading && (
                    <div style={{ margin: "10px 0" }}>
                      <Skeleton
                        style={{ margin: "10px 0 0 0" }}
                        animation="pulse"
                        height="5em"
                        variant="rect"
                      />
                      <Skeleton
                        style={{ margin: "10px 0 0 0" }}
                        animation="pulse"
                        height="5em"
                        variant="rect"
                      />
                      <Skeleton
                        style={{ margin: "10px 0 0 0" }}
                        animation="pulse"
                        height="5em"
                        variant="rect"
                      />
                    </div>
                  )}
                  {!isLoading &&
                    leaders.map((leader, index) => (
                      <div className={classes.container} key={leader.id}>
                        <Accordion
                          style={{ borderRadius: "8px", boxShadow: "none" }}
                        >
                          <AccordionSummary
                            className={classes.expansionSummary}
                            expandIcon={<ExpandMoreIcon />}
                            styles={{ }}
                          >                     
                            <div style={{ display: "flex", paddingBottom: `${leaderSummaryPadding + (leader.percentage ? 1 : 0)}rem` }}>
                              {leader.medal && (
                                <div style={{ margin: "auto 10px auto 0" }}>
                                  <img
                                    style={{ width: "40px" }}
                                    src={leader.medal}
                                    alt=""
                                  />
                                </div>
                              )}
                              {![1, 2, 3].includes(index + 1) &&
                                !leader.medal && (
                                  <div
                                    style={{
                                      margin: "auto 10px auto 0",
                                      color: index === 0 ? "#FFC107" : "#000",
                                      fontWeight: index === 0 ? "700" : "400",
                                    }}
                                  >
                                    {index + 1}
                                  </div>
                                )}
                              {leader.picture && (
                                <div style={{ margin: "auto" }}>
                                  {index === 0 && <div style={{
                                    fontSize: '2rem',
                                    position: 'absolute',
                                    top: '-10px',
                                    transform: 'rotate(-30deg)',
                                    left: '55px',
                                  }}
                                  >
                                    👑
                                  </div>}
                                  <img
                                    className={classes.userPicture}
                                    src={leader.picture}
                                    alt=""
                                  />
                                </div>
                              )}
                              {!leader.picture && (
                                <div
                                  className={
                                    classes.userDefaultPictureContainer
                                  }
                                  style={{
                                    backgroundColor:
                                      "#" +
                                      Math.floor(
                                        Math.random() * 16777215
                                      ).toString(16),
                                  }}
                                >
                                  <div style={{ margin: "10px 15px" }}>
                                    {leader.userName[0]}
                                  </div>
                                </div>
                              )}
                              <div className={classes.userName}>
                                {leader.userName}
                              </div>
                            </div>
                            <div style={{ display: "inline-flex" }}>
                              <div
                                style={{
                                  textAlign: "right",
                                  position: "absolute",
                                  right: "50px",
                                  fontSize: "14px",
                                }}
                              >
                                {areAnyGamesInProgress && (
                                  <div style={{ color: "gray" }}>
                                    {leader.winsBeforeGameOver} -{" "}
                                    {leader.lossesBeforeGameOver}
                                  </div>
                                )}
                                {spreadMode && (
                                  <VegasWinCalculationPopup {...{ leader }} />
                                )}
                                <div>{leader.percentage}</div>
                                <div>
                                  {leader.wins} - {leader.losses}
                                </div>
                                <div
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "15px",
                                  }}
                                >
                                  {`${
                                    leader.winsInARow > leader.lossesInARow
                                      ? "😅"
                                      : "🥶"
                                  }x${
                                    leader.winsInARow || leader.lossesInARow
                                  }`}
                                </div>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails
                            className={classes.expansionPanelDetails}
                          >
                            <div style={{ margin: "12px auto" }}>
                              {spreadMode && (
                                <VegasWinCalculationPopup
                                  {...{
                                    title: "in Vegas you would have won: ",
                                    leader,
                                    showInfo: true,
                                  }}
                                />
                              )}
                              <table
                                style={{
                                  width: "100%",
                                  backgroundColor: "#fff",
                                }}
                              >
                                {get(leader, "games", []).map(
                                  (game) => {
                                    return (
                                      <tbody key={leader.id + "-" + game._id}>
                                        {game.isNewDate && (
                                          <tr>
                                            <td align="center"></td>
                                            <td align="center"></td>
                                            <td align="center">
                                              <div
                                                style={{
                                                  margin: "12px 0",
                                                  fontWeight: "600",
                                                  color: "rgba(0, 0, 0, 0.87)",
                                                }}
                                              >
                                                {game.date}
                                              </div>
                                            </td>
                                            <td align="center"></td>
                                            <td align="center"></td>
                                          </tr>
                                        )}
                                        <tr>
                                          <td align="center">
                                            <div
                                              style={{
                                                width: "24px",
                                                height: "24px",
                                                backgroundColor:
                                                  game.awayIndicator,
                                              }}
                                            />
                                          </td>
                                          {
                                            <td align="center">
                                              <span>{game.awayScore}</span>
                                            </td>
                                          }
                                          <td align="center">
                                            <span>{game.awayTeam}</span>
                                            <span> vs </span>
                                            <span>{game.homeTeam}</span>
                                          </td>
                                          {
                                            <td align="center">
                                              <span>{game.homeScore}</span>
                                            </td>
                                          }
                                          <td align="center">
                                            <div
                                              style={{
                                                width: "24px",
                                                height: "24px",
                                                backgroundColor:
                                                  game.homeIndicator,
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    );
                                  }
                                )}
                              </table>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    ))}
                </div>
              </Slide>
            </Box>
          }
        </PageContainer>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Leader);