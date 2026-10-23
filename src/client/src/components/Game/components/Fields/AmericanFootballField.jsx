import { useState, useEffect } from 'react';
import PropTypes from "prop-types";

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
  const [playMode, setPlayMode] = useState(PLAY_MODES.pass);
  const [isThrowingRight, setIsThrowingRight] = useState(false);
  const [isThrowingLeft, setIsThrowingLeft] = useState(false);
  useEffect(() => {
    if (props.selectionMade === 'left') {
      setHeartCounts(prevCounts => ({ ...prevCounts, left: prevCounts.left + 1 }));
      launchTowardHome();
    }

    if (props.selectionMade === 'right') {
      setHeartCounts(prevCounts => ({ ...prevCounts, right: prevCounts.right + 1 }));
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

  const ballAnchor = (fieldSide) => ({
    x: fieldSide === 'away' ? awayBallX : homeBallX,
    y: ballY,
  });

  const ballTextProps = (fieldSide) => {
    const style = { cursor: 'pointer' };
    const { x, y } = ballAnchor(fieldSide);

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
    const heartCount = heartCounts[side];
    if (heartCount >= 99) return; // Limit to 99 hearts
    setHeartCounts(prevCounts => ({ ...prevCounts, [side]: prevCounts[side] + 1 }));

    // const container = document.querySelector('.floating-hearts-container');
    // const heart = document.getElementById(`${side}-heart-floating`);
    // const clonedHeart = heart.cloneNode(true);

    // if (side === 'left') {
    //   clonedHeart.setAttribute("class", `heart ${side}`);
    //   clonedHeart.setAttribute("style", `
    //   position: absolute;
    //   animation: floatUp .5s ease-in-out forwards;
    //   left: 15px; /* Adjust position for left side */
    //   `);
    // } else if (side === 'right') {
    //   const uniqueId = `heart-${side}-${Date.now()}`;
    //   clonedHeart.setAttribute("id", uniqueId);
    //   clonedHeart.setAttribute("class", `heart ${side}`);
    //   clonedHeart.setAttribute("style", `
    //   position: absolute;
    //   animation: floatUp .5s ease-in-out forwards;
    //   left: 335px; /* Adjust position for right side */
    //   `);
    // }

    // container.appendChild(clonedHeart);
    // setTimeout(() => {
    //   container.removeChild(clonedHeart);
    // }, 500);
  };

  const formatHeartCount = (count) => {
    if (count === 0) return "";
    return `${count}`;
  };

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
        <svg id="left-heart" onClick={() => { handleHearts('left'); }} style={{ cursor: 'pointer' }} aria-label="Love Road" color="#ed4956" fill="#ed4956" height="25" role="img" viewBox="0 0 48 48" width="35" y="73"><path className="heart-pulse" d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
        <text x="15" y="110" fontSize="12" fill="#000">{formatHeartCount(heartCounts.left)}</text>
        <svg id="right-heart" onClick={() => { handleHearts('right'); }} style={{ cursor: 'pointer' }} aria-label="Love Home" color="#ed4956" fill="#ed4956" height="25" role="img" viewBox="0 0 48 48" width="35" y="73" x="335"><path className="heart-pulse" d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
        <text x="350" y="110" fontSize="12" fill="#000">{formatHeartCount(heartCounts.right)}</text>
      </g>
      {/* balls — last layer so flight paints above field art */}
      <g className="american-football-ball-layer">
        <g onClick={launchTowardHome} className={ballMotionClass('right', isThrowingRight)}>
          <text x={awayBallX} y={ballY} id="line" {...ballTextProps('away')}>🏈</text>
        </g>
        <g onClick={launchTowardAway} className={ballMotionClass('left', isThrowingLeft)}>
          <text x={homeBallX} y={ballY} id="line" {...ballTextProps('home')}>🏈</text>
        </g>
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
  selectionMade: PropTypes.string,
};

export default AmericanFootballField;