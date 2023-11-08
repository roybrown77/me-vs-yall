import React from 'react';

// const BaseballField = (props) => {
//   return(<svg id="mlb-gamecast__view--field" className="mlb-gamecast__view--field mlb-gamecast__view--venue-89" viewBox="0 0 390 188">
//     <g transform="matrix(1,0,0,1,-129,-118)" className="base base__0">
//     <path d="M375,249.5l-8-3.5l-8,3.5l0,0v1.8l8,3.5v0l8-3.5L375,249.5L375,249.5z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__0"></path>
//     <path d="M 367,253 367,254.8 375,251.3 375,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__20"></path>
//     <path d="M 359,251.3 367,254.8 367,253 359,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__30"></path>
//     </g><g transform="matrix(1,0,0,1,-172,-136)" className="base base__1">
//     <path d="M375,249.5l-8-3.5l-8,3.5l0,0v1.8l8,3.5v0l8-3.5L375,249.5L375,249.5z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__0"></path>
//     <path d="M 367,253 367,254.8 375,251.3 375,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__20"></path>
//     <path d="M 359,251.3 367,254.8 367,253 359,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__30"></path></g>
//     <g transform="matrix(1,0,0,1,-215,-118)" className="base base__2">
//     <path d="M375,249.5l-8-3.5l-8,3.5l0,0v1.8l8,3.5v0l8-3.5L375,249.5L375,249.5z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__0"></path><path d="M 367,253 367,254.8 375,251.3 375,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__20"></path>
//     <path d="M 359,251.3 367,254.8 367,253 359,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__30"></path></g><g transform="matrix(1,0,0,1,-172,-98)" className="base base__3"><path d="M375,249.5l-8-3.5l-8,3.5l0,0v1.8l8,3.5v0l8-3.5L375,249.5L375,249.5z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__0"></path>
//     <path d="M 367,253 367,254.8 375,251.3 375,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__20"></path><path d="M 359,251.3 367,254.8 367,253 359,249.5  z" style={{strokeWidth: 0, strokeOpacity: 1}} className="base__fill__30"></path></g><g className="base-runner base__first"><text x="238" y="123" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}}></text></g>
//     <g className="base-runner base__second"><text x="195" y="105" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}}></text></g><g className="base-runner base__third"><text x="151" y="123" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}}></text></g><g className="base-runner base__home"><text x="195" y="167" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle", opacity: 1}}></text></g>
//     <g className="mlb-gamecast__defense mlb-gamecast__defense--active"><text x="195" y="168" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="catcher">Y. Gomes</text><text x="140" y="125" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="third-base">A. Cabrera</text><text x="245" y="125" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="first-base">E. Thames</text>
//     <text x="155" y="100" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="short-stop">T. Turner</text><text x="235" y="100" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="second-base">L. Garcia</text>
//     <text x="95" y="75" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="left-field">J. Soto</text><text x="195" y="55" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="center-field">V. Robles</text><text x="290" y="75" fill="#ffffff" style={{fontSize: '11px', textAnchor: "middle"}} className="right-field">A. Eaton</text></g>
//     <g className="baseball" style={{display:"none"}}><circle cx="8" cy="8" r="3" fill="#ffffff" stroke="#000000" style={{strokeWidth: "0.8"}}></circle></g><g transform="matrix(0.6475,0,0,0.6475,246.7964,58.7987)" className="hit-result hit-result-out" style={{opacity: 0}}><svg width="11px" height="5px" viewBox="0 0 11 5" version="1.1">
//     <g id="--Field-Toolkit" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="Artboard" transform="translate(-323.000000, -417.000000)"><g id="Group-9" transform="translate(323.000000, 417.000000)"><g id="indicator" transform="translate(9.000000, 1.000000)" fill="#2C6F11"><path d="M0.89506087,0.4915 C0.89506087,0.4615 0.894017391,0.4415 0.894017391,0.4415 L0.8888,0.4415 C0.891930435,0.4585 0.892973913,0.4745 0.89506087,0.4915" id="Fill-10"></path></g>
//     <g id="Group-8" strokeWidth="0.5" stroke="#1D1E1F" fill="#1D1E1F"><polygon id="Rectangle-2" points="9.3922999 0.754628932 1.17403749 4.28087912 0 3.77712909 8.21826241 0.250878906"></polygon><polygon id="Rectangle-2" points="10.1922999 3.77712909 9.01826241 4.28087912 0.8 0.754628932 1.97403749 0.250878906">
//     </polygon></g></g></g></g></svg></g>
//       <g transform="matrix(1,0,0,1,158.04,51.0733)" className="hit-result hit-result-hit" style={{opacity: 0}}><svg width="24px" height="12px" viewBox="0 0 24 12" version="1.1">
//         <defs>
//           <polygon id="path-1" points="0 12 0 0 23.4292174 0 23.4292174 12"></polygon>
//         </defs>
//         <g id="Field-Toolkit" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="field-toolkit" transform="translate(-40.000000, -2026.000000)">
//         <g id="indicator" transform="translate(40.000000, 2026.000000)">
//           <path d="M20.0190261,6.0123 C20.0190261,8.1643 16.3105043,9.9083 11.7369391,9.9083 C7.16233043,9.9083 3.4538087,8.1643 3.4538087,6.0123 C3.4538087,3.8603 7.16233043,2.1163 11.7369391,2.1163 C16.3105043,2.1163 20.0190261,3.8603 20.0190261,6.0123" id="Fill-1" fillOpacity="0.2" fill="#000000"></path>
//           <g id="Group-5"><mask id="mask-2" fill="white"></mask><g id="Clip-4"></g>
//           <path d="M11.714713,10.5 C6.86253913,10.5 2.92862609,8.485 2.92862609,6 C2.92862609,3.515 6.86253913,1.5 11.714713,1.5 C16.566887,1.5 20.5008,3.515 20.5008,6 C20.5008,8.485 16.566887,10.5 11.714713,10.5 M11.714713,0 C5.24514783,0 -0.000417391305,2.686 -0.000417391305,6 C-0.000417391305,9.314 5.24514783,12 11.714713,12 C18.1842783,12 23.4298435,9.314 23.4298435,6 C23.4298435,2.686 18.1842783,0 11.714713,0" id="Fill-3" fill="#6DBF38" mask="url(#mask-2)"></path>
//         </g>
//         <path d="M20.5006957,6 C20.5006957,8.485 16.5667826,10.5 11.7146087,10.5 C6.86243478,10.5 2.92852174,8.485 2.92852174,6 C2.92852174,3.515 6.86243478,1.5 11.7146087,1.5 C16.5667826,1.5 20.5006957,3.515 20.5006957,6 Z" id="Stroke-6" stroke="#71D133"></path>
//         <path d="M11.6889391,7.7728 C8.88615652,7.7728 6.60615652,6.8458 6.48302609,5.6828 C6.47885217,5.9488 6.47154783,6.3928 6.47154783,6.4548 C6.47154783,7.6638 8.80789565,8.6428 11.6889391,8.6428 C14.5699826,8.6428 16.9063304,7.6638 16.9063304,6.4548 C16.9063304,6.3608 16.901113,5.9288 16.8969391,5.6608 C16.8019826,6.8338 14.5094609,7.7728 11.6889391,7.7728" id="Fill-8" fill="#043E52"></path>
//         <path d="M16.8950609,5.4915 C16.8950609,5.4615 16.8940174,5.4415 16.8940174,5.4415 L16.8888,5.4415 C16.8919304,5.4585 16.8929739,5.4745 16.8950609,5.4915" id="Fill-10" fill="#2C6F11"></path>
//         <path d="M6.47154783,5.5448 C6.47154783,6.7528 8.80789565,7.7328 11.6889391,7.7328 C14.5699826,7.7328 16.9063304,6.7528 16.9063304,5.5448 C16.9063304,4.3368 14.5699826,3.3568 11.6889391,3.3568 C8.80789565,3.3568 6.47154783,4.3368 6.47154783,5.5448" id="Fill-12" fill="#26B8EC"></path>
//         </g></g></g></svg>
//       </g>
//     </svg>);
// };

