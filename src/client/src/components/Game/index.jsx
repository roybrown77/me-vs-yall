import { useEffect, useState } from 'react';
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
import MMARing from "../../styles/images/mma_ring.png";

import GamePlayTabs from "./components/GamePlayTabs";
import TieButton from "./components/TieButton";
import CompetitorHeader from "./components/CompetitorHeader";
import Competitor from "./components/Competitor";
import GameFooter from "./components/GameFooter";

import { hasGameStarted } from "../../utilities";
import {
  isConfirmedAuthentication,
} from "../../utilities/authenticationClient";
import {
  SCORE_GUESS_BUMPS,
  GAME_OF_THE_WEEK_BASE_BONUS,
  GAME_OF_THE_WEEK_SCORE_GUESS_MULTIPLIER,
} from "../../utilities/scoreGuess";
import MMAGlove from "./components/MMAGlove";

const styles = {
  root: {
    flexGrow: 1,
    height: "fit-content",
  },
  game: {
    backgroundColor: "#ffffff",
    padding: "8px",
  },
  paper: {
    borderRadius: "8px",
    boxShadow: "none",
  },
};

const getAstroPositionAndEmoji = () => {
  const now = new Date();
  const hours = now.getHours();
  const percentageOfDay = (hours - 6) / 12;
  const position = Math.min(Math.max(percentageOfDay * 150 - 75, -75), 75);
  const isDayTime = hours >= 7 && hours < 19;
  const emoji = isDayTime ? '☀️' : '🌕';
  return { position, emoji, isDayTime };
};

const boxingHypeText = "Let's Get Ready to Rumble!";
const mmaHypeText = "It's Time!";
const TIE_PICK_ID = "000000000000000000000000";
const getScoreGuessBoostRows = (multiplier = 1) => [
  { diff: "0", points: SCORE_GUESS_BUMPS.exact * multiplier },
  { diff: "1", points: SCORE_GUESS_BUMPS.within1 * multiplier },
  { diff: "2", points: SCORE_GUESS_BUMPS.within2 * multiplier },
  { diff: "3", points: SCORE_GUESS_BUMPS.within3 * multiplier },
];

