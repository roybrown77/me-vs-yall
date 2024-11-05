import { useEffect, useState } from 'react';

import AmericanFootballField from "./Fields/AmericanFootballField";
import PixelFootballPlayer from "./PixelFootballPlayer";

const AmericanFootballMiniRallyGame = (props) => {
  const [awayScore, setAwayScore] = useState(
    props.game.competitors[0].score || 0
  );
  const [homeScore, setHomeScore] = useState(
    props.game.competitors[1].score || 0
  );

  useEffect(() => {
    setAwayScore(props.game.competitors[0].score || 0);
    setHomeScore(props.game.competitors[1].score || 0);
  }, [props.game.competitors]);

  const awayScoreHandler = () => {
    setAwayScore(awayScore + 7);
  };

  const homeScoreHandler = () => {
    setHomeScore(homeScore + 7);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <div
        style={{
          display: "inline-flex",
          width: "50%",
          padding: "3px",
          backgroundColor: "#000",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            width: "100%",
            border: "5px dotted yellow",
            margin: "2px",
            display: "inline-flex",
            padding: "5px",
          }}
        >
          <div style={{ margin: "auto", width: "25%" }}>
            <div style={{ color: "#fff", marginBottom: "5px" }}>
              {props.game.competitors[0].shortLocation}
            </div>
            <div style={{ backgroundColor: "#fff", fontSize: "20px" }}>
              {awayScore}
            </div>
          </div>
          <div style={{ margin: "auto", width: "25%" }}>
            <div style={{ color: "#fff", marginBottom: "5px" }}>
              {props.game.competitors[1].shortLocation}
            </div>
            <div style={{ backgroundColor: "#fff", fontSize: "20px" }}>
              {homeScore}
            </div>
          </div>
        </div>
      </div>
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
      <PixelFootballPlayer playerStyles={{teamColor: props.game.competitors[0].color }} />
      <PixelFootballPlayer playerStyles={{ grid: { left: '11rem' }, teamColor: props.game.competitors[0].color }} />
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