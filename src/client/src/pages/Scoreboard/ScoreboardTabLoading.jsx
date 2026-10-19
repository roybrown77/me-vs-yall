import PropTypes from "prop-types";

import Skeleton from "@mui/material/Skeleton";

import "./scoreboard-tabs.css";

const LOADING_MESSAGES = {
  rankings: "Crunching the rankings...",
  playoffs: "Seeding the playoff picture...",
  scores: "Loading this week's slate...",
};

export const StandingsTabLoader = ({
  variant = "rankings",
  message,
}) => (
  <div
    className="standings-tab-loader"
    role="status"
    aria-live="polite"
    aria-label={message || LOADING_MESSAGES[variant] || "Loading"}
  >
    <p className="standings-tab-loader__message">
      {message || LOADING_MESSAGES[variant]}
    </p>
    {variant === "playoffs" ? (
      <div className="standings-tab-loader__skeleton-stack">
        <Skeleton animation="pulse" height={48} variant="rounded" />
        <Skeleton animation="pulse" height={20} width="28%" variant="rounded" />
        <div className="standings-tab-loader__match-row">
          <Skeleton
            animation="pulse"
            className="standings-tab-loader__match-side"
            height={88}
            variant="rounded"
          />
          <Skeleton
            animation="pulse"
            className="standings-tab-loader__match-at"
            height={16}
            variant="rounded"
          />
          <Skeleton
            animation="pulse"
            className="standings-tab-loader__match-side"
            height={88}
            variant="rounded"
          />
        </div>
        <div className="standings-tab-loader__match-row">
          <Skeleton
            animation="pulse"
            className="standings-tab-loader__match-side"
            height={88}
            variant="rounded"
          />
          <Skeleton
            animation="pulse"
            className="standings-tab-loader__match-at"
            height={16}
            variant="rounded"
          />
          <Skeleton
            animation="pulse"
            className="standings-tab-loader__match-side"
            height={88}
            variant="rounded"
          />
        </div>
      </div>
    ) : variant === "scores" ? (
      <div className="standings-tab-loader__skeleton-stack">
        <Skeleton animation="pulse" height={80} variant="rounded" />
        <div className="standings-tab-loader__scores-row">
          <Skeleton animation="pulse" height={160} variant="rounded" />
          <Skeleton animation="pulse" height={160} variant="rounded" />
        </div>
      </div>
    ) : (
      <div className="standings-tab-loader__skeleton-stack">
        <Skeleton animation="pulse" height={44} variant="rounded" />
        <Skeleton animation="pulse" height={36} variant="rounded" />
        <Skeleton animation="pulse" height={36} variant="rounded" />
        <Skeleton animation="pulse" height={36} variant="rounded" />
      </div>
    )}
  </div>
);

StandingsTabLoader.propTypes = {
  variant: PropTypes.oneOf(["rankings", "playoffs", "scores"]),
  message: PropTypes.string,
};
