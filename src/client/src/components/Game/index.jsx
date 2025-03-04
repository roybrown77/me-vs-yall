import { Component } from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment-timezone";
import get from "lodash/get";

import { withStyles } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import green from "@material-ui/core/colors/green";

import BasketballCourt from "./components/Fields/BasketballCourt";
import WorldFootballField from "./components/Fields/WorldFootballField";
import AmericanFootballMiniRallyGame from "./components/AmericanFootballMiniRallyGame";
import GamePlayTabs from "./components/GamePlayTabs";
import TieButton from "./components/TieButton";
import CompetitorHeader from "./components/CompetitorHeader";
import Competitor from "./components/Competitor";
import GameFooter from "./components/GameFooter";

import { hasGameStarted } from "../../utilities";

const styles = () => ({
  root: {
    flexGrow: 1,
    height: "fit-content",
  },
  game: {
    backgroundColor: "#ffffff",
    padding: "8px",
    marginBottom: "8px",
  },
  paper: {
    borderRadius: "8px",
    boxShadow: "none",
  },
  control: {
    padding: "32px",
  },
  checkBox: {
    color: green[600],
    "&$checked": {
      color: green[500],
    },
  },
  checked: {},
  startDateTime: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "rgba(0,0,0,.87)",
    marginTop: "5px",
  },
  lastPlay: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "rgba(0,0,0,.87)",
  },
  stats: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "rgba(0,0,0,.87)",
  },
  tieButton: {
    fontWeight: "700",
    marginTop: "10px",
    width: "25%",
    backgroundColor: "#3772FA",
    color: "#FFFFFF",
    borderColor: "#3772FA",
    "&:hover": {
      backgroundColor: "#3772FA",
      color: "#FFFFFF",
      borderColor: "#3772FA",
    },
  },
  gamePlayMessage: {
    fontWeight: "700",
    marginTop: "10px",
    backgroundColor: "#3772FA",
    color: "#FFFFFF",
    borderColor: "#3772FA",
    "&:hover": {
      backgroundColor: "#3772FA",
      color: "#FFFFFF",
      borderColor: "#3772FA",
    },
  },
  gameStats: {
    fontWeight: "700",
    marginTop: "10px",
    width: "25%",
    backgroundColor: "#5aa17f",
    color: "#FFFFFF",
    borderColor: "#5aa17f",
    "&:hover": {
      backgroundColor: "#5aa17f",
      color: "#FFFFFF",
      borderColor: "#5aa17f",
    },
  },
  saveButton: {
    fontWeight: "700",
    width: "25%",
    backgroundColor: "#3772FA",
    color: "#FFFFFF",
    borderColor: "#3772FA",
    "&:hover": {
      backgroundColor: "#3772FA",
      color: "#FFFFFF",
      borderColor: "#3772FA",
    },
  },
  competitorHeader: {
    minHeight: "32px",
  },
});

const getAstroPositionAndEmoji = () => {
  const now = new Date();
  const hours = now.getHours();
  const percentageOfDay = (hours - 6) / 12; // Assuming sun moves from 6 AM to 6 PM
  const position = Math.min(Math.max(percentageOfDay * 150 - 75, -75), 75); // Clamp between -75 and 75
  const isDayTime = (hours >= 6 && hours < 18);
  const emoji = isDayTime ? '☀️' : '🌙'; // Sun for day, moon for night
  return { position, emoji, isDayTime };
};

