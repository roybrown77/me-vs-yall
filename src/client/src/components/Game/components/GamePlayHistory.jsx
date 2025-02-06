import { useState } from 'react';

const GamePlayHistory = (props) => {
  const { game } = props;

  const [show, setShow] = useState(false);

  const handleChange = (event) => {
    setShow(!show);
  };

  return (
    <>
      {!show &&
        (game.playHistory || []).slice(0, 5).map((play, playIndex) => {
          return (
            <div
              key={playIndex}
              style={{
                margin: "4px 0",
                display: "flex",
                opacity:
                  !show &&
                  playIndex === 4 &&
                  (game.playHistory || []).length > 5
                    ? ".1"
                    : "1",
              }}
            >
              <div
                style={{
                  minWidth: "40px",
                  padding: "4px",
                  backgroundColor: "rgb(45, 232, 149)",
                  marginRight: "4px",
                  textAlign: "left",
                }}
              >
                <div>
                  {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                    ? play.quarter
                    : play.quarter === 1
                    ? "1st"
                    : play.quarter === 2
                    ? "2nd"
                    : play.quarter === 3
                    ? "3rd"
                    : play.quarter + "th"}
                </div>
                {!["59723313734d1d6202a85f21"].includes(game?.leagueId) && (
                  <div>
                    {(play.time / 100).toFixed(3).toString().slice(-1) === "0"
                      ? (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":")
                      : (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":") +
                        "." +
                        (play.time / 100).toFixed(3).toString().slice(-1)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
            </div>
          );
        })
      }
      {show &&
        (game.playHistory || []).map((play, playIndex) => {
          return (
            <div key={playIndex} style={{ margin: "4px 0", display: "flex" }}>
              <div
                style={{
                  minWidth: "40px",
                  padding: "4px",
                  backgroundColor: "rgb(45, 232, 149)",
                  marginRight: "4px",
                  textAlign: "left",
                }}
              >
                <div>
                  {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                    ? play.quarter
                    : play.quarter === 1
                    ? "1st"
                    : play.quarter === 2
                    ? "2nd"
                    : play.quarter === 3
                    ? "3rd"
                    : play.quarter + "th"}
                </div>
                {!["59723313734d1d6202a85f21"].includes(game?.leagueId) && (
                  <div>
                    {(play.time / 100).toFixed(3).toString().slice(-1) === "0"
                      ? (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":")
                      : (play.time / 100)
                          .toFixed(2)
                          .toString()
                          .replace(".", ":") +
                        "." +
                        (play.time / 100).toFixed(3).toString().slice(-1)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "left" }}>{play.lastPlay}</div>
            </div>
          );
        })
      }
      {(game.playHistory || []).length > 5 && (
        <div
          style={{
            color: "rgba(0,0,0,0.87)",
            fontSize: "15px",
            margin: "1rem 17% .25rem 17%",
            padding: "2px",
            border: "3px solid rgba(0,0,0,0.87)",
            borderRadius: "8px",
            cursor: 'pointer',
          }}
          onClick={handleChange}
        >
          {show ? "show less -" : "show more +"}
        </div>
      )}
    </>
  );
};

export default GamePlayHistory;