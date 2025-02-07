import { useEffect, useState } from 'react';

import AmericanFootballField from "./Fields/AmericanFootballField";

const AmericanFootballMiniRallyGame = (props) => {
  const [awayScore, setAwayScore] = useState(
    props.game.competitors[0].score || 0
  );
  const [homeScore, setHomeScore] = useState(
    props.game.competitors[1].score || 0
  );
  const [showScoreboard, setShowScoreboard] = useState(false);

  useEffect(() => {
    setAwayScore(props.game.competitors[0].score || 0);
    setHomeScore(props.game.competitors[1].score || 0);
  }, [props.game.competitors]);

  const awayScoreHandler = () => {
    setShowScoreboard(true);
    setAwayScore(awayScore + 7);
  };

  const homeScoreHandler = () => {
    setShowScoreboard(true);
    setHomeScore(homeScore + 7);
  };

  const getAstroPositionAndEmoji = () => {
    const now = new Date();
    const hours = now.getHours();
    const percentageOfDay = (hours - 6) / 12; // Assuming sun moves from 6 AM to 6 PM
    const position = Math.min(Math.max(percentageOfDay * 150 - 75, -75), 75); // Clamp between -75 and 75
    const emoji = (hours >= 6 && hours < 18) ? '☀️' : '🌙'; // Sun for day, moon for night
    return { position, emoji };
  };

  const { position: astroPosition, emoji: astroEmoji } = getAstroPositionAndEmoji();

  return (
    <div style={{ marginTop: "10px" }}>
      <div
        className='sun-nudge'
        style={{ margin: '1rem 0', marginLeft: `${astroPosition}%`}}
      >
        {astroEmoji}
      </div>
      <>
        <div
          style={showScoreboard ? {
            display: "inline-flex",
            width: "23%",
            padding: "3px",
            backgroundColor: "#000",
            borderRadius: "4px",
            marginRight: "20%",
            marginBottom: "1rem",
            transform: "perspective(70px) rotateY(20deg)"
          } : { margin: '1rem 0' }
        }
        >
          {
            showScoreboard &&
            <div
              style={{
                width: "100%",
                border: "5px dotted yellow",
                margin: "5px",
                display: "inline-flex",
                padding: "5px",
              }}
            >
              <div style={{ margin: "auto" }}>
                <div style={{ color: "#fff", marginBottom: "5px" }}>
                  {props.game.competitors[0].shortLocation}
                </div>
                <div style={{ backgroundColor: "#fff", fontSize: "20px", width: '2rem' }}>
                  {awayScore}
                </div>
              </div>
            </div>
          }
        </div>
        <div
          style={showScoreboard ? {
            display: "inline-flex",
            width: "23%",
            padding: "3px",
            backgroundColor: "#000",
            borderRadius: "4px",
            marginLeft: "20%",
            marginBottom: "1rem",
            transform: "perspective(70px) rotateY(-20deg)"
          } : { margin: '1rem 0' }
        }
        >
          {
            showScoreboard &&
            <div
              style={{
                width: "100%",
                border: "5px dotted yellow",
                margin: "5px",
                display: "inline-flex",
                padding: "5px",
              }}
            >
              <div style={{ margin: "auto" }}>
                <div style={{ color: "#fff", marginBottom: "5px" }}>
                  {props.game.competitors[1].shortLocation}
                </div>
                <div style={{ backgroundColor: "#fff", fontSize: "20px", width: '2rem' }}>
                  {homeScore}
                </div>
              </div>
            </div>
          }
        </div>
      </>
      <AmericanFootballField
        {...{
          away: props.game.competitors[0].shortLocation,
          awayColor: props.game.competitors[0].color,
          home: props.game.competitors[1].shortLocation,
          homeColor: props.game.competitors[1].color,
          awayScoreHandler,
          homeScoreHandler,
        }}
      />
      {false && (
        <div>
          <Button
            size="small"
            className={props.classes.gamePlayMessage}
            onClick={() => {}}
          >
            Let's Ball!
          </Button>
        </div>
      )}
    </div>
  );
};

export default AmericanFootballMiniRallyGame;