import { useState } from 'react';
import PropTypes from "prop-types";
import moment from "moment-timezone";
import get from "lodash/get";

import Grow from "@mui/material/Grow";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import BasketballCourt from "./components/Fields/BasketballCourt";
import WorldFootballField from "./components/Fields/WorldFootballField";
import AmericanFootballMiniRallyGame from "./components/AmericanFootballMiniRallyGame";
import BaseballField from "./components/Fields/BaseballField";
import BoxingRing from "../../styles/images/boxing_ring.png";

import GamePlayTabs from "./components/GamePlayTabs";
import TieButton from "./components/TieButton";
import CompetitorHeader from "./components/CompetitorHeader";
import Competitor from "./components/Competitor";
import GameFooter from "./components/GameFooter";

import { hasGameStarted } from "../../utilities";

const styles = {
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
  // Other styles...
};

const getAstroPositionAndEmoji = () => {
  const now = new Date();
  const hours = now.getHours();
  const percentageOfDay = (hours - 6) / 12;
  const position = Math.min(Math.max(percentageOfDay * 150 - 75, -75), 75);
  const isDayTime = true; // hours >= 6 && hours < 18;
  const emoji = isDayTime ? '☀️' : '🌑✨';
  return { position, emoji, isDayTime };
};

const hypeText = "Let's Get Ready to Rumble!";

const Game = (props) => {
  const [state, setState] = useState({
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

  const { position: astroPosition, emoji: astroEmoji, isDayTime } = getAstroPositionAndEmoji();

  const handleMakePick = (gameId, pickId) => {
    if (
      get(props, "pick.pickId") === pickId ||
      props?.updatingPick ||
      hasGameStarted(props.game.startDateTime)
    ) {
      return;
    }

    const pick = { gameId, pickId };
    props.handleMakePick(pick);
  };

  const handleTie = (gameId) => {
    if (
      get(props, "pick.pickId") === "000000000000000000000000" ||
      props?.updatingPick ||
      hasGameStarted(props.game.startDateTime)
    ) {
      return;
    }

    const pick = { gameId, pickId: "000000000000000000000000" };
    props.handleMakePick(pick);
  };

  const handleClearInput = () => {
    setState({
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

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveGame = (gameId) => {
    if (get(props, "userId") !== "google-oauth2|114172296334563495985") {
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
    } = state;

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

    props.handleUpdateGame(game);
  };

  const {
    game,
    pick,
    isAuthenticated,
    userId,
    disableTie,
    updatingPick,
  } = props;

  const spreadMode = localStorage.getItem("spreadModeToggle") === "1";

  const componentProps = {
    ...props,
    ...state,
    spreadMode,
    handleMakePick,
    handleTie,
    handleClearInput,
    handleInputChange,
    handleSaveGame,
  };

  return (
    <div id={"game-" + game._id} key={game._id} style={styles.game}>
      <div
        style={{
          zIndex: 3,
          position: "relative",
          backgroundColor: "#fff",
          paddingBottom: "20px",
        }}
      >
        <Grid key={game._id + "-gridlist"} container style={styles.root}>
          {game.competitors.map((competitor) => (
            <Grid
              key={game._id + "." + competitor._id}
              item
              xs={6}
              onClick={() => handleMakePick(game._id, competitor._id)}
              className={updatingPick ? "fast-flash" : ""}
              style={{
                width: "50%",
                border: competitor.selected
                  ? "1.5rem dashed #3772FA"
                  : "1.5rem dashed #E7E7E7",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <Grow in={true} timeout={500}>
                <Paper style={styles.paper}>
                  {spreadMode && (
                    <CompetitorHeader {...{ ...componentProps, competitor }} />
                  )}
                  <Competitor {...{ ...componentProps, competitor }} />
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
        {isAuthenticated &&
          !hasGameStarted(game.startDateTime) &&
          [
            "59723313734d1d6202a85f10",
            "59723313734d1d6202a85f17",
            "59723313734d1d6202a85f25",
            "59723313734d1d6202a85f27",
            "59723313734d1d6202a85f29",
          ].includes(get(game, "leagueId")) &&
          !spreadMode &&
          !disableTie && <TieButton {...componentProps} />}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: isDayTime ? "inline-flex" : "" }}>
            <div
              className={isDayTime ? "sun-nudge" : ""}
              style={{ margin: "1rem 0", marginLeft: `${astroPosition}%` }}
            >
              {astroEmoji}
            </div>
            {isDayTime && (
              <div
                className="clouds"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  marginLeft: "2rem",
                }}
              >
                <div
                  className="cloud"
                  style={{
                    fontSize: "2.5rem",
                    animation: "moveClouds 5s linear infinite",
                  }}
                >
                  ☁️
                </div>
                <div
                  className="cloud"
                  style={{
                    fontSize: "2rem",
                    animation: " moveClouds 7s linear infinite",
                  }}
                >
                  ☁️
                </div>
              </div>
            )}
          </div>
          {["59723313734d1d6202a85f10", "59723313734d1d6202a85f15"].includes(
            get(game, "leagueId")
          ) && <AmericanFootballMiniRallyGame {...{ game }} />}
          {["59723313734d1d6202a85f17", "59723313734d1d6202a85f29"].includes(
            get(game, "leagueId")
          ) && (
            <WorldFootballField
              {...{
                away: game.competitors[0].shortLocation,
                awayColor: game.competitors[0].color,
                home: game.competitors[1].shortLocation,
                homeColor: game.competitors[1].color,
                style: { paddingTop: "16px" },
              }}
            />
          )}
          {[
            "59723313734d1d6202a85f19",
            "59723313734d1d6202a85f31",
            "59723313734d1d6202a85f33",
            "59723313734d1d6202a85f35",
            "59723313734d1d6202a85f37",
          ].includes(get(game, "leagueId")) && (
            <BasketballCourt
              {...{
                away: game.competitors[0].shortLocation,
                awayColor: game.competitors[0].color,
                home: game.competitors[1].shortLocation,
                homeColor: game.competitors[1].color,
                style: { paddingTop: "16px" },
              }}
            />
          )}
          {["59723313734d1d6202a85f21"].includes(get(game, "leagueId")) && (
            <>
              <BaseballField {...{ game }} />
            </>
          )}
          {["59723313734d1d6202a85f25"].includes(get(game, "leagueId")) && (
            <div
              style={{
                backgroundImage: `url(${BoxingRing})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: "20em",
                marginTop: "1rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20em",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: `${(game.competitors[0].name.length + game.competitors[1].name.length) * .01}em`,
                  color: "#fff",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              >
                <div>
                  {game.competitors[0].name}
                </div>
                <div> vs </div>
                <div>
                  {game.competitors[1].name}
                </div>
                <div style={{ fontSize: "5em", marginTop: "1em" }}>
                  {hypeText}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "35%",
                  fontSize: "3rem",
                  transform: "rotate(180deg) scaleY(-1)",
                }}
              >
                🥊
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "35%",
                  fontSize: "3rem",
                }}
              >
                🥊
              </div>
            </div>
          )}
        </div>
        <GameFooter {...componentProps} />
      </div>
      <GamePlayTabs {...componentProps} />
    </div>
  );
};

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

export default Game;