const { position: astroPosition, emoji: astroEmoji, isDayTime } = getAstroPositionAndEmoji();

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      awayScore: null,
      homeScore: null,
      awayRank: null,
      homeRank: null,
      awayRecord: null,
      homeRecord: null,
      awaySpread: null,
      homeSpread: null,
      gameName: null,
      isGameOver: null,
      currentTime: null,
      gameTime: null,
      gameDate: null,
      liveVideoUrl: null,
      highlightVideoUrl: null,
      isHidden: null,
    };
  }

  handleMakePick = (gameId, pickId) => {
    if (
      get(this.props, "pick.pickId") === pickId ||
      this.props?.updatingPick ||
      hasGameStarted(this.props.game.startDateTime)
    ) {
      return;
    }

    const pick = {
      gameId: gameId,
      pickId: pickId,
    };

    this.props.handleMakePick(pick);
  };

  handleTie = (gameId) => {
    if (
      get(this.props, "pick.pickId") === "000000000000000000000000" ||
      this.props?.updatingPick ||
      hasGameStarted(this.props.game.startDateTime)
    ) {
      return;
    }

    const pick = {
      gameId: gameId,
      pickId: "000000000000000000000000",
    };

    this.props.handleMakePick(pick);
  };

  handleClearInput = () => {
    this.setState({
      awayScore: null,
      homeScore: null,
      awayRank: null,
      homeRank: null,
      awayRecord: null,
      homeRecord: null,
      awaySpread: null,
      homeSpread: null,
      gameName: null,
      isGameOver: null,
      currentTime: null,
      gameTime: null,
      gameDate: null,
      liveVideoUrl: null,
      highlightVideoUrl: null,
      isHidden: null,
    });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleSaveGame = (gameId) => {
    if (get(this.props, "userId") !== "google-oauth2|114172296334563495985") {
      return;
    }

    const {
      awayScore,
      homeScore,
      awayRank,
      homeRank,
      awayRecord,
      homeRecord,
      awaySpread,
      isHidden,
      homeSpread,
      gameName,
      isGameOver,
      currentTime,
      gameDate,
      gameTime,
      liveVideoUrl,
      highlightVideoUrl,
    } = this.state;

    const gameTimeFormatted = gameTime
      ? (gameDate || moment().format("YYYY-MM-DD")) + " " + gameTime
      : null;

    const game = {
      id: gameId,
      awayScore,
      homeScore,
      awayRank,
      homeRank,
      awayRecord,
      homeRecord,
      awaySpread,
      homeSpread,
      gameName,
      isGameOver,
      currentTime,
      gameTime: gameTimeFormatted,
      liveVideoUrl,
      highlightVideoUrl,
      isHidden,
    };

    this.props.handleUpdateGame(game);
  };

  render() {
    const { classes, game, pick, isAuthenticated, userId, disableTie, updatingPick } =
      this.props;

    const {
      awayScore,
      homeScore,
      awayRank,
      homeRank,
      awayRecord,
      homeRecord,
      awaySpread,
      isHidden,
      homeSpread,
      gameName,
      isGameOver,
      currentTime,
      gameDate,
      gameTime,
      liveVideoUrl,
      highlightVideoUrl,
    } = this.state;

    const spreadMode = localStorage.getItem("spreadModeToggle") === "1";

    const props = {
      classes,
      game,
      pick,
      isAuthenticated,
      userId,
      disableTie,
      awayScore,
      homeScore,
      awayRank,
      homeRank,
      awayRecord,
      homeRecord,
      awaySpread,
      isHidden,
      homeSpread,
      gameName,
      isGameOver,
      currentTime,
      gameDate,
      gameTime,
      liveVideoUrl,
      highlightVideoUrl,
      spreadMode,
      handleMakePick: this.handleMakePick,
      handleTie: this.handleTie,
      handleClearInput: this.handleClearInput,
      handleInputChange: this.handleInputChange,
      handleSaveGame: this.handleSaveGame,
    };

    return (
      <div id={"game-" + game._id} key={game._id} className={classes.game}>
        {/* Game Container */}
        <div
          style={{
            zIndex: 3,
            position: "relative",
            backgroundColor: "#fff",
            paddingBottom: "20px",
          }}
        >
          {/* Game */}
          <Grid key={game._id + "-gridlist"} container className={classes.root}>
            {game.competitors.map((competitor) => (
              <Grid
                key={game._id + "." + competitor._id}
                item
                xs={6}
                onClick={() => this.handleMakePick(game._id, competitor._id)}
                className={updatingPick ? "fast-flash" : ""}
                style={{
                  border: competitor.selected
                    ? "1.5rem dashed #3772FA"
                    : "1.5rem dashed #E7E7E7",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                <Grow in={true} timeout={500}>
                  <Paper className={classNames(classes.paper)}>
                    {spreadMode 
                      && (<CompetitorHeader {...{ ...props, competitor }} />
                    )}
                    <Competitor {...{ ...props, competitor }} />
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
          {/* Tie button */}
          {
            isAuthenticated &&
            !hasGameStarted(game.startDateTime) &&
            [
              "59723313734d1d6202a85f10",
              "59723313734d1d6202a85f17",
              "59723313734d1d6202a85f25",
              "59723313734d1d6202a85f27",
              "59723313734d1d6202a85f29",
            ].includes(get(game, "leagueId")) &&
            !spreadMode &&
            !disableTie && <TieButton {...props} />
          }
          {/* Field */}
          <div style={{ marginTop: "1rem" }}>
            {
              ["59723313734d1d6202a85f10", "59723313734d1d6202a85f15", "59723313734d1d6202a85f17", "59723313734d1d6202a85f29"].includes(get(game, "leagueId")) &&
              <div style={{ display: isDayTime ? 'inline-flex' : '' }}>
                <div
                  className='sun-nudge'
                  style={{ margin: '1rem 0', marginLeft: `${astroPosition}%`}}
                >
                  {astroEmoji}
                </div>
                {
                  isDayTime &&
                  <div className='clouds' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginLeft: '2rem' }}>
                    <div className='cloud' style={{ fontSize: '2.5rem', animation: 'moveClouds 5s linear infinite' }}>☁️</div>
                    <div className='cloud' style={{ fontSize: '2rem', animation: ' moveClouds 7s linear infinite' }}>☁️</div>
                  </div>
                }
              </div>
            }
            {
              ["59723313734d1d6202a85f10", "59723313734d1d6202a85f15"].includes(get(game, "leagueId")) &&
              <AmericanFootballMiniRallyGame {...{ game, classes }} />
            }
            {
              ["59723313734d1d6202a85f17", "59723313734d1d6202a85f29"].includes(get(game, "leagueId")) &&
              <WorldFootballField
                {...{
                  away: game.competitors[0].shortLocation,
                  awayColor: game.competitors[0].color,
                  home: game.competitors[1].shortLocation,
                  homeColor: game.competitors[1].color,
                  style: { paddingTop: "16px" },
                }}
              />
            }
            {
              ["59723313734d1d6202a85f19", "59723313734d1d6202a85f31", "59723313734d1d6202a85f33", "59723313734d1d6202a85f35", "59723313734d1d6202a85f37"].includes(get(game, "leagueId")) &&
              <BasketballCourt
                {...{
                  away: game.competitors[0].shortLocation,
                  awayColor: game.competitors[0].color,
                  home: game.competitors[1].shortLocation,
                  homeColor: game.competitors[1].color,
                  style: { paddingTop: "16px" },
                }}
              />
            }
          </div>
          {/* Footer */}
          <GameFooter {...props} />
        </div>
        {/* Tabs */}
        <GamePlayTabs {...props} />
      </div>
    );
  }
}

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  spreadMode: PropTypes.bool,
  disableTie: PropTypes.bool,
  handleMakePick: PropTypes.func,
  handleUpdateGame: PropTypes.func,
  updatingPick: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(Game);