const FootballField = (props) => {
  const [isHeartedLeft, setIsHeartedLeft] = React.useState(true);
  const [isHeartedRight, setIsHeartedRight] = React.useState(true);

  const [isThrowingRight, setIsThrowingRight] = React.useState(false);
  const [isThrowingLeft, setIsThrowingLeft] = React.useState(false);
  const hideXO = React.useRef(false);

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

const BasketballCourt = (props) => {
  return (
    <svg id="shotChart-02-svg" style={{paddingTop: '32px', height: '100%', maxWidth:'500px', width:'90%', overflow: 'visible'}} preserveAspectRatio="xMinYMax meet" viewBox="0 0 590 120">
      <defs>
        <radialGradient cx="0" cy="0" r="5" id="radialGradientSij1i6j9n2c">
          <stop offset="0%" stopColor="#d56900"></stop>
          <stop offset="100%" stopColor="#000000"></stop>
        </radialGradient>
        <radialGradient cx="0" cy="0" r="5" id="radialGradientSij1i6j9n2t"><stop offset="0%" stopColor="#d56900"></stop>
          <stop offset="100%" stopColor="#000000"></stop></radialGradient><radialGradient cx="0" cy="0" r="5" id="radialGradientSij1i6j9n3a">
          <stop offset="0%" stopColor="#d56900"></stop><stop offset="100%" stopColor="#000000"></stop>
        </radialGradient>
      </defs>
      <g className="court">
      <path d="M 550.7,0 584,109.5 0,109.5 33.3,0 z" fill="#ddc8ad" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 584,109.5 583.8,114 0.2,114 0,109.5 z" fill="#968775" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path><path d="M566.8,49.5"></path>
      <path d="M 131.6,34.6 125.2,69.6 12.1,69.6 22.7,34.6 z" fill="#d9ba93" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 561.3,34.6 571.9,69.6 458.8,69.6 452.4,34.6 z" fill="#d9ba93" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 386.3,0 386.7,3.9 384.9,3.9 384.5,0 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 199.5,0 199.1,3.9 197.3,3.9 197.7,0 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 460.4,32.5 460.8,34.4 460.8,34.6 459,34.6 459,34.4 458.6,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 125.4,32.5 125,34.4 125,34.6 123.2,34.6 123.2,34.4 123.6,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 71.7,32.5 71.2,34.4 71.1,34.6 69.3,34.6 69.4,34.4 69.9,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 79.3,32.5 78.8,34.4 78.8,34.6 76.9,34.6 77,34.4 77.5,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 483,32.5 483.4,34.4 483.4,34.6 481.6,34.6 481.6,34.4 481.2,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 514.1,32.5 514.6,34.4 514.7,34.6 512.9,34.6 512.8,34.4 512.3,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 506.5,32.5 507,34.4 507.1,34.6 505.2,34.6 505.2,34.4 504.7,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 102.8,32.5 102.4,34.4 102.4,34.6 100.6,34.6 100.6,34.4 101,32.5 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 125,34.4 131.6,34.4 130.8,38.6 129,38.6 129.6,35.1 22.5,35.1 22.7,34.4 69.4,34.4 69.3,34.6 71.1,34.6 71.2,34.4 77,34.4 76.9,34.6 78.8,34.6 78.8,34.4 100.6,34.4 100.6,34.6 102.4,34.6 102.4,34.4 123.2,34.4 123.2,34.6 125,34.6 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 514.6,34.4 561.3,34.4 561.5,35.1 454.4,35.1 455,38.6 453.2,38.6 452.4,34.4 459,34.4 459,34.6 460.8,34.6 460.8,34.4 481.6,34.4 481.6,34.6 483.4,34.6 483.4,34.4 505.2,34.4 505.2,34.6 507.1,34.6 507,34.4 512.8,34.4 512.9,34.6 514.7,34.6 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M129,38.6h1.8l0,0c-0.2,0-0.3,0-0.5,0c-0.2,0-0.3,0-0.5,0c-0.2,0-0.3,0-0.5,0S129.1,38.6,129,38.6 L129,38.6z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M453.2,38.6h1.8h0.1c-0.2,0-0.3,0-0.5,0c-0.2,0-0.3,0-0.5,0s-0.3,0-0.5,0 C453.5,38.6,453.3,38.6,453.2,38.6L453.2,38.6z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M21.2,39.3l0.2-0.7h107.5c-0.4,0-0.9,0-1.3,0c-0.4,0-0.9,0-1.3,0c-0.4,0-0.9,0-1.3,0 c-0.4,0-0.9,0-1.3,0.1l0.1,0.5h-5.6c0,0-0.1,0-0.1,0s0,0-0.1,0c0,0,0,0-0.1,0c0,0,0,0-0.1,0H21.2z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M455.1,38.6l107.5,0l0.2,0.7H466c0,0,0,0-0.1,0c0,0,0,0-0.1,0c0,0,0,0-0.1,0c0,0,0,0-0.1,0l-5.7,0 l0.1-0.5c-0.4,0-0.9,0-1.3-0.1s-0.9,0-1.3,0c-0.4,0-0.9,0-1.3,0S455.5,38.6,455.1,38.6z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M460.1,39.3l0,0.2c-0.4,0-0.8,0-1.2-0.1c-0.4,0-0.8,0-1.2,0c-0.4,0-0.8,0-1.2,0s-0.8,0-1.2,0 c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0s-0.1,0-0.1,0l-0.1-0.7c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0 c0,0,0.1,0,0.1,0c0.4,0,0.9,0,1.3,0s0.9,0,1.3,0c0.4,0,0.9,0,1.3,0s0.9,0,1.3,0.1L460.1,39.3z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M128.9,38.6c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0l-0.1,0.7c0,0-0.1,0-0.1,0 c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c-0.4,0-0.8,0-1.2,0c-0.4,0-0.8,0-1.2,0c-0.4,0-0.8,0-1.2,0 c-0.4,0-0.8,0-1.2,0.1l0-0.2l-0.1-0.5c0.4,0,0.8,0,1.3-0.1c0.4,0,0.9,0,1.3,0c0.4,0,0.9,0,1.3,0 C128.1,38.7,128.5,38.6,128.9,38.6z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M471.1,40.1l-0.7,0.6c-0.4-0.1-0.8-0.1-1.2-0.2c-0.4-0.1-0.8-0.1-1.3-0.2c-0.4-0.1-0.9-0.1-1.3-0.2 c-0.4-0.1-0.9-0.1-1.3-0.2l0.4-0.6l0,0c0,0,0,0,0.1,0c0,0,0,0,0.1,0c0,0,0,0,0.1,0c0,0,0,0,0.1,0c0.4,0.1,0.9,0.1,1.3,0.2 c0.4,0.1,0.9,0.1,1.3,0.2c0.4,0.1,0.8,0.1,1.3,0.2C470.3,39.9,470.7,40,471.1,40.1z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M118.2,39.3L118.2,39.3l0.4,0.6c-0.4,0.1-0.9,0.1-1.3,0.2c-0.4,0.1-0.9,0.1-1.3,0.2 c-0.4,0.1-0.8,0.1-1.3,0.2c-0.4,0.1-0.8,0.1-1.2,0.2l-0.7-0.6c0.4-0.1,0.8-0.1,1.2-0.2c0.4-0.1,0.8-0.1,1.3-0.2 c0.4-0.1,0.9-0.1,1.3-0.2c0.4-0.1,0.9-0.1,1.3-0.2c0,0,0,0,0.1,0c0,0,0,0,0.1,0S118.1,39.3,118.2,39.3 C118.2,39.3,118.2,39.3,118.2,39.3z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M480.7,42.5l-1.2,0.5c-0.3-0.1-0.7-0.2-1-0.3c-0.4-0.1-0.7-0.2-1.1-0.3c-0.4-0.1-0.7-0.2-1.1-0.3 c-0.4-0.1-0.8-0.2-1.1-0.3l1-0.5c0.4,0.1,0.8,0.2,1.2,0.3c0.4,0.1,0.8,0.2,1.2,0.3c0.4,0.1,0.8,0.2,1.1,0.3 C480,42.2,480.4,42.4,480.7,42.5z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M103.3,42.5c0.4-0.1,0.7-0.2,1.1-0.4c0.4-0.1,0.7-0.2,1.1-0.3c0.4-0.1,0.8-0.2,1.2-0.3 c0.4-0.1,0.8-0.2,1.2-0.3l0.9,0.5c-0.4,0.1-0.8,0.2-1.1,0.3c-0.4,0.1-0.7,0.2-1.1,0.3c-0.4,0.1-0.7,0.2-1.1,0.3 c-0.4,0.1-0.7,0.2-1,0.3L103.3,42.5z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M100.7,44.5c-0.3,0.1-0.6,0.3-0.9,0.4c-0.3,0.1-0.5,0.3-0.8,0.4c-0.3,0.1-0.5,0.3-0.8,0.4 c-0.2,0.1-0.5,0.3-0.7,0.4l-1.6-0.3c0.2-0.2,0.5-0.3,0.8-0.5c0.3-0.2,0.5-0.3,0.8-0.5c0.3-0.1,0.6-0.3,0.9-0.4 c0.3-0.1,0.6-0.3,0.9-0.4L100.7,44.5z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M488.1,45.9l-1.6,0.3c-0.2-0.1-0.5-0.3-0.7-0.4c-0.2-0.1-0.5-0.3-0.8-0.4c-0.3-0.1-0.5-0.3-0.8-0.4 c-0.3-0.1-0.6-0.3-0.9-0.4l1.4-0.4c0.3,0.1,0.6,0.3,0.9,0.4c0.3,0.1,0.6,0.3,0.9,0.4c0.3,0.1,0.5,0.3,0.8,0.5 C487.6,45.5,487.8,45.7,488.1,45.9z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M95.1,48c-0.2,0.2-0.3,0.3-0.5,0.5c-0.1,0.2-0.3,0.3-0.4,0.5c-0.1,0.2-0.3,0.3-0.4,0.5 c-0.1,0.2-0.2,0.3-0.3,0.5l-1.8-0.1c0.1-0.2,0.2-0.4,0.3-0.5c0.1-0.2,0.3-0.3,0.4-0.5c0.1-0.2,0.3-0.3,0.4-0.5 c0.2-0.2,0.3-0.3,0.5-0.5L95.1,48z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M492.3,49.9l-1.8,0.1c-0.1-0.2-0.2-0.3-0.3-0.5c-0.1-0.2-0.2-0.3-0.4-0.5c-0.1-0.2-0.3-0.3-0.4-0.5 c-0.1-0.2-0.3-0.3-0.5-0.5l1.7-0.2c0.2,0.2,0.3,0.3,0.5,0.5c0.2,0.2,0.3,0.3,0.4,0.5c0.1,0.2,0.3,0.3,0.4,0.5 C492.1,49.5,492.2,49.7,492.3,49.9z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M92.8,52c0,0.2,0,0.3,0,0.5c0,0.2,0,0.3,0,0.5c0,0.2,0,0.3,0.1,0.5c0,0.2,0.1,0.3,0.1,0.5l-1.8,0.1 c-0.1-0.2-0.1-0.3-0.1-0.5c0-0.2-0.1-0.4-0.1-0.5c0-0.2,0-0.4,0-0.5c0-0.2,0-0.4,0-0.5L92.8,52z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M491.2,52l1.9,0c0,0.2,0,0.4,0,0.5c0,0.2,0,0.4,0,0.5c0,0.2,0,0.4-0.1,0.5c0,0.2-0.1,0.4-0.1,0.5L491,54 c0.1-0.2,0.1-0.3,0.1-0.5c0-0.2,0.1-0.3,0.1-0.5c0-0.2,0-0.3,0-0.5C491.2,52.3,491.2,52.2,491.2,52z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M487.9,57.8c0.2-0.1,0.4-0.3,0.6-0.4c0.2-0.2,0.4-0.3,0.5-0.5c0.2-0.2,0.3-0.3,0.5-0.5 c0.1-0.2,0.3-0.3,0.4-0.5l1.8,0.3c-0.1,0.2-0.3,0.3-0.4,0.5c-0.2,0.2-0.3,0.3-0.5,0.5c-0.2,0.2-0.4,0.3-0.5,0.5 c-0.2,0.2-0.4,0.3-0.6,0.5L487.9,57.8z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M92.3,56.2l1.8-0.3c0.1,0.2,0.3,0.3,0.4,0.5c0.1,0.2,0.3,0.3,0.5,0.5c0.2,0.2,0.3,0.3,0.5,0.5 c0.2,0.2,0.4,0.3,0.6,0.4l-1.7,0.4c-0.2-0.2-0.4-0.3-0.6-0.5c-0.2-0.2-0.4-0.3-0.5-0.5c-0.2-0.2-0.3-0.3-0.5-0.5 C92.6,56.5,92.5,56.4,92.3,56.2z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M532.1,42.6l0.2,0.7h-4.6c-0.2,0-1.4,0-3.2,0.2c-1.7,0.2-4,0.5-6.1,1c-2.2,0.6-4.2,1.3-5.7,2.5 c-1.4,1.1-2.2,2.6-1.7,4.6c0.5,2,2,3.5,4,4.6c2,1.2,4.5,2,7,2.6c2.5,0.6,4.9,0.9,6.8,1.1c1.9,0.2,3.2,0.2,3.3,0.2h4.8l0.2,0.7 h-4.8c-0.1,0-1.4,0-3.4-0.2c-2-0.2-4.7-0.5-7.5-1.2c-2.7-0.6-5.5-1.5-7.8-2.8c-2.2-1.3-3.9-2.9-4.4-5c-0.5-2.1,0.4-3.7,2-5 c1.6-1.2,3.9-2.1,6.3-2.7c2.4-0.6,4.9-0.9,6.8-1.1c1.9-0.2,3.2-0.2,3.3-0.2H532.1z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M56.6,42.6c0.1,0,1.4,0,3.3,0.2c1.9,0.2,4.4,0.5,6.8,1.1c2.4,0.6,4.7,1.5,6.3,2.7c1.6,1.2,2.5,2.8,2,5 c-0.5,2.1-2.2,3.8-4.4,5c-2.2,1.3-5,2.1-7.8,2.8c-2.7,0.6-5.4,1-7.4,1.2c-2,0.2-3.4,0.2-3.4,0.2H47l0.2-0.7H52 c0.2,0,1.5,0,3.3-0.2c1.9-0.2,4.3-0.5,6.8-1.1c2.5-0.6,5-1.4,7-2.6c2-1.2,3.5-2.7,4-4.6c0.5-1.9-0.3-3.4-1.7-4.6 c-1.4-1.1-3.5-1.9-5.7-2.5c-2.2-0.6-4.4-0.9-6.1-1c-1.7-0.2-3-0.2-3.2-0.2h-4.6l0.2-0.7H56.6z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M98.8,59.5c0.3,0.1,0.5,0.3,0.8,0.4c0.3,0.1,0.6,0.3,0.9,0.4c0.3,0.1,0.6,0.2,0.9,0.4 c0.3,0.1,0.6,0.2,0.9,0.3l-1.3,0.5c-0.3-0.1-0.7-0.2-1-0.4c-0.3-0.1-0.6-0.3-0.9-0.4c-0.3-0.1-0.6-0.3-0.9-0.4 c-0.3-0.1-0.6-0.3-0.9-0.4L98.8,59.5z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M481.7,60.9c0.3-0.1,0.6-0.2,0.9-0.3c0.3-0.1,0.6-0.2,0.9-0.4c0.3-0.1,0.6-0.2,0.9-0.4 c0.3-0.1,0.5-0.3,0.8-0.4l1.5,0.5c-0.3,0.1-0.6,0.3-0.9,0.4c-0.3,0.1-0.6,0.3-0.9,0.4c-0.3,0.1-0.6,0.3-0.9,0.4 c-0.3,0.1-0.7,0.2-1,0.4L481.7,60.9z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M472.9,63.1c0.4-0.1,0.8-0.1,1.2-0.2c0.4-0.1,0.8-0.2,1.2-0.2c0.4-0.1,0.8-0.2,1.2-0.2 c0.4-0.1,0.8-0.2,1.1-0.3l1.1,0.6c-0.4,0.1-0.8,0.2-1.2,0.3c-0.4,0.1-0.8,0.2-1.2,0.3c-0.4,0.1-0.8,0.2-1.2,0.2 c-0.4,0.1-0.8,0.2-1.3,0.2L472.9,63.1z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M105.4,62.8l1.1-0.6c0.4,0.1,0.7,0.2,1.1,0.3c0.4,0.1,0.8,0.2,1.2,0.2c0.4,0.1,0.8,0.2,1.2,0.2 c0.4,0.1,0.8,0.1,1.2,0.2l-0.9,0.7c-0.4-0.1-0.8-0.1-1.3-0.2c-0.4-0.1-0.8-0.2-1.2-0.2c-0.4-0.1-0.8-0.2-1.2-0.3 C106.1,62.9,105.7,62.9,105.4,62.8z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M115.8,64.2l0.4-0.4c0.4,0,0.9,0.1,1.3,0.1c0.4,0,0.9,0.1,1.3,0.1c0.4,0,0.9,0.1,1.3,0.1 c0.4,0,0.9,0,1.4,0.1l0,0.1l-0.3,0.6c-0.5,0-1,0-1.4-0.1c-0.5,0-0.9-0.1-1.4-0.1c-0.5,0-0.9-0.1-1.4-0.1c-0.5,0-0.9-0.1-1.4-0.1 L115.8,64.2z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M467.8,63.8l0.3,0.4l0.2,0.3c-0.5,0-0.9,0.1-1.4,0.1c-0.5,0-0.9,0.1-1.4,0.1c-0.5,0-0.9,0.1-1.4,0.1 c-0.5,0-0.9,0-1.4,0.1l-0.3-0.6l0-0.1c0.5,0,0.9,0,1.4-0.1c0.4,0,0.9,0,1.3-0.1c0.4,0,0.9-0.1,1.3-0.1 C466.9,63.8,467.4,63.8,467.8,63.8z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M457.9,64.9L457.9,64.9c0.2,0,0.3,0,0.5,0c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0c0.2,0,0.3,0,0.5,0h-0.1H457.9z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M455.1,38.6c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0l0.1,0.7c0,0,0.1,0,0.1,0 s0.1,0,0.1,0c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0l4.6,24.9l0.1,0.7c-0.2,0-0.3,0-0.5,0c-0.2,0-0.3,0-0.5,0s-0.3,0-0.5,0 c-0.2,0-0.3,0-0.5,0c-4.7-0.1-9.2-0.5-13.4-1.3c-4.1-0.7-7.9-1.7-11.1-2.9c-3.2-1.2-5.8-2.6-7.7-4.2c-1.9-1.5-3.1-3.2-3.3-5 c-0.3-1.7,0.4-3.4,1.9-4.9c1.4-1.5,3.6-2.9,6.4-4c2.8-1.2,6.1-2.1,10-2.8c3.8-0.7,8-1.1,12.6-1.2c0.2,0,0.3,0,0.5,0 c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0C454.8,38.6,454.9,38.6,455.1,38.6z M457.8,64.2l-4.4-24.8c-4.3,0.1-8.3,0.5-11.9,1.1 c-3.6,0.6-6.8,1.5-9.4,2.6c-2.6,1.1-4.7,2.4-6,3.8c-1.4,1.4-2,3-1.7,4.7c0.2,1.7,1.3,3.2,3.1,4.7c1.8,1.5,4.3,2.8,7.3,3.9 c3,1.1,6.6,2.1,10.5,2.8C449.1,63.6,453.4,64.1,457.8,64.2" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M468.4,64.5l-0.2-0.3h102.2l0.2,0.7H459.9l-0.1-0.7h2.7l0.3,0.6c0.5,0,1,0,1.4-0.1c0.5,0,0.9-0.1,1.4-0.1 c0.5,0,0.9-0.1,1.4-0.1C467.5,64.5,467.9,64.5,468.4,64.5z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M121.5,64.2h2.7l-0.1,0.7H13.5l0.2-0.7h102.2l-0.2,0.3c0.5,0,0.9,0.1,1.4,0.1c0.5,0,0.9,0.1,1.4,0.1 c0.5,0,0.9,0.1,1.4,0.1c0.5,0,1,0,1.4,0.1L121.5,64.2z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M130.8,38.7c4.5,0.1,8.8,0.5,12.6,1.2c3.8,0.7,7.2,1.6,10,2.8c2.8,1.2,5,2.5,6.4,4 c1.4,1.5,2.1,3.2,1.9,4.9c-0.3,1.8-1.4,3.4-3.3,5c-1.9,1.5-4.5,3-7.7,4.2c-3.2,1.2-7,2.2-11.1,2.9c-4.1,0.7-8.7,1.2-13.4,1.3 c-0.2,0-0.3,0-0.5,0c-0.2,0-0.3,0-0.5,0s-0.3,0-0.5,0c-0.2,0-0.3,0-0.5,0l0.1-0.7l4.6-24.9c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0 c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0l0.1-0.7c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c0.2,0,0.3,0,0.5,0 c0.2,0,0.3,0,0.5,0c0.2,0,0.3,0,0.5,0C130.5,38.6,130.6,38.6,130.8,38.7z M126.1,64.2c4.5-0.1,8.7-0.5,12.7-1.2 c3.9-0.7,7.5-1.6,10.5-2.8c3-1.1,5.5-2.5,7.3-3.9c1.8-1.5,2.9-3,3.1-4.7c0.2-1.7-0.4-3.2-1.7-4.7c-1.3-1.4-3.4-2.7-6-3.8 c-2.6-1.1-5.8-2-9.4-2.6c-3.6-0.6-7.6-1-11.9-1.1L126.1,64.2" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M124.2,64.9L124.2,64.9c0.1,0,0.3,0,0.4,0c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0c0.2,0,0.3,0,0.5,0l0,0H124.2z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 459.8,64.9 460.5,68.7 571.7,68.7 571.9,69.4 523.4,69.4 523.4,69.3 521.5,69.3 521.5,69.4 515.5,69.4 515.5,69.3 513.6,69.3 513.6,69.4 490.9,69.4 490.9,69.3 489,69.3 489.1,69.4 467.4,69.4 467.4,69.3 465.5,69.3 465.6,69.4 458.8,69.4 457.9,64.9 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 123.5,68.7 124.2,64.9 126.1,64.9 125.2,69.4 118.4,69.4 118.5,69.3 116.6,69.3 116.6,69.4 94.9,69.4 95,69.3 93.1,69.3 93.1,69.4 70.4,69.4 70.4,69.3 68.5,69.3 68.5,69.4 62.5,69.4 62.5,69.3 60.6,69.3 60.6,69.4 12.1,69.4 12.3,68.7 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 523.4,69.3 523.4,69.4 524,71.6 522.1,71.6 521.5,69.4 521.5,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 490.9,69.3 490.9,69.4 491.4,71.6 489.5,71.6 489.1,69.4 489,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 467.4,69.3 467.4,69.4 467.9,71.6 466,71.6 465.6,69.4 465.5,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 62.5,69.3 62.5,69.4 61.9,71.6 60,71.6 60.6,69.4 60.6,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 95,69.3 94.9,69.4 94.5,71.6 92.6,71.6 93.1,69.4 93.1,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 70.4,69.3 70.4,69.4 69.9,71.6 68,71.6 68.5,69.4 68.5,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 118.5,69.3 118.4,69.4 118,71.6 116.1,71.6 116.6,69.4 116.6,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 515.5,69.3 515.5,69.4 516,71.6 514.1,71.6 513.6,69.4 513.6,69.3 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M552.6,5.9l0.2,0.6h-83.1c-0.6,0.1-2,0.3-4.1,0.8c-2.1,0.4-4.7,1-7.8,1.7c-3.1,0.8-6.6,1.7-10.3,2.8 c-3.7,1.1-7.6,2.5-11.4,4.1c-2.4,1-4.7,2-6.9,3.1c-2.2,1.1-4.2,2.2-6.1,3.3c-1.9,1.1-3.7,2.3-5.3,3.5c-1.6,1.2-3.1,2.5-4.4,3.8 c-1.7,1.6-3.1,3.3-4.3,5c-1.2,1.7-2.2,3.5-2.9,5.3c-0.7,1.8-1.2,3.7-1.4,5.7c-0.2,1.9-0.2,3.9,0,6c0.3,2,0.8,4.1,1.5,6.1 c0.7,2,1.7,4,3,5.9c1.2,1.9,2.7,3.8,4.4,5.7c1.7,1.9,3.7,3.7,5.9,5.5c1.8,1.4,3.7,2.8,5.8,4.2c2.1,1.4,4.4,2.7,6.8,4 c2.4,1.3,5,2.6,7.7,3.8c2.7,1.2,5.6,2.4,8.6,3.6c4.8,1.9,9.5,3.5,14,4.8c4.5,1.4,8.8,2.5,12.5,3.4c3.8,0.9,7,1.6,9.5,2.1 c2.5,0.5,4.2,0.8,4.9,0.9h92.3l0.2,0.8h-92.8c-1-0.2-6.7-1.1-14.7-3c-8-1.9-18.3-4.7-28.6-8.8c-10.2-4-20.4-9.2-28.3-15.7 c-7.8-6.4-13.3-14.2-14.4-23.3c-1.1-9,2.4-16.3,8.3-22.2c5.8-5.8,13.9-10.3,22.3-13.8c8.3-3.4,16.8-5.8,23.4-7.3 c6.6-1.5,11.4-2.3,12.3-2.4H552.6z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M114.8,5.9c0.9,0.1,5.7,0.9,12.3,2.4c6.6,1.5,15.1,3.9,23.4,7.3c8.3,3.4,16.5,7.9,22.3,13.8 c5.9,5.9,9.4,13.2,8.3,22.2c-1.1,9.2-6.7,16.9-14.4,23.3c-7.9,6.5-18.1,11.7-28.3,15.7c-10.3,4.1-20.6,6.9-28.6,8.8 c-8,1.9-13.7,2.8-14.7,3H2l0.2-0.8h92.3c0.7-0.1,2.4-0.4,4.9-0.9c2.5-0.5,5.7-1.2,9.5-2.1c3.7-0.9,8-2.1,12.5-3.4 c4.5-1.4,9.3-3,14-4.8c3-1.2,5.9-2.4,8.6-3.6c2.7-1.2,5.3-2.5,7.7-3.8c2.4-1.3,4.7-2.6,6.8-4c2.1-1.4,4-2.8,5.8-4.2 c2.2-1.8,4.2-3.6,5.9-5.5c1.7-1.9,3.2-3.8,4.4-5.7c1.2-1.9,2.2-3.9,3-5.9c0.7-2,1.2-4,1.5-6.1c0.3-2,0.3-4,0-6 c-0.2-1.9-0.7-3.8-1.4-5.7c-0.7-1.8-1.7-3.6-2.9-5.3c-1.2-1.7-2.6-3.4-4.3-5c-1.3-1.3-2.8-2.5-4.4-3.8c-1.6-1.2-3.4-2.4-5.3-3.5 c-1.9-1.1-3.9-2.3-6.1-3.3c-2.2-1.1-4.5-2.1-6.9-3.1c-3.8-1.6-7.7-2.9-11.4-4.1c-3.7-1.1-7.2-2.1-10.3-2.8 c-3.1-0.8-5.8-1.3-7.8-1.7c-2.1-0.4-3.5-0.7-4.1-0.8H31.2l0.2-0.6H114.8z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 292.9,0 292.9,38.6 292.9,39.3 292.9,45.1 292.9,45.7 292.9,57.5 292.9,58.2 292.9,64.2 292.9,64.9 293,109.8 291,109.8 291.1,64.9 291.1,64.2 291.1,58.2 291.1,57.5 291.1,45.7 291.1,45.1 291.1,39.3 291.1,38.6 291.1,0 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 397.9,104.9 398.4,109.8 396.4,109.8 395.9,104.9 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path>
      <path d="M 188.1,104.9 187.6,109.8 185.6,109.8 186.1,104.9 z" fill="#b59678" style={{strokeWidth: '0px', strokeOpacity: '1'}}></path></g>
      <image preserveAspectRatio="none" x="240" y="25" width="100" height="60"></image>
      <g transform="matrix(1,0,0,1,2,-10)" className="hoopLeft">
      <path d="M23.8,13.1v21.4l1,0l4.6-14L29.4,0.4l-1,0L23.8,13.1z" fill="#f7f8f8" style={{strokeWidth: '0px'}}></path>
      <path d="M29.2,20.5l-4.1,12.2l0-19.3l4-11.4L29.2,20.5z" fill="#cdcccc" style={{strokeWidth: '0px'}}></path>
      <path d="M 28.2,13 26.6,18.1 26.6,27 28.2,22.1   z" fill="#fbfcfc" style={{strokeWidth: '0px'}}></path>
      <path d="M 26.9,25.5 26.9,18.2 28,14.3 28,22   z" fill="#cdcccc" style={{strokeWidth: '0px'}}></path>
      <path d="M 24.8,13.1 23.8,13.1 23.8,34.5 24.8,34.5   z" fill="#f3f3f3" style={{strokeWidth: '0px'}}></path>
      <path d="M 29.3,0.4 28.3,0.3 23.8,13.1 24.8,13.1   z" fill="#f3f3f3" style={{strokeWidth: '0px'}}></path>
      <path d="M 4.9,21.9 7,21.9 8.4,33.5 16.6,54 11.2,70.9 5.3,43.3   z" fill={props.awayColor} style={{strokeWidth: '0px'}}></path>
      <path d="M 1.4,24.2 4.9,21.9 5.3,43.3 11.2,70.9 0.5,71.1   z" fill={props.awayColor} style={{strokeWidth: '0px'}}></path>
      <path d="M 4.8,18 1.4,21.1 6.3,15.4 23.8,18.1 23.8,21.4 23.8,19.5   z" fill="#e6e6e5" style={{strokeWidth: '0px'}}></path>
      <path d="M 1.4,24.2 1.4,21.1 4.8,18 23.8,19.5 23.8,21.4 7,21.9 4.9,21.9   z" fill="#cdcccc" style={{strokeWidth: '0px'}}></path></g>
      
      <ellipse cx="50" cy="0" rx="5" ry="5" id="bball-1" fill="#cf5300" stroke="#cf5300" style={{fillOpacity: 1, strokeWidth: 1}} className="shot away make"></ellipse>
      <ellipse cx="90" cy="50" rx="10" ry="5" id="shot-401236318321" fill={props.homeColor} stroke={props.homeColor} style={{fillOpacity: .25, strokeWidth: 1}} className="shot home miss"></ellipse>
      <ellipse cx="200" cy="90" rx="10" ry="5" id="shot-401236318321" fill={props.homeColor} stroke={props.homeColor} style={{fillOpacity: 1, strokeWidth: 1}} className="shot home miss"></ellipse>
      <ellipse cx="530" cy="0" rx="5" ry="5" id="bball-2" fill="#cf5300" stroke="#cf5300" style={{fillOpacity: 1, strokeWidth: 1}} className="shot away make"></ellipse>
      <ellipse cx="450" cy="25" rx="10" ry="5" id="shot-401236318352" fill={props.awayColor} stroke={props.awayColor} style={{fillOpacity: .25, strokeWidth: 1}} className="shot away make"></ellipse>
      <ellipse cx="375" cy="55" rx="10" ry="5" id="shot-401236318352" fill={props.awayColor} stroke={props.awayColor} style={{fillOpacity: 1, strokeWidth: 1}} className="shot away make"></ellipse>
      
      <g transform="matrix(1,0,0,1,552,-10)" className="hoopRight"><path d="M1.6,0.3l-1,0L0.5,20.5l4.6,14l1,0V13.1L1.6,0.3z" fill="#f7f8f8" style={{strokeWidth: '0px'}}></path>
      <path d="M0.8,2.1l4,11.4l0,19.3L0.8,20.5L0.8,2.1z" fill="#cdcccc" style={{strokeWidth: '0px'}}></path>
      <path d="M 1.7,13 3.4,18.1 3.4,27 1.7,22.1   z" fill="#fbfcfc" style={{strokeWidth: '0px'}}></path>
      <path d="M 3.1,25.5 3.1,18.2 1.9,14.3 1.9,22   z" fill="#cdcccc" style={{strokeWidth: '0px'}}></path>
      <path d="M 5.2,13.1 6.1,13.1 6.1,34.5 5.2,34.5   z" fill="#f3f3f3" style={{strokeWidth: '0px'}}></path>
      <path d="M 0.7,0.4 1.6,0.3 6.1,13.1 5.2,13.1   z" fill="#f3f3f3" style={{strokeWidth: '0px'}}></path>
      <path d="M 25,21.9 22.9,21.9 21.6,33.5 13.3,54 18.7,70.9 24.7,43.3   z" fill={props.homeColor} style={{strokeWidth: '0px'}}></path>
      <path d="M 28.6,24.2 25,21.9 24.7,43.3 18.7,70.9 29.4,71.1   z" fill={props.homeColor} style={{strokeWidth: '0px'}}></path>
      <path d="M 25.1,18 28.5,21.1 23.7,15.4 6.1,18.1 6.1,21.4 6.1,19.5   z" fill="#e6e6e5" style={{strokeWidth: '0px'}}></path>
      <path d="M 28.6,24.2 28.5,21.1 25.1,18 6.1,19.5 6.1,21.4 22.9,21.9 25,21.9   z" fill="#cdcccc" style={{strokeWidth: '0px'}}></path></g><g className="shots"></g><g className="shotAnimations"></g><g transform="matrix(1,0,0,1,30,12)" className="rimLeftTop">
      <path d="M0.5,1.3l0.5,0.3C2,0.6,4.7-0.1,7.5,0c2.6,0.1,4.4,1,4.5,1.9c0,0,0,0,0,0l0,0.5c0,0,0,0,0,0.1h-0.8   c0,0,0.1-0.1,0.1-0.1c0,0,0-0.1,0.1-0.1C11,1.5,9.5,0.9,7.4,0.8C4.7,0.6,2,1.4,1.4,2.4c0,0,0,0.1-0.1,0.1H0l0.4-1.3L0.5,1.3z" fill="#e72b25" style={{strokeWidth: '0px'}}></path>
      <path d="M0.5,1.3l0.5,0.3C2,0.6,4.7-0.1,7.5,0c3,0.2,5,1.2,4.4,2.4c0,0-0.1,0.1-0.1,0.1h-0.6c0,0,0.1-0.1,0.1-0.1   c0.6-1-1.2-2-3.9-2.2C4.6,0.1,2,0.8,1.4,1.9c-0.1,0.2-0.1,0.5,0,0.7H0l0.4-1.3L0.5,1.3z" fill="#ef4623" style={{strokeWidth: '0px'}}></path>
      <path d="M6.3,4.2C6.3,4.2,6.3,4.2,6.3,4.2c0.1,0,0.1,0,0.1-0.1l1-3.3l1.3,3.3c0,0.1,0.1,0.1,0.1,0.1    c0.1,0,0.1,0,0.1-0.1l0.6-2.9l1,2.2c0,0,0.1,0.1,0.1,0.1c0.1,0,0.1,0,0.1-0.1L11,1.5c0-0.1,0-0.1-0.1-0.1c-0.1,0-0.1,0-0.1,0.1    l-0.2,1.4l-1-2.1c0,0-0.1-0.1-0.1-0.1c-0.1,0-0.1,0-0.1,0.1L8.7,3.6L7.4,0.4c0,0-0.1-0.1-0.1-0.1c0,0,0,0,0,0    c-0.1,0-0.1,0-0.1,0.1l-1,3.3L5,0.3c0,0-0.1-0.1-0.1-0.1h0c-0.1,0-0.1,0-0.1,0.1L3.7,3.4L3.1,0.9c0-0.1-0.1-0.1-0.1-0.1    c-0.1,0-0.1,0-0.1,0.1L2.1,2.9L1.9,1.6c0-0.1-0.1-0.1-0.1-0.1c-0.1,0-0.1,0.1-0.1,0.1l0.3,1.8C2,3.5,2,3.6,2.1,3.6    c0.1,0,0.1,0,0.1-0.1L3,1.4l0.5,2.5C3.5,3.9,3.6,4,3.6,4c0.1,0,0.1,0,0.1-0.1l1.1-3.2l1.3,3.4C6.2,4.2,6.2,4.2,6.3,4.2z" fill="#ffffff" style={{strokeWidth: '0px'}}></path></g>
      <g transform="matrix(1,0,0,1,30,14.8)" className="rimLeftBottom"><path d="M5.5,1.5C3.4,1.4,1.9,0.8,1.6,0c0,0,0,0,0,0l9.7,0C10.6,1,8.1,1.6,5.5,1.5z" fill="none" style={{strokeWidth: '0px'}}></path>
      <path d="M1.6,0c0.3,0.8,1.8,1.4,3.9,1.5C8.1,1.6,10.6,1,11.3,0l0.8,0c0,0.1,0,0.3-0.1,0.4c-0.6,1.2-3.6,2-6.6,1.8   C3.1,2.1,1.4,1.4,1,0.6L0.2,3.1l-0.1,0L0,0.7L0.2,0L1.6,0C1.6,0,1.6,0,1.6,0z" fill="#e72b25" style={{strokeWidth: '0px'}}></path>
      <path d="M5.5,1.5C3.4,1.4,1.9,0.8,1.6,0l9.7,0C10.6,1,8.1,1.6,5.5,1.5z" fill="none" style={{strokeWidth: '0px'}}></path><path d="M5.5,1.5C8.1,1.6,10.6,1,11.3,0l0.6,0c-0.8,1.1-3.6,1.9-6.5,1.7C3.1,1.6,1.5,0.9,1,0.1L0.1,0.7L0,0.7L0.2,0   l1.4,0C1.9,0.8,3.4,1.4,5.5,1.5z" fill="#ef4623" style={{strokeWidth: '0px'}}></path></g><g transform="matrix(1,0,0,1,31,16.5)" className="rimLeftNet"><path d="M9.3,4.2l1.3-4c0-0.1,0-0.1-0.1-0.2c-0.1,0-0.1,0-0.2,0.1l-1,3.2l0.1-2.5c0-0.1-0.1-0.1-0.1-0.1 c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0-0.1,0-0.2,0.1L7.8,5.2L7.1,1.2C7.1,1.2,7,1.1,7,1.1c-0.1,0-0.1,0-0.1,0.1L5.4,5.2L4,1.1 C4,1.1,3.9,1,3.9,1c-0.1,0-0.1,0-0.1,0.1l-0.7,4L1.7,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0 c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0l0.2,3.2L0.2,0.2c0-0.1-0.1-0.1-0.2-0.1C0,0.1,0,0.2,0,0.3l1.7,4.5l0.2,2.9 L1.7,9.5c0,0.1,0,0.1,0.1,0.1c0,0,0.1,0,0.1,0L2.6,9L3,9.9c0,0,0,0.1,0.1,0.1c0,0,0.1,0,0.1,0L4.4,9l1,1c0,0,0.1,0,0.1,0h0 c0,0,0.1,0,0.1,0l1-1l1.2,1c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1-0.1l0.5-0.8L9,9.7c0,0,0.1,0,0.1,0c0,0,0.1-0.1,0.1-0.1L9.1,7.7L9.3,4.2 z M8.9,7.3L8.5,6.7c0,0,0,0,0,0L9,5.1L8.9,7.3z M8.3,8.5L7.9,7.7L8.4,7l0.5,0.7L8.3,8.5z M6.5,8.6L5.6,7.8l0.9-0.9l1.1,0.9L6.5,8.6 z M4.4,8.6L3.3,7.7l1.1-0.8l0.8,0.9L4.4,8.6z M2.6,8.4L2.2,7.7l0.4-0.8L3,7.7L2.6,8.4z M2.7,6.6C2.7,6.6,2.7,6.6,2.7,6.6l0.4-0.7 c0,0,0,0,0,0l1.1,0.9L3.2,7.5L2.7,6.6z M4.6,6.6l0.8-0.9l1,1L5.4,7.6L4.6,6.6z M6.7,6.6l1.1-0.8l0.5,0.9c0,0,0,0,0,0L7.8,7.5 L6.7,6.6z M9.1,1.6L9,4.2L8.3,6.4L7.9,5.7L9.1,1.6z M6.9,1.7l0.7,3.9L6.5,6.5l-1-1L6.9,1.7z M3.9,1.7l1.3,3.8l-0.8,1L3.3,5.6 L3.9,1.7z M1.8,1.8L3,5.6L2.6,6.3L2,4.7L1.8,1.8z M2.4,6.6C2.4,6.6,2.5,6.6,2.4,6.6L2.2,7.2L2,5.5L2.4,6.6z M2.1,8.1l0.3,0.6L2,9.2 L2.1,8.1z M3.2,9.6L2.7,8.7c0,0,0,0,0,0l0.5-0.8l1,0.9L3.2,9.6z M5.5,9.7L4.6,8.8l0.9-0.9l0.9,0.9L5.5,9.7z M7.8,9.6L6.7,8.8l1-0.9 l0.4,1c0,0,0,0,0,0L7.8,9.6z M8.5,8.8l0.4-0.7l0.1,1.2L8.5,8.8z" fill="#ffffff" style={{strokeWidth: '0px'}}></path></g>
      <g transform="matrix(1,0,0,1,542,12)" className="rimRightTop"><path d="M11.4,1.3l-0.5,0.3C10,0.6,7.3-0.1,4.5,0C1.9,0.2,0.1,1,0,2c0,0,0,0,0,0l0,0.5c0,0,0,0,0,0.1h0.8 c0,0-0.1-0.1-0.1-0.1c0,0,0-0.1-0.1-0.1C1,1.5,2.5,0.9,4.6,0.8c2.7-0.1,5.4,0.6,5.9,1.6c0,0,0,0.1,0.1,0.1h1.4l-0.4-1.3L11.4,1.3z" fill="#e72b25" style={{strokeWidth: '0px'}}></path><path d="M11.4,1.3l-0.5,0.3C10,0.6,7.3-0.1,4.5,0c-3,0.2-5,1.2-4.4,2.4c0,0,0.1,0.1,0.1,0.1h0.6 c0,0-0.1-0.1-0.1-0.1c-0.6-1,1.2-2,3.9-2.2c2.7-0.1,5.4,0.6,5.9,1.6c0.1,0.2,0.1,0.5,0,0.7h1.4l-0.4-1.3L11.4,1.3z" fill="#ef4623" style={{strokeWidth: '0px'}}></path>
      <path d="M5.7,4.2C5.7,4.2,5.7,4.2,5.7,4.2c-0.1,0-0.1,0-0.1-0.1l-1-3.3L3.3,4.1c0,0.1-0.1,0.1-0.1,0.1 c-0.1,0-0.1,0-0.1-0.1L2.4,1.1l-1,2.2c0,0-0.1,0.1-0.1,0.1c-0.1,0-0.1,0-0.1-0.1L0.9,1.5c0-0.1,0-0.1,0.1-0.1c0.1,0,0.1,0,0.1,0.1 l0.2,1.4l1-2.1c0,0,0.1-0.1,0.1-0.1c0.1,0,0.1,0,0.1,0.1l0.6,2.9l1.3-3.2c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0,0c0.1,0,0.1,0,0.1,0.1 l1,3.3l1.2-3.4c0,0,0.1-0.1,0.1-0.1h0c0.1,0,0.1,0,0.1,0.1l1.1,3.1l0.5-2.5c0-0.1,0.1-0.1,0.1-0.1c0.1,0,0.1,0,0.1,0.1l0.8,2.1 L10,1.6c0-0.1,0.1-0.1,0.1-0.1c0.1,0,0.1,0.1,0.1,0.1L10,3.5c0,0.1-0.1,0.1-0.1,0.1c-0.1,0-0.1,0-0.1-0.1L9,1.4L8.4,3.9 C8.4,3.9,8.4,4,8.3,4C8.3,4,8.2,4,8.2,3.9L7.1,0.7L5.8,4.2C5.8,4.2,5.7,4.2,5.7,4.2z" fill="#ffffff" style={{strokeWidth: '0px'}}></path></g><g transform="matrix(1,0,0,1,542,14.8)" className="rimRightBottom"><path d="M6.6,1.5c2.1-0.1,3.6-0.7,3.9-1.5c0,0,0,0,0,0H0.8C1.5,1,4,1.6,6.6,1.5z" fill="none" style={{strokeWidth: '0px'}}></path>
      <path d="M10.6,0c-0.3,0.8-1.8,1.4-3.9,1.5C4,1.6,1.5,1,0.8,0H0c0,0.1,0,0.3,0.1,0.4c0.6,1.2,3.6,2,6.6,1.8   c2.3-0.1,4-0.8,4.4-1.6l0.8,2.5l0.1,0l0.1-2.4L11.9,0L10.6,0C10.6,0,10.6,0,10.6,0z" fill="#e72b25" style={{strokeWidth: '0px'}}></path>
      <path d="M6.6,1.5c2.1-0.1,3.6-0.7,3.9-1.5H0.8C1.5,1,4,1.6,6.6,1.5z" fill="none" style={{strokeWidth: '0px'}}></path><path d="M6.6,1.5C4,1.6,1.5,1,0.8,0H0.2C1,1.1,3.8,1.9,6.7,1.7c2.3-0.1,3.9-0.8,4.4-1.6L12,0.7l0.1,0L11.9,0h-1.4   C10.2,0.8,8.7,1.4,6.6,1.5z" fill="#ef4623" style={{strokeWidth: '0px'}}></path></g><g transform="matrix(1,0,0,1,542,16.5)" className="rimRightNet">
      <path d="M9.3,4.2l1.3-4c0-0.1,0-0.1-0.1-0.2c-0.1,0-0.1,0-0.2,0.1l-1,3.2l0.1-2.5c0-0.1-0.1-0.1-0.1-0.1 c0,0,0,0,0,0c0,0,0,0,0,0c-0.1,0-0.1,0-0.2,0.1L7.8,5.2L7.1,1.2C7.1,1.2,7,1.1,7,1.1c-0.1,0-0.1,0-0.1,0.1L5.4,5.2L4,1.1 C4,1.1,3.9,1,3.9,1c-0.1,0-0.1,0-0.1,0.1l-0.7,4L1.7,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0 c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0l0.2,3.2L0.2,0.2c0-0.1-0.1-0.1-0.2-0.1C0,0.1,0,0.2,0,0.3l1.7,4.5l0.2,2.9 L1.7,9.5c0,0.1,0,0.1,0.1,0.1c0,0,0.1,0,0.1,0L2.6,9L3,9.9c0,0,0,0.1,0.1,0.1c0,0,0.1,0,0.1,0L4.4,9l1,1c0,0,0.1,0,0.1,0h0 c0,0,0.1,0,0.1,0l1-1l1.2,1c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1-0.1l0.5-0.8L9,9.7c0,0,0.1,0,0.1,0c0,0,0.1-0.1,0.1-0.1L9.1,7.7L9.3,4.2 z M8.9,7.3L8.5,6.7c0,0,0,0,0,0L9,5.1L8.9,7.3z M8.3,8.5L7.9,7.7L8.4,7l0.5,0.7L8.3,8.5z M6.5,8.6L5.6,7.8l0.9-0.9l1.1,0.9L6.5,8.6 z M4.4,8.6L3.3,7.7l1.1-0.8l0.8,0.9L4.4,8.6z M2.6,8.4L2.2,7.7l0.4-0.8L3,7.7L2.6,8.4z M2.7,6.6C2.7,6.6,2.7,6.6,2.7,6.6l0.4-0.7 c0,0,0,0,0,0l1.1,0.9L3.2,7.5L2.7,6.6z M4.6,6.6l0.8-0.9l1,1L5.4,7.6L4.6,6.6z M6.7,6.6l1.1-0.8l0.5,0.9c0,0,0,0,0,0L7.8,7.5 L6.7,6.6z M9.1,1.6L9,4.2L8.3,6.4L7.9,5.7L9.1,1.6z M6.9,1.7l0.7,3.9L6.5,6.5l-1-1L6.9,1.7z M3.9,1.7l1.3,3.8l-0.8,1L3.3,5.6 L3.9,1.7z M1.8,1.8L3,5.6L2.6,6.3L2,4.7L1.8,1.8z M2.4,6.6C2.4,6.6,2.5,6.6,2.4,6.6L2.2,7.2L2,5.5L2.4,6.6z M2.1,8.1l0.3,0.6L2,9.2 L2.1,8.1z M3.2,9.6L2.7,8.7c0,0,0,0,0,0l0.5-0.8l1,0.9L3.2,9.6z M5.5,9.7L4.6,8.8l0.9-0.9l0.9,0.9L5.5,9.7z M7.8,9.6L6.7,8.8l1-0.9 l0.4,1c0,0,0,0,0,0L7.8,9.6z M8.5,8.8l0.4-0.7l0.1,1.2L8.5,8.8z" fill="#ffffff" style={{strokeWidth: '0px'}}></path></g><g className="indicator-wrapper" style={{display: 'none'}}></g><g className="shotDetails"></g>
      <desc>Created with Snap</desc>
    </svg>
  );
};

export const Field = (props) => {
  switch (props.leagueId) {
    case '59723313734d1d6202a85f10':
      return <FootballField {...props} />;
    case '59723313734d1d6202a85f15':
      return <FootballField {...props} />;
    case '59723313734d1d6202a85f19':
      return <BasketballCourt {...props} />;
    case '59723313734d1d6202a85f37':
      return <BasketballCourt {...props} />;
    case '59723313734d1d6202a85f35':
      return <BasketballCourt {...props} />;
    // case '59723313734d1d6202a85f21':
    //   return <BaseballField {...props} />;
    default:
      return null;
  };
};