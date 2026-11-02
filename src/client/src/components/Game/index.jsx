import { useEffect, useMemo, useState } from 'react';
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import get from "lodash/get";

import Grow from "@mui/material/Grow";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

import BasketballCourt from "./components/Fields/BasketballCourt";
import WorldFootballField from "./components/Fields/WorldFootballField";
import AmericanFootballMiniRallyGame from "./components/AmericanFootballMiniRallyGame";
import BaseballField from "./components/Fields/BaseballField";
import BoxingRing from "../../styles/images/boxing_ring.png";
import MMARing from "../../styles/images/mma_ring.png";

import GamePlayTabs from "./components/GamePlayTabs";
import GamePickAvatarStack from "./components/GamePickAvatarStack";
import TieButton from "./components/TieButton";
import CompetitorHeader from "./components/CompetitorHeader";
import Competitor from "./components/Competitor";
import GameFooter from "./components/GameFooter";
import GameLinesBar from "./components/GameLinesBar";

import { hasGameStarted } from "../../utilities";

import "./game.css";
import "./fields.css";
import {
  buildGameHeadingText,
  buildGameSlugFromCompetitors,
  buildNavigationPath,
  detectRouteBase,
  parseNavigationPath,
} from "../../utilities/navigationPaths";
import { getLeagueName } from "../../utilities/getLeagueName";
import { leagues } from "../../utilities";
import {
  isConfirmedAuthentication,
} from "../../utilities/authenticationClient";
import {
  getSharedCompetitorTextSizes,
} from "../../utilities/leagueCopy";
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
    position: "relative",
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
  { diff: "4", points: SCORE_GUESS_BUMPS.within4 * multiplier },
];

const getSavedGameValues = (game) => {
  const awayCompetitor = get(game, "competitors.0") || {};
  const homeCompetitor = get(game, "competitors.1") || {};
  const spread = get(game, "spread");
  const awaySpread =
    spread?.teamId === awayCompetitor._id && spread?.amount !== undefined && spread?.amount !== null
      ? spread.amount
      : "";
  const homeSpread =
    spread?.teamId === homeCompetitor._id && spread?.amount !== undefined && spread?.amount !== null
      ? spread.amount
      : "";

  const startMoment = game?.startDateTime
    ? moment(game.startDateTime).tz("America/New_York")
    : null;
  const gameDate =
    startMoment && startMoment.isValid()
      ? startMoment.format("YYYY-MM-DD")
      : "";
  const gameTime =
    startMoment && startMoment.isValid() ? startMoment.format("HH:mm") : "";

  const homeVenue = homeCompetitor;
  const homeStadiumLocation = Array.isArray(homeVenue.stadiumLocation)
    ? homeVenue.stadiumLocation.join("\n")
    : "";

  const savedGameName =
    game?.rawGameName ??
    (typeof game?.gameName === "string" && game.gameName.includes(" *** ")
      ? game.gameName.split(" *** ")[0]
      : game?.gameName) ??
    "";

  return {
    awayScore: awayCompetitor.score ?? "",
    homeScore: homeCompetitor.score ?? "",
    awayRank: awayCompetitor.rank ?? "",
    homeRank: homeCompetitor.rank ?? "",
    awayRecord: awayCompetitor.record ?? "",
    homeRecord: homeCompetitor.record ?? "",
    awaySpread,
    homeSpread,
    gameName: savedGameName,
    isGameOver: Boolean(game?.isGameOver),
    currentTime: game?.currentTime ?? "",
    gameTime,
    gameDate,
    liveVideoUrl: game?.liveVideoUrl ?? "",
    highlightVideoUrl: game?.highlightVideoUrl ?? "",
    isHidden: Boolean(game?.isHidden),
    isGameOfTheWeek: Boolean(get(game, "isGameOfTheWeek")),
    homeStadiumName: homeVenue.stadiumName ?? "",
    homeStadiumCity: homeVenue.stadiumCity ?? "",
    homeStadiumDescription: homeStadiumLocation,
  };
};