const Game = (props) => {
  const unauthenticatedPickMessage = 'Please sign in to make your picks. You got this! 🚀';

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
    isGameOfTheWeek: Boolean(get(props, "game.isGameOfTheWeek")),
    popoverOpen: false,
    popoverMessage: '',
    selectionMade: null,
    guessedAwayScore: get(props, "pick.guessedAwayScore") ?? "",
    guessedHomeScore: get(props, "pick.guessedHomeScore") ?? "",
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      guessedAwayScore: get(props, "pick.guessedAwayScore") ?? "",
      guessedHomeScore: get(props, "pick.guessedHomeScore") ?? "",
    }));
  }, [props.pick]);

  const { position: astroPosition, emoji: astroEmoji, isDayTime } = getAstroPositionAndEmoji();

  const showPopoverMessage = (message, timeoutMs = 3000) => {
    setState((prevState) => ({
      ...prevState,
      popoverOpen: true,
      popoverMessage: message,
    }));

    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        popoverOpen: false,
        popoverMessage: '',
      }));
    }, timeoutMs);
  };

  const getParsedScoreGuessValues = () => {
    const away = state.guessedAwayScore === "" ? undefined : parseInt(state.guessedAwayScore, 10);
    const home = state.guessedHomeScore === "" ? undefined : parseInt(state.guessedHomeScore, 10);

    return {
      guessedAwayScore: Number.isNaN(away) ? undefined : away,
      guessedHomeScore: Number.isNaN(home) ? undefined : home,
    };
  };

  const shouldResetScoreGuessForPick = (nextPickId) => {
    const { guessedAwayScore, guessedHomeScore } = getParsedScoreGuessValues();

    if (guessedAwayScore === undefined || guessedHomeScore === undefined) {
      return false;
    }

    const awayCompetitorId = get(game, "competitors.0._id");
    const homeCompetitorId = get(game, "competitors.1._id");

    if (!awayCompetitorId || !homeCompetitorId) {
      return false;
    }

    const scoreGuessPickId =
      guessedAwayScore === guessedHomeScore
        ? TIE_PICK_ID
        : guessedAwayScore > guessedHomeScore
        ? awayCompetitorId
        : homeCompetitorId;

    return scoreGuessPickId !== nextPickId;
  };

  const handleMakePick = (game, pickId, competitorIndex, forceUpdate = false) => {
    setState((prevState) => ({
      ...prevState,
      selectionMade: competitorIndex === 0 ? 'left' : competitorIndex === 1 ? 'right' : 'left',
    }));

    const isAuthenticated = isConfirmedAuthentication();

    if (!isAuthenticated || hasGameStarted(game.startDateTime) || game.isGameOver) {
      if (hasGameStarted(game.startDateTime) && !game.isGameOver) {
        showPopoverMessage('Game is in progress.  Get your popcorn and chill. 🍿');
      }
      if (game.isGameOver) {
        showPopoverMessage('The game is over.  Set your alarm earlier next time. ⏰');
      }
      if (!isAuthenticated) {
        showPopoverMessage(unauthenticatedPickMessage);
      }
      return;
    }

    if (
      (get(props, "pick.pickId") === pickId && !forceUpdate) ||
      props?.updatingPick ||
      hasGameStarted(props.game.startDateTime)
    ) {
      return;
    }

    const shouldResetScoreGuess = !forceUpdate && shouldResetScoreGuessForPick(pickId);
    const parsedGuess = getParsedScoreGuessValues();

    if (shouldResetScoreGuess) {
      setState((prevState) => ({
        ...prevState,
        guessedAwayScore: "",
        guessedHomeScore: "",
      }));

      showPopoverMessage("Score guess cleared because it conflicted with your new pick.", 2300);
    }

    const pick = {
      gameId: game._id,
      pickId,
      guessedAwayScore: shouldResetScoreGuess ? undefined : parsedGuess.guessedAwayScore,
      guessedHomeScore: shouldResetScoreGuess ? undefined : parsedGuess.guessedHomeScore,
    };
    props.handleMakePick(pick);
  };

  const handleTie = (gameId) => {
    if (
      get(props, "pick.pickId") === TIE_PICK_ID ||
      props?.updatingPick ||
      hasGameStarted(props.game.startDateTime)
    ) {
      return;
    }

    const shouldResetScoreGuess = shouldResetScoreGuessForPick(TIE_PICK_ID);
    const parsedGuess = getParsedScoreGuessValues();

    if (shouldResetScoreGuess) {
      setState((prevState) => ({
        ...prevState,
        guessedAwayScore: "",
        guessedHomeScore: "",
      }));

      showPopoverMessage("Score guess cleared because it conflicted with your new pick.", 2300);
    }

    const pick = {
      gameId,
      pickId: TIE_PICK_ID,
      guessedAwayScore: shouldResetScoreGuess ? undefined : parsedGuess.guessedAwayScore,
      guessedHomeScore: shouldResetScoreGuess ? undefined : parsedGuess.guessedHomeScore,
    };
    props.handleMakePick(pick);
  };

  const handleScoreGuessInputChange = (event) => {
    const { name, value } = event.target;
    const nextValue = value === "" ? "" : Math.max(0, Math.min(99, parseInt(value, 10) || 0));

    setState((prevState) => ({
      ...prevState,
      [name]: nextValue,
    }));
  };

  const handleSaveScoreGuess = () => {
    if (!isAuthenticated) {
      showPopoverMessage(unauthenticatedPickMessage);
      return;
    }

    const existingPickId = get(props, "pick.pickId");

    if (!existingPickId) {
      showPopoverMessage("Pick a winner first, then save your score guess.", 2500);

      return;
    }

    if (state.guessedAwayScore === "" || state.guessedHomeScore === "") {
      showPopoverMessage("Enter both team scores to save your guess.", 2500);

      return;
    }

    const selectedIndex = game.competitors[0]._id === existingPickId ? 0 : 1;
    handleMakePick(game, existingPickId, selectedIndex, true);
  };

  const handleClearInput = () => {
    setState((prevState) => ({
      ...prevState,
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
      isGameOfTheWeek: Boolean(get(props, "game.isGameOfTheWeek")),
    }));
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
      isGameOfTheWeek,
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
      isGameOfTheWeek,
    };

    props.handleUpdateGame(game);
  };

  const {
    game,
    isAuthenticated,
    disableTie,
    updatingPick,
  } = props;

  const spreadMode = localStorage.getItem("spreadModeToggle") === "1";
  const canShowTie =
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
    !disableTie;
  const canShowScoreGuess =
    !hasGameStarted(game.startDateTime) &&
    [
      "59723313734d1d6202a85f10",
      "59723313734d1d6202a85f17",
      "59723313734d1d6202a85f25",
      "59723313734d1d6202a85f27",
      "59723313734d1d6202a85f29",
    ].includes(get(game, "leagueId")) &&
    !spreadMode &&
    !disableTie;
  const isScoreGuessDisabled = !isAuthenticated;
  const isGameOfTheWeek =
    get(game, "isGameOfTheWeek") === true ||
    get(game, "isGameOfTheWeek") === "true" ||
    get(game, "isGameOfTheWeek") === 1;
  const scoreGuessMultiplier = isGameOfTheWeek
    ? GAME_OF_THE_WEEK_SCORE_GUESS_MULTIPLIER
    : 1;
  const scoreGuessBoostRows = getScoreGuessBoostRows(scoreGuessMultiplier);

  const componentProps = {
    ...props,
    ...state,
    spreadMode,
    handleMakePick,
    handleTie,
    handleScoreGuessInputChange,
    handleSaveScoreGuess,
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
          {game.competitors.map((competitor, competitorIndex) => (
            <Grid
              key={game._id + "." + competitor._id}
              item
              xs={6}
              onClick={() => handleMakePick(game, competitor._id, competitorIndex)}
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
                  <CompetitorHeader {...{ ...componentProps, competitor }} />
                  <Competitor {...{ ...componentProps, competitor }} />
                </Paper>
              </Grow>
            </Grid>
          ))}
          {state.popoverOpen && (
            <div
              style={{
                position: "absolute",
                top: 100,
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                zIndex: 10,
                animation: "fadeOut 5s forwards",
              }}
            >
              {state.popoverMessage}
            </div>
          )}
        </Grid>
        {isGameOfTheWeek && (
          <div
            style={{
              marginTop: "8px",
              marginBottom: "6px",
              display: "inline-block",
              padding: "4px 8px 6px 8px",
              borderRadius: "999px",
              backgroundColor: "#0B6E4F",
              color: "#fff",
              fontWeight: "700",
              fontSize: "12px",
            }}
            title="Game of the Week"
            aria-label="Game of the Week"
          >
            ⭐ Game of the Week
          </div>
        )}
        {canShowTie && <TieButton {...componentProps} />}
        {canShowScoreGuess && (
          <>
            <div
              style={{
                position: "relative",
                marginTop: "8px",
                border: "2px dashed #3772FA",
                borderRadius: "14px",
                padding: "10px 12px",
                background:
                  "linear-gradient(135deg, rgba(55,114,250,0.12) 0%, rgba(253,187,45,0.14) 100%)",
                fontFamily: "monospace",
                textAlign: "center",
                opacity: isScoreGuessDisabled ? 0.65 : 1,
              }}
            >
            {isScoreGuessDisabled && (
              <button
                type="button"
                onClick={() => showPopoverMessage(unauthenticatedPickMessage)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  cursor: "not-allowed",
                  zIndex: 2,
                }}
                aria-label="Sign in required to use score guess"
              />
            )}
            <div style={{ fontWeight: "700", marginBottom: "8px" }}>🎯 Guess the Score</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <label htmlFor={`guess-away-${game._id}`} style={{ fontSize: "12px", fontWeight: "700" }}>
                  {get(game, "competitors.0.name", "Away")}
                </label>
                <input
                  id={`guess-away-${game._id}`}
                  type="number"
                  min="0"
                  max="99"
                  name="guessedAwayScore"
                  value={state.guessedAwayScore ?? ""}
                  onChange={handleScoreGuessInputChange}
                  disabled={isScoreGuessDisabled}
                  style={{ width: "56px", padding: "6px", borderRadius: "8px", border: "1px solid #3772FA" }}
                  aria-label="Guess away score"
                />
              </div>
              <span style={{ fontWeight: "700" }}>vs</span>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <label htmlFor={`guess-home-${game._id}`} style={{ fontSize: "12px", fontWeight: "700" }}>
                  {get(game, "competitors.1.name", "Home")}
                </label>
                <input
                  id={`guess-home-${game._id}`}
                  type="number"
                  min="0"
                  max="99"
                  name="guessedHomeScore"
                  value={state.guessedHomeScore ?? ""}
                  onChange={handleScoreGuessInputChange}
                  disabled={isScoreGuessDisabled}
                  style={{ width: "56px", padding: "6px", borderRadius: "8px", border: "1px solid #3772FA" }}
                  aria-label="Guess home score"
                />
              </div>
            </div>
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={handleSaveScoreGuess}
                disabled={isScoreGuessDisabled}
                style={{
                  padding: "6px 10px",
                  fontWeight: "700",
                  cursor: isScoreGuessDisabled ? "not-allowed" : "pointer",
                  borderRadius: "9px",
                  border: "1px solid #0B6E4F",
                  backgroundColor: "#0B6E4F",
                  color: "#fff",
                }}
              >
                Save Guess
              </button>
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                lineHeight: "1.5",
                fontWeight: "700",
                color: isGameOfTheWeek ? "#0B6E4F" : "#5f6368",
                textAlign: "left",
              }}
            >
              {isGameOfTheWeek
                ? `Game of the Week is active for this matchup, so score-guess bonuses are multiplied by ${GAME_OF_THE_WEEK_SCORE_GUESS_MULTIPLIER}.`
                : `No Game of the Week multiplier is active for this matchup.`}
            </div>
            {isGameOfTheWeek && (
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  color: "#0B6E4F",
                  textAlign: "left",
                }}
              >
                You still get +{GAME_OF_THE_WEEK_BASE_BONUS.toFixed(2).replace(/\.00$/, "")} if you pick the winner, even without entering a score guess.
              </div>
            )}
            <details
              style={{
                marginTop: "10px",
                textAlign: "left",
                borderTop: "1px dashed rgba(0,0,0,0.2)",
                paddingTop: "8px",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: "700", fontSize: "12px" }}>
                How score guesses boost Leaders
              </summary>
              <div style={{ marginTop: "8px", fontSize: "12px", lineHeight: "1.5" }}>
                <div>
                  After a game is over, your guess can add bonus wins on the Leaders page.
                  Bonus points are added to your total as: wins + guess boost.
                </div>
                {isGameOfTheWeek && (
                  <div style={{ marginTop: "6px", fontWeight: "700", color: "#0B6E4F" }}>
                    This game is marked Game of the Week, so guess boost points are multiplied by {GAME_OF_THE_WEEK_SCORE_GUESS_MULTIPLIER}. If you skip score guessing, a correct winner pick still gets +{GAME_OF_THE_WEEK_BASE_BONUS.toFixed(2).replace(/\.00$/, "")}. 
                  </div>
                )}
                <div style={{ marginTop: "6px" }}>
                  Combined score miss = |away guess - away final| + |home guess - home final|
                </div>
                <div style={{ marginTop: "6px", display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 10px" }}>
                  {scoreGuessBoostRows.map((row) => (
                    <div
                      key={`row-${row.diff}`}
                      style={{ display: "contents" }}
                    >
                      <div>Total miss of {row.diff}</div>
                      <div style={{ fontWeight: "700" }}>
                        +{row.points.toFixed(2).replace(/\.00$/, "")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
            </div>
          </>
        )}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "inline-flex" }}>
            <div
              className={"celestial-nudge"}
              style={{ margin: "1rem 0", marginLeft: `${astroPosition}%` }}
            >
              {astroEmoji}
            </div>
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
                  animation: "moveClouds 7s linear infinite",
                }}
              >
                ☁️
              </div>
            </div>
          </div>
          {["59723313734d1d6202a85f10", "59723313734d1d6202a85f15"].includes(
            get(game, "leagueId")
          ) && <AmericanFootballMiniRallyGame {...{ game }} selectionMade={state.selectionMade} />}
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
                backgroundImage: `url(${BoxingRing })`,
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
                  marginTop: "15%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              >
                <div style={{ fontSize: ".5em" }}>
                  <div>
                    {game.competitors[0].name}
                  </div>
                  <div> vs </div>
                  <div>
                    {game.competitors[1].name}
                  </div>
                </div>
                <div style={{ fontSize: "1em", marginTop: "1em" }}>
                  {boxingHypeText}
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
                {"🥊"}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "35%",
                  fontSize: "3rem",
                }}
              >
                {"🥊"}
              </div>
            </div>
          )}
          {["59723313734d1d6202a85f27"].includes(get(game, "leagueId")) && (
            <div
              style={{
                backgroundImage: `url(${MMARing})`,
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
                  marginTop: "15%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              >
                <div style={{ fontSize: ".5em" }}>
                  <div>
                    {game.competitors[0].name}
                  </div>
                  <div> vs </div>
                  <div>
                    {game.competitors[1].name}
                  </div>
                </div>
                <div style={{ fontSize: "1em", marginTop: "1em" }}>
                  {mmaHypeText}
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  top: "2.8em",
                  left: "-.75em",
                  fontSize: "3rem",
                  transform: " rotate(90deg)",
                }}
              >
                <MMAGlove style={{ height: 75 }} />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "1em",
                  right: "-.75em",
                  fontSize: "3rem",
                  transform: " rotate(90deg) scaleY(-1)",
                }}
              >
                <MMAGlove style={{ height: 75 }} />
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
