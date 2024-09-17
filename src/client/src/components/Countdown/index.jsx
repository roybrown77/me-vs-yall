import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const styles = {
  countDown: {
    fontFamily: 'monospace',
    fontSize: '17px',
    color: 'deeppink',
  },
};

const Countdown = ({ date, styles: customStyles }) => {
  const [timeLeft, setTimeLeft] = useState(calculateCountdown(date));

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTime = calculateCountdown(date);
      if (!updatedTime) {
        clearInterval(interval);
      } else {
        setTimeLeft(updatedTime);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [date]);

  const addLeadingZeros = (value) => {
    return String(value).padStart(2, '0');
  };

  return (
    <div style={{ ...styles.countDown, ...customStyles }}>
      <div>
        {timeLeft.days > 0 && (
          <span className="Countdown-col">
            <span className="Countdown-col-element">
              <strong>{addLeadingZeros(timeLeft.days)}</strong>
              <span> {timeLeft.days === 1 ? 'Day' : 'Days'} </span>
            </span>
          </span>
        )}
        {timeLeft.hours > 0 && (
          <span className="Countdown-col">
            <span className="Countdown-col-element">
              <strong>{addLeadingZeros(timeLeft.hours)}</strong>
              <span> Hours </span>
            </span>
          </span>
        )}
      </div>
      <div>
        {timeLeft.min > 0 && (
          <span className="Countdown-col">
            <span className="Countdown-col-element">
              <strong>{addLeadingZeros(timeLeft.min)}</strong>
              <span> Min </span>
            </span>
          </span>
        )}
        {timeLeft.sec > 0 && (
          <span className="Countdown-col">
            <span className="Countdown-col-element">
              <strong>{addLeadingZeros(timeLeft.sec)}</strong>
              <span> Sec </span>
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

const calculateCountdown = (endDate) => {
  let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

  // Return false if countdown is over
  if (diff <= 0) return false;

  const timeLeft = {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    min: Math.floor((diff % 3600) / 60),
    sec: Math.floor(diff % 60),
  };

  return timeLeft;
};

Countdown.propTypes = {
  date: PropTypes.string.isRequired,
  styles: PropTypes.object,
};

Countdown.defaultProps = {
  date: new Date().toString(),
};

export default Countdown;