const Game = (props) => {
  const unauthenticatedPickMessage = 'Please sign in to make your picks. You got this! 🚀';

  const [state, setState] = useState(() => ({
    ...getSavedGameValues(props.game),
    popoverOpen: false,
    popoverMessage: '',
    selectionMade: null,
    guessedAwayScore: get(props, "pick.guessedAwayScore") ?? "",
    guessedHomeScore: get(props, "pick.guessedHomeScore") ?? "",
  }));

  useEffect(() => {
    const saved = getSavedGameValues(props.game);
    setState((prevState) => ({
      ...saved,
      ...prevState,
      guessedAwayScore: get(props, "pick.guessedAwayScore") ?? "",
      guessedHomeScore: get(props, "pick.guessedHomeScore") ?? "",
    }));
  }, [
    props.game?._id,
    props.game?.startDateTime,
    props.pick?.pickId,
    props.pick?.guessedAwayScore,
    props.pick?.guessedHomeScore,
  ]);

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

  const getPickIdFromScoreGuess = (guessedAwayScore, guessedHomeScore) => {
    const awayCompetitorId = get(game, "competitors.0._id");
    const homeCompetitorId = get(game, "competitors.1._id");

    if (
      guessedAwayScore === undefined ||
      guessedHomeScore === undefined ||
      !awayCompetitorId ||
      !homeCompetitorId
    ) {
      return null;
    }

    if (guessedAwayScore === guessedHomeScore) {
      return TIE_PICK_ID;
    }

    return guessedAwayScore > guessedHomeScore ? awayCompetitorId : homeCompetitorId;
  };

  const handleMakePick = (game, pickId, competitorIndex, forceUpdate = false) => {
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

    const parsedGuess = getParsedScoreGuessValues();

    if (!forceUpdate) {
      setState((prevState) => ({
        ...prevState,
        selectionMade: competitorIndex === 0 ? 'left' : competitorIndex === 1 ? 'right' : null,
        guessedAwayScore: "",
        guessedHomeScore: "",
      }));

      props.handleMakePick({
        gameId: game._id,
        pickId,
        guessedAwayScore: null,
        guessedHomeScore: null,
      });
      return;
    }

    props.handleMakePick({
      gameId: game._id,
      pickId,
      guessedAwayScore: parsedGuess.guessedAwayScore,
      guessedHomeScore: parsedGuess.guessedHomeScore,
    });
  };

  const handleTie = (gameId) => {
    if (
      get(props, "pick.pickId") === TIE_PICK_ID ||
      props?.updatingPick ||
      hasGameStarted(props.game.startDateTime)
    ) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      guessedAwayScore: "",
      guessedHomeScore: "",
    }));

    props.handleMakePick({
      gameId,
      pickId: TIE_PICK_ID,
      guessedAwayScore: null,
      guessedHomeScore: null,
    });
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

    if (hasGameStarted(game.startDateTime) || game.isGameOver || props?.updatingPick) {
      return;
    }

    const parsedGuess = getParsedScoreGuessValues();

    if (parsedGuess.guessedAwayScore === undefined || parsedGuess.guessedHomeScore === undefined) {
      showPopoverMessage("Enter both team scores to save your guess.", 2500);
      return;
    }

    const scoreGuessPickId = getPickIdFromScoreGuess(
      parsedGuess.guessedAwayScore,
      parsedGuess.guessedHomeScore
    );

    if (!scoreGuessPickId) {
      return;
    }

    if (scoreGuessPickId === TIE_PICK_ID && !canShowTie) {
      showPopoverMessage("Tie picks aren't available for this game.", 2500);
      return;
    }

    const existingPickId = get(props, "pick.pickId");
    const pickChanged = existingPickId !== scoreGuessPickId;

    if (scoreGuessPickId === TIE_PICK_ID) {
      setState((prevState) => ({
        ...prevState,
        selectionMade: null,
      }));
    } else {
      const selectedIndex = game.competitors[0]._id === scoreGuessPickId ? 0 : 1;
      setState((prevState) => ({
        ...prevState,
        selectionMade: selectedIndex === 0 ? 'left' : 'right',
      }));
    }

    handleMakePick(game, scoreGuessPickId, scoreGuessPickId === TIE_PICK_ID ? -1 : (game.competitors[0]._id === scoreGuessPickId ? 0 : 1), true);

    if (pickChanged) {
      showPopoverMessage("Pick updated to match your score guess.", 2300);
    }
  };

  const handleClearInput = () => {
    setState((prevState) => ({
      ...prevState,
      ...getSavedGameValues(props.game),
    }));
  };

  const parseStadiumLocationLines = (text) =>
    String(text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const getHomeStadiumDescriptionText = (gameCompetitor, descriptionState) => {
    if (descriptionState !== null && descriptionState !== undefined) {
      return descriptionState;
    }

    const lines = gameCompetitor?.stadiumLocation;
    return Array.isArray(lines) ? lines.join("\n") : "";
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

    const saved = getSavedGameValues(props.game);

    const awayScore =
      state.awayScore !== null && state.awayScore !== undefined
        ? state.awayScore
        : saved.awayScore;
    const homeScore =
      state.homeScore !== null && state.homeScore !== undefined
        ? state.homeScore
        : saved.homeScore;
    const awayRank =
      state.awayRank !== null && state.awayRank !== undefined
        ? state.awayRank
        : saved.awayRank;
    const homeRank =
      state.homeRank !== null && state.homeRank !== undefined
        ? state.homeRank
        : saved.homeRank;
    const awayRecord =
      state.awayRecord !== null && state.awayRecord !== undefined
        ? state.awayRecord
        : saved.awayRecord;
    const homeRecord =
      state.homeRecord !== null && state.homeRecord !== undefined
        ? state.homeRecord
        : saved.homeRecord;
    const awaySpread =
      state.awaySpread !== null && state.awaySpread !== undefined
        ? state.awaySpread
        : saved.awaySpread;
    const homeSpread =
      state.homeSpread !== null && state.homeSpread !== undefined
        ? state.homeSpread
        : saved.homeSpread;
    const gameName =
      state.gameName !== null && state.gameName !== undefined
        ? state.gameName
        : saved.gameName;
    const isGameOver =
      state.isGameOver !== null && state.isGameOver !== undefined
        ? state.isGameOver
        : saved.isGameOver;
    const currentTime =
      state.currentTime !== null && state.currentTime !== undefined
        ? state.currentTime
        : saved.currentTime;
    const gameDate =
      state.gameDate !== null && state.gameDate !== undefined
        ? state.gameDate
        : saved.gameDate;
    const gameTime =
      state.gameTime !== null && state.gameTime !== undefined
        ? state.gameTime
        : saved.gameTime;
    const liveVideoUrl =
      state.liveVideoUrl !== null && state.liveVideoUrl !== undefined
        ? state.liveVideoUrl
        : saved.liveVideoUrl;
    const highlightVideoUrl =
      state.highlightVideoUrl !== null && state.highlightVideoUrl !== undefined
        ? state.highlightVideoUrl
        : saved.highlightVideoUrl;
    const isHidden =
      state.isHidden !== null && state.isHidden !== undefined
        ? state.isHidden
        : saved.isHidden;
    const isGameOfTheWeek =
      state.isGameOfTheWeek !== null && state.isGameOfTheWeek !== undefined
        ? state.isGameOfTheWeek
        : saved.isGameOfTheWeek;
    const homeStadiumName =
      state.homeStadiumName !== null && state.homeStadiumName !== undefined
        ? state.homeStadiumName
        : saved.homeStadiumName;
    const homeStadiumCity =
      state.homeStadiumCity !== null && state.homeStadiumCity !== undefined
        ? state.homeStadiumCity
        : saved.homeStadiumCity;
    const homeStadiumDescription =
      state.homeStadiumDescription !== null &&
      state.homeStadiumDescription !== undefined
        ? state.homeStadiumDescription
        : saved.homeStadiumDescription;

    const homeCompetitor = get(props, "game.competitors.1") || {};

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
      homeStadiumName:
        homeStadiumName !== null && homeStadiumName !== undefined
          ? homeStadiumName
          : homeCompetitor.stadiumName || "",
      homeStadiumCity:
        homeStadiumCity !== null && homeStadiumCity !== undefined
          ? homeStadiumCity
          : homeCompetitor.stadiumCity || "",
      homeStadiumLocation: parseStadiumLocationLines(
        getHomeStadiumDescriptionText(homeCompetitor, homeStadiumDescription)
      ),
    };

    props.handleUpdateGame(game);
  };

  const {
    game,
    gameSlug,
    isAuthenticated,
    disableTie,
    updatingPick,
    slimMode = false,
    fieldPickers,
    picksDataLoading = false,
  } = props;

  const showPickSkeleton = isAuthenticated && picksDataLoading;
  const showFieldPickerSkeleton =
    picksDataLoading && hasGameStarted(game.startDateTime) && !slimMode;

  const canShowTie =
    !slimMode &&
    isAuthenticated &&
    !hasGameStarted(game.startDateTime) &&
    [
      "59723313734d1d6202a85f10",
      "59723313734d1d6202a85f17",
      "59723313734d1d6202a85f25",
      "59723313734d1d6202a85f27",
      "59723313734d1d6202a85f29",
    ].includes(get(game, "leagueId")) &&
    !disableTie;
  const canShowScoreGuess =
    !slimMode &&
    !hasGameStarted(game.startDateTime) &&
    [
      "59723313734d1d6202a85f10",
      "59723313734d1d6202a85f17",
      "59723313734d1d6202a85f25",
      "59723313734d1d6202a85f27",
      "59723313734d1d6202a85f29",
    ].includes(get(game, "leagueId")) &&
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
  const shouldReserveHeaderSpace = game.competitors.some((competitorItem) => {
    const showConference = Boolean(competitorItem?.conference) && !slimMode;
    return showConference;
  });
  const sharedTextSizes = getSharedCompetitorTextSizes(game.competitors, { slimMode });

  const componentProps = {
    ...props,
    ...state,
    slimMode,
    sharedTextSizes,
    handleMakePick,
    handleTie,
    handleScoreGuessInputChange,
    handleSaveScoreGuess,
    handleClearInput,
    handleInputChange,
    handleSaveGame,
  };

  const resolvedGameSlug = gameSlug || buildGameSlugFromCompetitors(game);
  const gameHeadingText = buildGameHeadingText(game);
  const location = useLocation();
  const leadersHref = useMemo(() => {
    const routeBase = detectRouteBase(location.pathname);
    const navigationState = parseNavigationPath(location.pathname, routeBase);
    const league = leagues.find(
      (entry) => String(entry.id) === String(game.leagueId)
    );

    return buildNavigationPath({
      routeBase: "/leaders/",
      leagueName: navigationState.leagueName || league?.name || getLeagueName(),
      year: navigationState.year,
      seasonType: navigationState.seasonType,
      weekSegment: navigationState.weekSegment,
    });
  }, [game.leagueId, location.pathname]);

  return (
    <div
      id={resolvedGameSlug}
      key={game._id}
      style={{ ...styles.game, position: "relative", padding: slimMode ? "4px" : "8px" }}
    >
      <h2 className="sr-only">{gameHeadingText}</h2>
      <div
        style={{
          zIndex: 3,
          position: "relative",
          backgroundColor: "#fff",
          paddingBottom: slimMode ? "4px" : "20px",
        }}
      >
        <Grid key={game._id + "-gridlist"} container style={styles.root}>
          {game.competitors.map((competitor, competitorIndex) => {
            const pickColumn = showPickSkeleton ? (
              <Skeleton
                animation="pulse"
                variant="rect"
                height={slimMode ? 88 : 132}
                width="100%"
                sx={{ borderRadius: "8px" }}
              />
            ) : (
              <Paper style={styles.paper}>
                <CompetitorHeader
                  {...{ ...componentProps, competitor, reserveHeaderSpace: shouldReserveHeaderSpace }}
                />
                <Competitor {...{ ...componentProps, competitor }} />
              </Paper>
            );

            return (
            <Grid
              key={game._id + "." + competitor._id}
              size={6}
              onClick={
                showPickSkeleton
                  ? undefined
                  : () => handleMakePick(game, competitor._id, competitorIndex)
              }
              className={updatingPick ? "fast-flash" : ""}
              style={{
                width: "50%",
                minWidth: 0,
                border: showPickSkeleton
                  ? `${slimMode ? "1.25em" : "1.5rem"} dashed #E7E7E7`
                  : competitor.selected
                  ? `${slimMode ? "1.25em" : "1.5rem"} dashed #3772FA`
                  : `${slimMode ? "1.25em" : "1.5rem"} dashed #E7E7E7`,
                padding: slimMode ? "4px" : "10px",
                cursor: showPickSkeleton ? "default" : "pointer",
              }}
            >
              {slimMode || showPickSkeleton ? pickColumn : (
                <Grow in={true} timeout={500}>
                  {pickColumn}
                </Grow>
              )}
            </Grid>
            );
          })}
          {game.competitors?.length === 2 && (
            <div
              className={`game-competitors-vs${slimMode ? " game-competitors-vs--slim" : ""}`}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 32 32"
                className="game-competitors-vs__svg"
                aria-hidden="true"
                focusable="false"
              >
                <polygon
                  points="16,2.5 29.3,12.2 24.2,27.8 7.8,27.8 2.7,12.2"
                  className="game-competitors-vs__polygon"
                />
                <text
                  x="16"
                  y="17"
                  className="game-competitors-vs__text"
                >
                  vs
                </text>
              </svg>
            </div>
          )}
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
        <GameLinesBar game={game} slimMode={slimMode} />
        {isGameOfTheWeek && !slimMode && (
          <div
            className="game-of-the-week-badge"
            title="Game of the Week"
            aria-label="Game of the Week"
          >
            <span className="game-of-the-week-badge__label">
              ⭐ Game of the Week
            </span>
          </div>
        )}
        {canShowTie && !picksDataLoading && <TieButton {...componentProps} />}
        {canShowScoreGuess && !picksDataLoading && (
          <details
            className="score-guess-details"
            style={{
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
            <summary
              style={{
                cursor: "pointer",
                fontWeight: "700",
                listStyle: "none",
              }}
            >
              🎯 Guess the Score
            </summary>
            <div style={{ position: "relative", marginTop: "8px" }}>
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
                : null}
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
                  Each team within N points = max(|away guess - away final|, |home guess - home final|)
                </div>
                <div style={{ marginTop: "6px", display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 10px" }}>
                  {scoreGuessBoostRows.map((row) => (
                    <div
                      key={`row-${row.diff}`}
                      style={{ display: "contents" }}
                    >
                      <div>Each team within {row.diff} points</div>
                      <div style={{ fontWeight: "700" }}>
                        +{row.points.toFixed(2).replace(/\.00$/, "")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
            </div>
          </details>
        )}
        {!slimMode && (
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
          {showFieldPickerSkeleton && (
            <div
              className="game-field-picker-skeleton"
              aria-busy="true"
              aria-label="Loading community picks"
            >
              <Skeleton animation="pulse" variant="circular" width={34} height={34} />
              <span className="game-field-picker-skeleton__vs">vs</span>
              <Skeleton animation="pulse" variant="circular" width={34} height={34} />
            </div>
          )}
          {!showFieldPickerSkeleton &&
            hasGameStarted(game.startDateTime) &&
            fieldPickers &&
            (fieldPickers.away.length > 0 || fieldPickers.home.length > 0) && (
              <div className="game-field-picker-row">
                <div className="game-field-picker-row__side game-field-picker-row__side--away">
                  <GamePickAvatarStack
                    side="left"
                    pickers={fieldPickers.away}
                    leadersHref={leadersHref}
                  />
                </div>
                <div className="game-field-picker-row__vs">vs</div>
                <div className="game-field-picker-row__side game-field-picker-row__side--home">
                  <GamePickAvatarStack
                    side="right"
                    pickers={fieldPickers.home}
                    leadersHref={leadersHref}
                  />
                </div>
              </div>
            )}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                width: "100%",
                alignSelf: "stretch",
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
                width: "100%",
                alignSelf: "stretch",
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
                <MMAGlove style={{ height: 58 }} />
              </div>
              <div
                style={{
                  position: "relative",
                  top: "1.35em",
                  right: "-.75em",
                  fontSize: "3rem",
                  transform: " rotate(90deg) scaleY(-1)",
                }}
              >
                <MMAGlove style={{ height: 58 }} />
              </div>
            </div>
          )}
          </div>
        </div>
        )}
        {slimMode ? (
          <div
            style={{
              fontSize: "11px",
              color: "#666",
              textAlign: "center",
              marginTop: "4px",
              fontFamily: "monospace",
            }}
          >
            {moment(get(game, "startDateTime")).format("ddd h:mm A")}
            {isGameOfTheWeek ? " · ⭐ GOTW" : ""}
          </div>
        ) : (
          <GameFooter {...componentProps} />
        )}
      </div>
      {!slimMode && <GamePlayTabs {...componentProps} />}
    </div>
  );
};

Game.propTypes = {
  game: PropTypes.object,
  gameSlug: PropTypes.string,
  pick: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  slimMode: PropTypes.bool,
  fieldPickers: PropTypes.shape({
    away: PropTypes.array,
    home: PropTypes.array,
  }),
  disableTie: PropTypes.bool,
  handleMakePick: PropTypes.func,
  handleUpdateGame: PropTypes.func,
  updatingPick: PropTypes.bool,
  picksDataLoading: PropTypes.bool,
};

export default Game;
