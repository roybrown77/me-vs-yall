import { useState, useRef } from 'react';

const AmericanFootballField = (props) => {
  const [isHeartedLeft, setIsHeartedLeft] = useState(true);
  const [isHeartedRight, setIsHeartedRight] = useState(true);

  const [isThrowingRight, setIsThrowingRight] = useState(false);
  const [isThrowingLeft, setIsThrowingLeft] = useState(false);
  const hideXO = useRef(false);;

  const awayScoreMade = () => {
    setIsThrowingRight(false);
    props.awayScoreHandler();
  };

  const homeScoreMade = () => {
    setIsThrowingLeft(false);
    props.homeScoreHandler();
  };

  const throwBallRight = () => {
    hideXO.current = true;
    setIsThrowingRight(true);
    setTimeout(() => {awayScoreMade()}, 700);
  };

  const throwBallLeft = () => {
    hideXO.current = true;
    setIsThrowingLeft(true);
    setTimeout(() => {homeScoreMade()}, 700);
  };

  return (
  <svg id="drivechart-mobile" style={{...props.style, height:'100%', maxWidth:'500px', width:'90%', overflow: 'hidden', position: 'relative'}} className="mobile-svg mobile-only" height="100" version="1.1" width="372" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 72" preserveAspectRatio="xMinYMin">
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
      <defs style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}></defs>
      {!isHeartedLeft && <svg onClick={() => setIsHeartedLeft(true)} style={{ cursor: 'pointer' }} aria-label="Love Road" className="_8-yf5 " color="#262626" fill="#262626" height="25" role="img" viewBox="0 0 48 48" width="15" y="73"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>}
      {isHeartedLeft && <svg onClick={() => setIsHeartedLeft(false)} style={{ cursor: 'pointer' }} aria-label="UnLove Road" className="_8-yf5 " color="#ed4956" fill="#ed4956" height="25" role="img" viewBox="0 0 48 48" width="15" y="73"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>}
      <text className="field-text-team" x="20" y="86.814" textAnchor="start" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#000000" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'start', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>{props.away}</tspan>
      </text>
      <text className="field-text-team" x="350" y="86.814" textAnchor="end" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#000000" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'end', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>{props.home}</tspan>
      </text>
      {!isHeartedRight && <svg onClick={() => setIsHeartedRight(true)} style={{ cursor: 'pointer' }} aria-label="Love Home" className="_8-yf5 " color="#262626" fill="#262626" height="25" role="img" viewBox="0 0 48 48" width="15" y="73" x="355"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>}
      {isHeartedRight && <svg onClick={() => setIsHeartedRight(false)} style={{ cursor: 'pointer' }} aria-label="UnLove Home" className="_8-yf5 " color="#ed4956" fill="#ed4956" height="25" role="img" viewBox="0 0 48 48" width="15" y="73" x="355"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>}
      <text className="field-number" x="186.00000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>50</tspan>
      </text>
      <text className="red-zone-left" x="92.50000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>20</tspan>
      </text>
      <text className="red-zone-right" x="279.00000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>20</tspan>
      </text>
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
      <g>
        <g onClick={throwBallRight} className={isThrowingRight ? "ball throwBallRight" : "ball"}>
          <text x="35" y="25" id="line" rotate="45" style={{cursor: 'pointer'}}>🏈</text>
        </g>
        <g onClick={throwBallLeft} className={isThrowingLeft ? "ball throwBallLeft" : "ball"}>
          <text x="315" y="25" id="line" rotate="45" style={{cursor: 'pointer'}}>🏈</text>
        </g>
        {!hideXO.current && <svg viewBox="135 65 100 100">
          <path className="ball-path" fill="#fff" stroke="#000" strokeWidth="2" strokeOpacity="1" style={{fillOpacity: 0, strokeOpacity: 1}} strokeDasharray="4" d="M 319 138 L 319 138 A 140 83, 0,0 0,55 135"></path>
        </svg>}
        {!hideXO.current && <ellipse cx="285" cy="56" rx="3" ry="3" id="line" fill="#000" stroke="#000" style={{fillOpacity: 1, strokeWidth: 1}} className="line-of-scrimmage"></ellipse>}
        {!hideXO.current && <ellipse cx="90" cy="56" rx="3" ry="3" id="line" fill="#000" stroke="#000" style={{fillOpacity: 1, strokeWidth: 1}} className="line-of-scrimmage"></ellipse>}
        {!hideXO.current && <svg viewBox="-97 -32.5 100 100">
          <line x1="35" x2="45" y1="45" y2="40" stroke="black" strokeWidth="3" strokeOpacity="1" />
          <line x1="35" x2="90" y1="45" y2="45" stroke="black" strokeWidth="3" strokeOpacity="1" />
          <line x1="35" x2="45" y1="45" y2="50" stroke="black" strokeWidth="3" strokeOpacity="1" />
        </svg>}

        <svg viewBox="-75 -25 100 100">
            <line x1="15" x2="20" y1="30" y2="70" stroke="yellow" strokeWidth="4" strokeOpacity="1" />
        </svg>
      </g>
      <rect className="goal-post-left" x="363.967" y="46.064" width="2.02" height="8.367" rx="0" ry="0" fill="#2a443b" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#989898" stroke="#000000" d="M364.977,44.869L362.957,44.869L363.967,46.063L365.987,46.063Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#faed24" d="M358.536,36.307H360.244C363.055,36.307,364.497,38.137,364.497,43.909000000000006V44.55700000000001" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="10" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#f8ed40" d="M357.994,35.791H360.50100000000003C363.31300000000005,35.791,364.75600000000003,38.620999999999995,364.75600000000003,44.393V45.557" strokeMiterlimit="10" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M361.09,39.062L355.54,33.946L356.106,33.557L361.656,38.67Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M356.105,33.994L355.564,33.994L355.564,8.38L356.105,7.701Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="361.012" y="11.922" width="0.586" height="27.804" rx="0" ry="0" fill="#faed24" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M362.081,39.725C362.081,39.725,362.07,40.124,361.908,40.421C361.748,40.717999999999996,361.539,40.671,361.539,40.671V12.483L362.08099999999996,11.702V39.725Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
  </svg>);
};

export default AmericanFootballField;