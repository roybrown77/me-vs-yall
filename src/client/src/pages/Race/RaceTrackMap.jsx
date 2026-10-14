import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const MOBILE_COURSE_MAP_QUERY = "(max-width: 640px)";

import {
  buildTrackMapModel,
  formatTrackDistance,
  formatTrackSpeed,
  projectTelemetryToMap,
} from "./raceTrackMap.js";

const GRADE_STROKE = {
  up: "#45d66a",
  down: "#ef4b4b",
  flat: "rgba(255, 255, 255, 0.38)",
};

const RaceTrackMap = forwardRef(function RaceTrackMap({ roadScale, courseProfile }, ref) {
  const model = useMemo(
    () => buildTrackMapModel({ roadScale, courseProfile }),
    [roadScale, courseProfile],
  );

  const [mobileCourseMap, setMobileCourseMap] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_COURSE_MAP_QUERY).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_COURSE_MAP_QUERY);
    const sync = () => setMobileCourseMap(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const carRef = useRef(null);
  const turnRef = useRef(null);
  const inclineRef = useRef(null);
  const remainingRef = useRef(null);
  const speedRef = useRef(null);

  useImperativeHandle(ref, () => ({
    update(telemetry) {
      if (!telemetry) return;
      const { mapX, mapY, heading } = projectTelemetryToMap(model, telemetry);
      if (carRef.current) {
        carRef.current.setAttribute("transform", `translate(${mapX} ${mapY}) rotate(${-heading})`);
      }
      if (turnRef.current) {
        turnRef.current.textContent = `${telemetry.turnDeg.toFixed(1)}°`;
      }
      if (inclineRef.current) {
        const sign = telemetry.inclineDeg > 0 ? "+" : "";
        inclineRef.current.textContent = `${sign}${telemetry.inclineDeg.toFixed(1)}°`;
        inclineRef.current.classList.remove("is-up", "is-down", "is-flat");
        if (telemetry.inclineDeg > 0.35) inclineRef.current.classList.add("is-up");
        else if (telemetry.inclineDeg < -0.35) inclineRef.current.classList.add("is-down");
        else inclineRef.current.classList.add("is-flat");
      }
      if (remainingRef.current) {
        remainingRef.current.textContent = formatTrackDistance(telemetry.remainingM);
      }
      if (speedRef.current) {
        speedRef.current.textContent = formatTrackSpeed(telemetry.speedMps);
      }
    },
  }));

  const { transform, segments, start, finish } = model;

  return (
    <details className="race-track-map race-results" aria-label="Course map">
      <summary className="race-track-map-toggle">
        <span className="race-track-map-toggle-main">
          <span className="race-track-map-hero-row">
            <span className="race-track-map-hero-stat">
              <span className="race-results-kicker">To finish</span>
              <span className="race-results-time race-track-map-hero" ref={remainingRef}>
                0 m
              </span>
            </span>
            <span className="race-track-map-hero-divider" aria-hidden="true" />
            <span className="race-track-map-hero-stat">
              <span className="race-results-kicker">Speed</span>
              <span className="race-results-time race-track-map-hero" ref={speedRef}>
                0 km/h
              </span>
            </span>
          </span>
        </span>
        <span className="race-track-map-toggle-icon" aria-hidden="true" />
      </summary>
      <div className="race-track-map-panel">
        <div className="race-track-map-panel-side">
          <div className="race-results-best race-track-map-meta">
            Turn <span ref={turnRef}>0.0°</span>
            <span className="race-track-map-meta-sep" aria-hidden="true">
              ·
            </span>
            Incline <span ref={inclineRef} className="is-flat">0.0°</span>
          </div>
          <div className="race-track-map-legend" aria-hidden="true">
            <span className="race-track-map-legend-start">
              <span className="race-track-map-legend-start-mark">S</span>
              <span className="race-track-map-legend-swatch race-track-map-legend-swatch--start" />
              Start
            </span>
            <span className="race-track-map-legend-up">Uphill</span>
            <span className="race-track-map-legend-down">Downhill</span>
          </div>
        </div>
        <div className="race-track-map-course">
          <div className="race-results-kicker race-track-map-course-kicker">Course</div>
          <svg
            className="race-track-map-svg"
            viewBox={`0 0 ${transform.width} ${transform.height}`}
            preserveAspectRatio={mobileCourseMap ? "xMidYMid slice" : "xMidYMid meet"}
            role="img"
            aria-hidden="true"
          >
            <defs>
              <pattern id="race-checkered" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="#fff" />
                <rect x="3" y="3" width="3" height="3" fill="#fff" />
              </pattern>
            </defs>
            <rect
              x="0"
              y="0"
              width={transform.width}
              height={transform.height}
              rx="4"
              className="race-track-map-svg-bg"
            />
            {segments.map((segment, index) => (
              <line
                key={index}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                stroke={GRADE_STROKE[segment.grade] ?? GRADE_STROKE.flat}
                strokeWidth={segment.grade === "flat" ? 2.6 : 3.4}
                strokeLinecap="round"
              />
            ))}
            <line
              x1={start.dashX1}
              y1={start.dashY1}
              x2={start.dashX2}
              y2={start.dashY2}
              className="race-track-map-start-dash"
            />
            <g transform={`translate(${finish.mapX} ${finish.mapY})`}>
              <rect
                x="-8"
                y="-4"
                width="16"
                height="8"
                fill="url(#race-checkered)"
                stroke="#fff"
                strokeWidth="0.6"
              />
            </g>
            <g ref={carRef} className="race-track-map-car">
              <path d="M0 -5 L4 4 L0 2 L-4 4 Z" fill="#ffe566" stroke="#1a1200" strokeWidth="0.8" />
            </g>
          </svg>
        </div>
      </div>
    </details>
  );
});

export default RaceTrackMap;
