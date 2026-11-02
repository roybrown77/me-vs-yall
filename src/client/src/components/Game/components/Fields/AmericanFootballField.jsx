import { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from "prop-types";

import { hasGameStarted } from "../../../../utilities";
import {
  resolveAmericanFootballLiveBall,
  resolveAmericanFootballMidfieldTeams,
} from "../../americanFootballFieldPosition";
import {
  HEART_SVG_PATH,
  computeHeartTapBurst,
  createFloatingHeartBurst,
} from "../../americanFootballFloatingHearts";
import AmericanFootballPossessionMarker from "./AmericanFootballPossessionMarker";

const PLAY_MODES = {
  pass: 'pass',
  run: 'run',
  kick: 'kick',
};

const PASS_ANIM_MS = 700;
const RUN_ANIM_MS = 1300;
const KICK_ANIM_MS = 1050;
const KICK_AWAY_BALL_X = 66;

const AmericanFootballField = (props) => {
  const [heartCounts, setHeartCounts] = useState({ left: 0, right: 0 });
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [playMode, setPlayMode] = useState(PLAY_MODES.pass);
  const [isThrowingRight, setIsThrowingRight] = useState(false);
  const [isThrowingLeft, setIsThrowingLeft] = useState(false);
  const tapHistoryRef = useRef({ left: [], right: [] });
  const cleanupTimersRef = useRef([]);

  useEffect(
    () => () => {
      cleanupTimersRef.current.forEach(clearTimeout);
    },
    [],
  );

  const liveBall = useMemo(
    () => resolveAmericanFootballLiveBall({ game: props.game, hasGameStarted }),
    [props.game],
  );

  const midfieldTeams = useMemo(
    () => resolveAmericanFootballMidfieldTeams({ game: props.game, hasGameStarted }),
    [props.game],
  );

  const midfieldJostle = useMemo(() => {
    if (!midfieldTeams) {
      return null;
    }
    const gameKey = props.game?._id || props.game?.id || "game";
    let seed = 0;
    for (let i = 0; i < gameKey.length; i += 1) {
      seed = (seed + gameKey.charCodeAt(i) * (i + 1)) % 997;
    }
    const rand = (offset) => {
      seed = (seed * 48271 + offset) % 2147483647;
      return seed / 2147483647;
    };
    return {
      away: {
        durationSec: 2.35 + rand(1) * 1.15,
        delaySec: rand(2) * 0.45,
      },
      home: {
        durationSec: 2.35 + rand(3) * 1.15,
        delaySec: rand(4) * 0.45,
      },
    };
  }, [midfieldTeams, props.game?._id, props.game?.id]);

  const possessionWobble = useMemo(() => {
    if (!liveBall) {
      return null;
    }
    const gameKey = props.game?._id || props.game?.id || "game";
    let seed = 0;
    for (let i = 0; i < gameKey.length; i += 1) {
      seed = (seed + gameKey.charCodeAt(i) * (i + 1)) % 997;
    }
    const rand = (offset) => {
      seed = (seed * 48271 + offset) % 2147483647;
      return seed / 2147483647;
    };
    return {
      durationSec: 2.35 + rand(5) * 1.15,
      delaySec: rand(6) * 0.45,
    };
  }, [liveBall, props.game?._id, props.game?.id]);

  useEffect(() => {
    if (props.selectionMade === 'left') {
      handleHearts('left');
      launchTowardHome();
    }

    if (props.selectionMade === 'right') {
      handleHearts('right');
      launchTowardAway();
    }
  }, [props.selectionMade]);

  const awayScoreMade = () => {
    setIsThrowingRight(false);
    props.awayScoreHandler();
  };

  const homeScoreMade = () => {
    setIsThrowingLeft(false);
    props.homeScoreHandler();
  };

  const ballMotionClass = (side, isActive) => {
    if (!isActive) {
      return 'small-vertical-bounce ball';
    }
    if (playMode === PLAY_MODES.kick) {
      return side === 'right' ? 'ball footballKickRight' : 'ball footballKickLeft';
    }
    if (playMode === PLAY_MODES.run) {
      return side === 'right' ? 'ball footballRunRight' : 'ball footballRunLeft';
    }
    return side === 'right' ? 'ball footballThrowRight' : 'ball footballThrowLeft';
  };

  const animDurationMs = () => {
    if (playMode === PLAY_MODES.kick) return KICK_ANIM_MS;
    if (playMode === PLAY_MODES.run) return RUN_ANIM_MS;
    return PASS_ANIM_MS;
  };

  const launchTowardHome = () => {
    setIsThrowingRight(true);
    setTimeout(() => { awayScoreMade(); }, animDurationMs());
  };

  const launchTowardAway = () => {
    setIsThrowingLeft(true);
    setTimeout(() => { homeScoreMade(); }, animDurationMs());
  };

  const KICK_BALL_Y = 55;
  const PASS_BALL_Y = 15;
  const ballY =
    playMode === PLAY_MODES.kick
      ? KICK_BALL_Y
      : playMode === PLAY_MODES.run
        ? KICK_BALL_Y
        : PASS_BALL_Y + (KICK_BALL_Y - PASS_BALL_Y) / 2 - 17;
  const homeBallX = 305;
  const awayBallX =
    playMode === PLAY_MODES.kick
      ? KICK_AWAY_BALL_X
      : playMode === PLAY_MODES.run
        ? 372 - homeBallX
        : 35;

  const ballAnchor = (fieldSide, overrideX) => ({
    x: overrideX ?? (fieldSide === 'away' ? awayBallX : homeBallX),
    y: ballY,
  });

  const ballTextProps = (fieldSide, overrideX) => {
    const style = { cursor: 'pointer' };
    const { x, y } = ballAnchor(fieldSide, overrideX);

    if (playMode === PLAY_MODES.pass) {
      return { transform: `rotate(45 ${x} ${y})`, style };
    }
    if (playMode === PLAY_MODES.run) {
      if (fieldSide === 'away') {
        return {
          style,
          transform: `translate(${x}, ${y}) scale(-1, 1) rotate(-45) translate(-${x}, ${-y})`,
        };
      }
      return { transform: `rotate(-45 ${x} ${y})`, style };
    }
    if (fieldSide === 'away') {
      return {
        style,
        transform: `translate(${x}, ${y}) scale(-1, 1) translate(-${x}, ${-y})`,
      };
    }
    return { style };
  };

  const handleHearts = (side) => {
    setHeartCounts((prevCounts) => ({
      ...prevCounts,
      [side]: Math.min(99, prevCounts[side] + 1),
    }));

    const nowMs = Date.now();
    const { updatedTapTimesMs, burstCount, rapidLevel } = computeHeartTapBurst({
      recentTapTimesMs: tapHistoryRef.current[side] || [],
      nowMs,
    });
    tapHistoryRef.current[side] = updatedTapTimesMs;

    const newParticles = createFloatingHeartBurst({
      side,
      burstCount,
      rapidLevel,
      nowMs,
    });
    const newIds = new Set(newParticles.map((p) => p.id));
    const maxLifetimeMs = Math.max(
      ...newParticles.map((p) => p.durationMs + p.delayMs),
      1000,
    );

    setFloatingHearts((prev) => [...prev, ...newParticles]);

    const timerId = setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((item) => !newIds.has(item.id)));
      cleanupTimersRef.current = cleanupTimersRef.current.filter((id) => id !== timerId);
    }, maxLifetimeMs + 100);
    cleanupTimersRef.current.push(timerId);
  };

  const formatHeartCount = (count) => {
    if (count === 0) return "";
    return `${count}`;
  };

  const handleLiveBallPlay = () => {
    if (liveBall?.possessionSide === "home") {
      launchTowardAway();
      return;
    }
    launchTowardHome();
  };

  const liveBallAnimating = liveBall
    ? liveBall.possessionSide === "home"
      ? isThrowingLeft
      : isThrowingRight
    : false;
  const liveBallSide = liveBall?.possessionSide === "home" ? "home" : "away";
  const gameInProgress =
    props.game && hasGameStarted(props.game.startDateTime) && !props.game.isGameOver;
  const showAwayEndZoneBall =
    !gameInProgress && (!liveBall || liveBall.possessionSide !== "away");
  const showHomeEndZoneBall =
    !gameInProgress && (!liveBall || liveBall.possessionSide !== "home");

  return (
    <div className="american-football-field-stage">
    <svg id="drivechart-mobile" style={{...props.style, position: 'relative'}} className="mobile-svg mobile-only american-football-field-svg" width="372" height="120" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 372 72" preserveAspectRatio="xMinYMin">
      {/* <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            25% {
              transform: translateY(-25px) translateX(-5px) rotate(-5deg);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-50px) translateX(5px) rotate(5deg);
              opacity: 0.6;
            }
            75% {
              transform: translateY(-75px) translateX(-5px) rotate(-5deg);
              opacity: 0.4;
            }
            100% {
              transform: translateY(-100px) rotate(0deg);
              opacity: 0;
            }
          }
        `}
      </style> */}
      {/* field bottom */}
      <rect className="field-bottom" x="185.468" y="67.814" width="1.055" height="4.043" rx="0" ry="0" fill="#2c7b3d" stroke="#000" strokeWidth="0" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}} strokeOpacity="1"></rect>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M216.127,67.814L216.086,71.857L186.523,71.857L186.523,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M247.854,67.814L247.77,71.857L216.087,71.857L216.127,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M278.514,67.814L278.389,71.857L247.77,71.857L247.854,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M311.285,67.814L311.115,71.857L278.388,71.857L278.513,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M340.898,67.814L340.689,71.857L311.116,71.857L311.285,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#9c9c9d" stroke="#000000" d="M341.955,67.814L341.744,71.857L340.689,71.857L340.899,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#2a443b" stroke="#000000" d="M371.559,67.814L371.308,71.857L341.744,71.857L341.955,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M185.467,67.814L185.468,71.857L153.794,71.857L153.751,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M153.751,67.814L153.795,71.857L123.177,71.857L123.091,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M123.091,67.814L123.176,71.857L92.548,71.857L92.421,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M92.421,67.814L92.548,71.857L61.93,71.857L61.762,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M61.762,67.814L61.93,71.857L31.312,71.857L31.102,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#cdcccc" stroke="#000000" d="M31.102,67.814L31.312,71.857L29.202,71.857L28.989,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#2a443b" stroke="#000000" d="M28.989,67.814L29.202,71.857L0.693,71.857L0.442,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      {/* field top */}
      <path className="field-top" fill="#359f47" stroke="#000000" d="M186.468,40.427L186.523,67.814L185.467,67.814L185.523,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M212.943,40.427L216.127,67.814L186.524,67.814L186.468,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M241.315,40.427L247.854,67.814L216.127,67.814L212.943,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M268.734,40.427L278.513,67.814L247.853,67.814L241.315,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M298.043,40.427L311.285,67.814L278.514,67.814L268.734,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M324.527,40.427L340.898,67.814L311.285,67.814L298.043,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#cdcccc" stroke="#000000" d="M325.471,40.427L341.955,67.814L340.899,67.814L324.526,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top field-home" fill={props.homeColor} stroke="#000000" d="M351.945,40.427L371.559,67.814L341.955,67.814L325.472,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M185.523,40.427L185.468,67.814L153.75,67.814L157.16,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M157.16,40.427L153.75,67.814L123.091,67.814L129.741,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M129.741,40.427L123.092,67.814L92.422,67.814L102.313,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M102.313,40.427L92.421,67.814L61.762,67.814L74.894,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M74.893,40.427L61.761,67.814L31.101,67.814L47.474,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#cdcccc" stroke="#000000" d="M47.474,40.427L31.102,67.814L28.989,67.814L45.585,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top field-away" fill={props.awayColor} stroke="#000000" d="M45.584,40.427L28.989,67.814L0.441,67.814L20.055,40.427Z" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}} strokeWidth="0" strokeOpacity="1"></path>
      {/* red zone overlay */}
      {liveBall?.redZoneSide === "left" ? (
        <g className="american-football-red-zone american-football-red-zone--left" aria-label="Red zone">
          <path
            className="american-football-red-zone__lip"
            fill="#af1616"
            fillOpacity="0.5"
            d="M92.421,67.814L92.548,71.857L31.312,71.857L31.102,67.814Z"
          />
          <path
            className="american-football-red-zone__turf"
            fill="#e52424"
            fillOpacity="0.45"
            d="M102.313,40.427L92.421,67.814L31.101,67.814L47.474,40.427Z"
          />
        </g>
      ) : null}
      {liveBall?.redZoneSide === "right" ? (
        <g className="american-football-red-zone american-football-red-zone--right" aria-label="Red zone">
          <path
            className="american-football-red-zone__lip"
            fill="#af1616"
            fillOpacity="0.5"
            d="M340.898,67.814L340.689,71.857L278.388,71.857L278.513,67.814Z"
          />
          <path
            className="american-football-red-zone__turf"
            fill="#e52424"
            fillOpacity="0.45"
            d="M324.527,40.427L340.898,67.814L278.514,67.814L268.734,40.427Z"
          />
        </g>
      ) : null}
      {/* field yard markers */}
      <text className="field-number" x="186.00000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
        <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>50</tspan>
      </text>
      <text className="red-zone-left" x="92.50000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>20</tspan>
      </text>
      <text className="red-zone-right" x="279.00000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>20</tspan>
      </text>
      {/* goal posts */}
      <path className="goal-post-left" fill="#818181" stroke="#000000" d="M8.294,54.432L9.304,53.236L9.304,44.868L8.294,46.064Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="6.275" y="46.064" width="2.02" height="8.367" rx="0" ry="0" fill="#2a443b" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#989898" stroke="#000000" d="M7.285,44.869L9.305,44.869L8.294,46.063L6.274,46.063Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#faed24" d="M13.726,36.307H12.018C9.207,36.307,7.765000000000001,38.137,7.765000000000001,43.909000000000006V44.55700000000001" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="10" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#f8ed40" d="M14.268,35.791H11.761000000000001C8.950000000000001,35.791,7.5070000000000014,38.620999999999995,7.5070000000000014,44.393V45.557" strokeMiterlimit="10" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M11.171,39.062L16.721,33.946L16.155,33.557L10.605,38.67Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M16.156,33.994L16.698,33.994L16.698,8.38L16.156,7.701Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="10.663" y="11.922" width="0.587" height="27.804" rx="0" ry="0" fill="#faed24" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M10.181,39.725C10.181,39.725,10.191999999999998,40.124,10.353,40.421C10.514,40.717999999999996,10.722999999999999,40.671,10.722999999999999,40.671V12.483L10.181,11.702V39.725Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#818181" stroke="#000000" d="M363.967,54.432L362.957,53.236L362.957,44.868L363.967,46.064Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="363.967" y="46.064" width="2.02" height="8.367" rx="0" ry="0" fill="#2a443b" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#989898" stroke="#000000" d="M364.977,44.869L362.957,44.869L363.967,46.063L365.987,46.063Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#faed24" d="M358.536,36.307H360.244C363.055,36.307,364.497,38.137,364.497,43.909000000000006V44.55700000000001" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="10" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#f8ed40" d="M357.994,35.791H360.50100000000003C363.31300000000005,35.791,364.75600000000003,38.620999999999995,364.75600000000003,44.393V45.557" strokeMiterlimit="10" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M361.09,39.062L355.54,33.946L356.106,33.557L361.656,38.67Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M356.105,33.994L355.564,33.994L355.564,8.38L356.105,7.701Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="361.012" y="11.922" width="0.586" height="27.804" rx="0" ry="0" fill="#faed24" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M362.081,39.725C362.081,39.725,362.07,40.124,361.908,40.421C361.748,40.717999999999996,361.539,40.671,361.539,40.671V12.483L362.08099999999996,11.702V39.725Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      {/* team names */}
      <text className="field-text-team" x="35" y="86.814" textAnchor="start" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#000000" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'start', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>{props.away}</tspan>
      </text>
      <text className="field-text-team" x="335" y="86.814" textAnchor="end" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#000000" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'end', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>{props.home}</tspan>
      </text>
      {/* hearts */}
      <g className="hearts-container">
        <g className="american-football-floating-hearts" aria-hidden="true">
          {floatingHearts.map((heart) => (
            <g key={heart.id} transform={`translate(${heart.x}, ${heart.y})`}>
              <svg
                x="-12.5"
                y="-12.5"
                width="25"
                height="25"
                viewBox="0 0 48 48"
                overflow="visible"
              >
                <g
                  className="american-football-floating-heart"
                  style={{
                    '--heart-sway-1': `${heart.sway1}px`,
                    '--heart-sway-2': `${heart.sway2}px`,
                    '--heart-sway-3': `${heart.sway3}px`,
                    '--heart-rise': `${heart.riseY}px`,
                    '--heart-scale': heart.scale,
                    '--heart-rot-1': `${heart.rot1}deg`,
                    '--heart-rot-2': `${heart.rot2}deg`,
                    animationDuration: `${heart.durationMs}ms`,
                    animationDelay: `${heart.delayMs}ms`,
                  }}
                >
                  <path fill="#ed4956" d={HEART_SVG_PATH} />
                </g>
              </svg>
            </g>
          ))}
        </g>
        <svg
          id="left-heart"
          onClick={() => {
            handleHearts('left');
          }}
          style={{
            cursor: 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Love Road"
          color="#ed4956"
          fill="#ed4956"
          height="25"
          role="img"
          viewBox="0 0 48 48"
          width="35"
          y="73"
        >
          <rect x="0" y="0" width="48" height="48" fill="transparent" />
          <path className="heart-pulse" d={HEART_SVG_PATH}></path>
        </svg>
        <text x="15" y="110" fontSize="12" fill="#000" style={{ userSelect: 'none' }}>
          {formatHeartCount(heartCounts.left)}
        </text>
        <svg
          id="right-heart"
          onClick={() => {
            handleHearts('right');
          }}
          style={{
            cursor: 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Love Home"
          color="#ed4956"
          fill="#ed4956"
          height="25"
          role="img"
          viewBox="0 0 48 48"
          width="35"
          y="73"
          x="335"
        >
          <rect x="0" y="0" width="48" height="48" fill="transparent" />
          <path className="heart-pulse" d={HEART_SVG_PATH}></path>
        </svg>
        <text x="350" y="110" fontSize="12" fill="#000" style={{ userSelect: 'none' }}>
          {formatHeartCount(heartCounts.right)}
        </text>
      </g>
      {/* balls — last layer so flight paints above field art */}
      <g className="american-football-ball-layer">
        {liveBall && !liveBallAnimating ? (
          <AmericanFootballPossessionMarker
            ballX={liveBall.ballX}
            teamLabel={liveBall.teamLabel}
            teamColor={liveBall.teamColor}
            onClick={handleLiveBallPlay}
            jostleSide="possession"
            jostleDurationSec={possessionWobble?.durationSec}
            jostleDelaySec={possessionWobble?.delaySec}
            driveDirection={liveBall.possessionSide === "away" ? "right" : "left"}
          />
        ) : null}
        {!liveBall && midfieldTeams && !liveBallAnimating ? (
          <g className="american-football-midfield-teams" aria-label="Teams at midfield">
            <AmericanFootballPossessionMarker
              ballX={midfieldTeams.away.ballX}
              teamLabel={midfieldTeams.away.teamLabel}
              teamColor={midfieldTeams.away.teamColor}
              jostleSide="away"
              jostleDurationSec={midfieldJostle?.away.durationSec}
              jostleDelaySec={midfieldJostle?.away.delaySec}
            />
            <AmericanFootballPossessionMarker
              ballX={midfieldTeams.home.ballX}
              teamLabel={midfieldTeams.home.teamLabel}
              teamColor={midfieldTeams.home.teamColor}
              jostleSide="home"
              jostleDurationSec={midfieldJostle?.home.durationSec}
              jostleDelaySec={midfieldJostle?.home.delaySec}
            />
          </g>
        ) : null}
        {liveBall && liveBallAnimating ? (
          <g
            onClick={handleLiveBallPlay}
            className={ballMotionClass(liveBallSide === "home" ? "left" : "right", true)}
          >
            <text
              x={liveBall.ballX}
              y={ballY}
              {...ballTextProps(liveBallSide, liveBall.ballX)}
            >
              🏈
            </text>
          </g>
        ) : null}
        {showAwayEndZoneBall && !liveBallAnimating ? (
          <g onClick={launchTowardHome} className={ballMotionClass("right", isThrowingRight)}>
            <text x={awayBallX} y={ballY} {...ballTextProps("away")}>
              🏈
            </text>
          </g>
        ) : null}
        {showHomeEndZoneBall && !liveBallAnimating ? (
          <g onClick={launchTowardAway} className={ballMotionClass("left", isThrowingLeft)}>
            <text x={homeBallX} y={ballY} {...ballTextProps("home")}>
              🏈
            </text>
          </g>
        ) : null}
      </g>
    </svg>
    <div className="american-football-play-toggle" role="group" aria-label="Play type">
      <button
        type="button"
        className={playMode === PLAY_MODES.pass ? 'is-active' : ''}
        onClick={() => setPlayMode(PLAY_MODES.pass)}
        disabled={isThrowingRight || isThrowingLeft}
      >
        <span className="american-football-play-toggle__label">Pass</span>
      </button>
      <span className="american-football-play-toggle__sep" aria-hidden="true">,</span>
      <button
        type="button"
        className={playMode === PLAY_MODES.run ? 'is-active' : ''}
        onClick={() => setPlayMode(PLAY_MODES.run)}
        disabled={isThrowingRight || isThrowingLeft}
      >
        <span className="american-football-play-toggle__label">Run</span>
      </button>
      <span className="american-football-play-toggle__or" aria-hidden="true">or</span>
      <button
        type="button"
        className={playMode === PLAY_MODES.kick ? 'is-active' : ''}
        onClick={() => setPlayMode(PLAY_MODES.kick)}
        disabled={isThrowingRight || isThrowingLeft}
      >
        <span className="american-football-play-toggle__label">Kick</span>
      </button>
      <span className="american-football-play-toggle__help" aria-hidden="true">?</span>
    </div>
    </div>
  );
};

AmericanFootballField.propTypes = {
  game: PropTypes.object,
  selectionMade: PropTypes.string,
};

export default AmericanFootballField;