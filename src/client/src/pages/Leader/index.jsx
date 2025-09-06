import { Component } from 'react';
import get from "lodash/get";
import last from "lodash/last";
import { createBrowserHistory } from "history";
import queryString from "query-string";

import Slide from "@mui/material/Slide";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from '@mui/material/Snackbar';
import Send from '@mui/icons-material/Send';
import ToggleOn from "@mui/icons-material/ToggleOn";
import ToggleOff from "@mui/icons-material/ToggleOff";

import VegasWinCalculationPopup from "./VegasWinCalculationPopup";
import PageContainer from "../../components/PageContainer";
import GameSearchBar from "../../components/GameSearchBar";
import Countdown from "../../components/Countdown";
import Alert from '../../components/Alert';
import CalendarReminder from '../../components/CalendarReminder';

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
  getCopiedGamesToShare,
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

const leaderBackgroundColor = [
  "#CC8E91",
  "#CCB08E",
  "#CCCB8E",
  "#8ECC9E",
  "#8EB5CC",
  "#B08EB8",
  "#9A7FCC",
  "#8EC1CC",
  "#C2C191",
  "#C99E89",
  "#7FC3C1",
  "#90C6A2",
  "#C9B496",
  "#CC9EB1",
  "#A19FCC",
  "#B2C79D",
  "#CCC78E",
  "#A89ECC",
  "#CCB27F",
  "#9CCEAF"
];

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

      isShareClicked: false
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
      callApi({ method: "GET", endpoint: `/api/gamemanagement/teams?leagueId=${query?.leagueId}` }),
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

  handleShareGames = () => {
    const { games, picks, teams } = this.state;

    const user = getUser();
    const userId = get(user, "sub");

    const gamesToShare = getCopiedGamesToShare(games, picks, teams, isAuthenticated, userId);

    // Create a temporary text area element
    const textArea = document.createElement('textarea');
    textArea.value = gamesToShare;

    // Append the text area to the document
    document.body.appendChild(textArea);

    // Select the text in the text area
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the temporary text area
    document.body.removeChild(textArea);

    this.setState(() => ({
      isShareClicked: true
    }));
  };

  handleGamesCopiedAlertClose = () => {
    this.setState(() => ({
      isShareClicked: false
    }));
  };

  render() {
    const {
      dataLoading,

      weeks,
      games,

      leagueId,
      year,
      weekId,

      leaders,

      isShareClicked,
    } = this.state;
    const spreadMode = getSpreadMode() === "1";
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
              style={styles.button}
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
          <div style={{ display: 'flex' }}>
            <CalendarReminder />
            {
              document.queryCommandSupported('copy') && 
              <div
                style={{
                  marginTop: "25px",
                  padding: "10px",
                  backgroundColor: "#fff",
                }}
              >
                <div style={{ fontSize: "9px", fontWeight: 700 }}>Share {isAuthenticated ? 'Picks': 'Games'}</div>
                <div style={{ background: '#B3E6CA', margin: '5px', borderRadius: '8px' }}>
                  <IconButton
                    className={isShareClicked ? "fly-plane" : "" }
                    style={{color: 'black'}}
                    aria-label={isAuthenticated ? 'share picks': 'share games'}
                  >
                    <Send onClick={this.handleShareGames} style={{ WebkitTransform: 'rotate(-45deg)', transform: 'rotate(-45deg)' }}/>
                  </IconButton>
                  <Snackbar open={isShareClicked} style={{ color: '#FFD700'}} autoHideDuration={7000} onClose={this.handleGamesCopiedAlertClose}>
                    <Alert severity="success" onClose={this.handleGamesCopiedAlertClose} style={{ backgroundColor: '#B3E6CA', color: '#000000', font: 'bold 14px monospace' }}>
                      {isAuthenticated ? 'Picks are copied and ready to share with your friends around the world!' : 'Games are copied and ready to share with your friends around the world!'}
                    </Alert>
                  </Snackbar>
                </div>
              </div>
            }
            <div
              onClick={this.handleSpreadToggle}
              style={{
                marginTop: "25px",
                padding: "10px",
                backgroundColor: "#fff",
                marginLeft: !document.queryCommandSupported('copy') ? 'auto' : undefined
              }}
            >
              <div style={{ fontSize: "9px", fontWeight: 700 }}>vs Spread</div>
              <div style={{ background: '#FCE385', margin: '5px', borderRadius: '8px' }}>
                <IconButton
                  style={
                    spreadMode ? styles.toggleButtonOn : styles.toggleButtonOff
                  }
                  aria-label="toggle spread mode"
                >
                  {spreadMode ? <ToggleOn /> : <ToggleOff />}
                </IconButton>
              </div>
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
                  <Tab style={{ color: '#000' }} label="Leaders" {...a11yProps(0)} />
                </Tabs>
              </Box>
              <Slide
                direction={"up"}
                in={true}
                mountOnEnter
                unmountOnExit
                timeout={250}
              >
                <div style={styles.root}>
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
                      <div style={styles.container} key={leader.id}>
                        <Accordion
                          style={{ borderRadius: "8px", boxShadow: "none" }}
                        >
                          <AccordionSummary
                            style={styles.expansionSummary}
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
                                    top: '-11px',
                                    transform: 'rotate(-30deg)',
                                    left: '55px',
                                    zIndex: '777'
                                  }}
                                  >
                                    👑
                                  </div>}
                                  <img
                                    style={styles.userPicture}
                                    src={leader.picture}
                                    alt=""
                                  />
                                </div>
                              )}
                              {!leader.picture && (
                                <div
                                  style={{
                                    ...styles.userDefaultPictureContainer,
                                    backgroundColor: leaderBackgroundColor[Math.floor(Math.random() * leaderBackgroundColor.length)],
                                  }}
                                >
                                  <div style={{ margin: "10px 15px" }}>
                                    {leader.userName[0]}
                                  </div>
                                </div>
                              )}
                              <div style={styles.userName}>
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
                                {false && areAnyGamesInProgress && (
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
                                    fontSize: "1rem",
                                  }}
                                >
                                  {`${
                                    leader.winsInARow > leader.lossesInARow
                                      ? (leader.wins >= 7 && leader.losses === 0 ? "🤩" : "😅")
                                      : "🥶"
                                  }x${
                                    leader.winsInARow || leader.lossesInARow
                                  }`}
                                </div>
                              </div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails
                            style={styles.expansionPanelDetails}
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

export default Leader;