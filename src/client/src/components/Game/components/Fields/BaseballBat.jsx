import React, { useRef, useEffect, useState } from 'react';

const BaseballBat = () => {
  // Store the bat’s mutable state in a ref.
  const batRef = useRef({
    Position: { x: 0, y: 0 },
    Track: [],
    Speed: { x: 0, y: 0 },
    Target: { x: 50, y: 50 },
    Angle: 0,
    Size: 1,
  });
  // A state variable that forces a re-render each frame.
  const [tick, setTick] = useState(0);

  const [isSwinging, setIsSwinging] = useState(false);

  // A ref for the SVG element.
  const svgRef = useRef(null);

  // useEffect(() => {
  //   let animationFrameId;
  //   const HALF_PI = Math.PI / 2;
  //   const THREE_HALVES_PI = Math.PI * 1.5;

  //   // Update the bat's physics.
  //   const BatSwingChange = () => {
  //     const Bat = batRef.current;
  //     // Move toward the target
  //     Bat.Speed.x = (Bat.Target.x - Bat.Position.x) * 0.2;
  //     Bat.Speed.y = (Bat.Target.y - Bat.Position.y) * 0.2;
  //     Bat.Position.x += Bat.Speed.x;
  //     Bat.Position.y += Bat.Speed.y;

  //     let TargetAngle;
  //     if (
  //       Math.abs(Bat.Speed.x) < 0.2 &&
  //       Math.abs(Bat.Speed.y) < 0.2
  //     ) {
  //       TargetAngle = 0;
  //       if (Bat.Track.length > 0) Bat.Track.shift();
  //     } else {
  //       TargetAngle =
  //         Bat.Speed.x >= 0
  //           ? Math.atan(Bat.Speed.y / Bat.Speed.x) + HALF_PI
  //           : THREE_HALVES_PI + Math.atan(Bat.Speed.y / Bat.Speed.x);
  //       Bat.Track.push({
  //         Position: { x: Bat.Position.x, y: Bat.Position.y },
  //         Angle: Bat.Angle,
  //       });
  //       if (Bat.Track.length > 20) Bat.Track.shift();
  //     }
  //     let Delta_Angle = TargetAngle - Bat.Angle;
  //     if (Delta_Angle > Math.PI) Delta_Angle -= Math.PI * 2;
  //     if (Delta_Angle < -Math.PI) Delta_Angle += Math.PI * 2;
  //     Bat.Angle += Delta_Angle * 0.2;
  //   };

  //   // The animation loop
  //   const BatSwingCycle = () => {
  //     BatSwingChange();
  //     // Force a re-render by updating tick.
  //     setTick((t) => t + 1);
  //     animationFrameId = requestAnimationFrame(BatSwingCycle);
  //   };

  //   animationFrameId = requestAnimationFrame(BatSwingCycle);

  //   return () => cancelAnimationFrame(animationFrameId);
  // }, []);

  // Extract the current bat state.
  const Bat = batRef.current;
  const normalSize = Bat.Size; // With a normalized viewBox, we assume 1 unit = 1

  // Build track segments as an array of SVG polygon elements.
  const trackPolygons = Bat.Track.map((seg, i, arr) => {
    if (i >= arr.length - 1) return null;
    const next = arr[i + 1];
    // Calculate opacity based on segment index.
    const alpha = i / arr.length;
    // Compute angles for current and next segment.
    const angle1 = seg.Angle - Math.PI / 2;
    const angle2 = next.Angle - Math.PI / 2;
    const x1 = seg.Position.x + Math.cos(angle1) * normalSize * 2;
    const y1 = seg.Position.y + Math.sin(angle1) * normalSize * 2;
    // Note: subtracting a negative value effectively adds.
    const x2 = seg.Position.x + Math.cos(angle1) * 14;
    const y2 = seg.Position.y + Math.sin(angle1) * 14;
    const x3 = next.Position.x + Math.cos(angle2) * 14;
    const y3 = next.Position.y + Math.sin(angle2) * 14;
    const x4 = next.Position.x + Math.cos(angle2) * normalSize * 2;
    const y4 = next.Position.y + Math.sin(angle2) * normalSize * 2;
    const points = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`;
    return (
      <polygon
        key={i}
        points={points}
        fill={`rgba(255,255,0,${alpha})`}
      />
    );
  });

  // Convert the bat’s angle from radians to degrees.
  const angleDeg = Bat.Angle * (180 / Math.PI);
  // Create an SVG group for the bat with translation and rotation.
  const batGroupTransform = `translate(${Bat.Position.x}, ${Bat.Position.y}) rotate(${angleDeg})`;

  // Define the comic bubble dimensions and position (above the bat).
  const bubbleWidth = 200;
  const bubbleHeight = 30;
  const bubbleX = (Bat.Position.x - bubbleWidth / 2) - 50;
  const bubbleY = Bat.Position.y - 60 - bubbleHeight; // 20 units above the bat

  return (
    <svg
      onClick={() => { 
        setIsSwinging(true);
        setTimeout(() => setIsSwinging(false), 250);
      }} 
      className="baseball-bat"
      ref={svgRef}
      viewBox="-20 -90 100 200"
      style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      x="170"
      y="0"
    >
      {trackPolygons}
      <g
          transform="translate(30, 59)" // Move the rotation point to the bottom of the handle
          style={{
          animation: isSwinging
        ? 'rotate .5s linear'
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
