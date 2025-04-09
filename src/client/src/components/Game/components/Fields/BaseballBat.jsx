import React, { useRef, useState } from 'react';

const BaseballBat = () => {
  const batRef = useRef({
    Position: { x: 0, y: 0 },
    Track: [],
    Speed: { x: 0, y: 0 },
    Target: { x: 50, y: 50 },
    Angle: 0,
    Size: 1,
  });
  const svgRef = useRef(null);
  
  const [isSwinging, setIsSwinging] = useState(false);

  const Bat = batRef.current;

  const bubbleWidth = 200;
  const bubbleHeight = 30;
  const bubbleX = (Bat.Position.x - bubbleWidth / 2) - 50;
  const bubbleY = Bat.Position.y - 60 - bubbleHeight; // 20 units above the bat

  const trackPolygons = () => {
    const shadowPolygons = Bat.Track.map((point, index) => {
      if (index === 0) return null;
      const prevPoint = Bat.Track[index - 1];
      return (
        <polygon
          key={index}
          points={`
        ${prevPoint.x - 0.5},${prevPoint.y - 0.5}
        ${prevPoint.x + 0.5},${prevPoint.y + 0.5}
        ${point.x + 0.5},${point.y + 0.5}
        ${point.x - 0.5},${point.y - 0.5}
          `}
          fill="rgba(0, 0, 0, 0.2)"
        />
      );
    });

    return <g>{shadowPolygons}</g>;
  };

  return (
    <svg
      onClick={() => { 
        setIsSwinging(true);
        setTimeout(() => setIsSwinging(false), 500);
      }} 
      className="baseball-bat"
      ref={svgRef}
      viewBox="-20 -90 100 200"
      style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      x="170"
      y="0"
        >
      {trackPolygons()}
      <g
          transform="translate(30, 59)" // Move the rotation point to the bottom of the handle
          style={{
          animation: isSwinging
        ? 'rotate 1s linear'
        : 'wiggle 0.2s ease-in-out infinite alternate',
        }}
      >
        {/* barrel */}
        <rect x={-5} y={-57} width={30} height={70} fill="#D2B48C" />
        {/* handle */}
        <rect x={2} y={10} width={15} height={57} fill="#333" />
      </g>
      <style>
        {`
          @keyframes wiggle {
          0% { transform: rotate(-40deg); }
          100% { transform: rotate(-45deg); }
          }
        `}
      </style>
      <rect
        x={bubbleX}
        y={bubbleY}
        width={bubbleWidth}
        height={bubbleHeight}
        rx={0}
        ry={5}
        fill="white"
        stroke="black"
        strokeWidth="0.5"
      />
      <text
        x={bubbleX + bubbleWidth / 2}
        y={bubbleY + bubbleHeight / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontFamily="monospace"
        fontSize="1rem"
        fontWeight="bold"
        radius="8px"
      >
        torpedo bat
      </text>
    </svg>
  );
};

export default BaseballBat;
