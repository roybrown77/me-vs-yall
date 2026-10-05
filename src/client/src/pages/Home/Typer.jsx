import { useState, useEffect } from 'react';
import { getRandomIntInclusive } from '../../utilities';

import './typer.css';

const TYPING_SPEED = 70;
const DELETING_SPEED = 30;
const WAIT_BEFORE_DELETING_SECONDS = 3000;

const Typer = ({ dataText, heading }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(getRandomIntInclusive(0, dataText.length - 1));
  const [typingSpeed, setTypingSpeed] = useState(TYPING_SPEED);

  useEffect(() => {
    const handleType = () => {
      const fullText = dataText[loopNum];

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), WAIT_BEFORE_DELETING_SECONDS);
        return;
      }

      if (isDeleting && text === '') {
        const nextIndex = getRandomIntInclusive(0, dataText.length - 1);
        setIsDeleting(false);
        setLoopNum(nextIndex);
        return;
      }

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? DELETING_SPEED : TYPING_SPEED);
    };

    const typingInterval = setInterval(handleType, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [text, isDeleting, loopNum, typingSpeed, dataText]);

  return (
    <div>
      {heading}&nbsp;
      <span>{text}</span>
      <span className="typer-cursor">_</span>
    </div>
  );
};

export default Typer;
