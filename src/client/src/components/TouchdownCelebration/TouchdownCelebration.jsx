import PropTypes from "prop-types";

import "./touchdownCelebration.css";

const CONFETTI_PIECES = Array.from({ length: 18 }, (_, index) => index);

const TouchdownCelebration = ({
  active = false,
  className = "",
  confettiClassName = "",
  idPrefix = "confetti",
}) => {
  const rootClass = [
    "touchdown-celebration",
    active ? "is-live" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const pieceClass = ["touchdown-celebration__confetti", confettiClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} aria-hidden="true">
      {CONFETTI_PIECES.map((piece) => (
        <span
          key={`${idPrefix}-${piece}`}
          className={pieceClass}
          style={{
            left: `${8 + piece * 5}%`,
            animationDelay: `${(piece % 6) * 90}ms`,
            animationDuration: `${850 + (piece % 5) * 160}ms`,
          }}
        />
      ))}
    </div>
  );
};

TouchdownCelebration.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  confettiClassName: PropTypes.string,
  idPrefix: PropTypes.string,
};

export default TouchdownCelebration;
