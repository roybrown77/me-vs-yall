import { useState } from 'react';

const GameHighlights = (props) => {
  const { game } = props;

  const [show, setShow] = useState(false);

  let quarter;

  const handleChange = (event) => {
    setShow(!show);
  };

  return (
    <>
      {!show &&
        (game.highlights || []).slice(0, 5).map((play, playIndex) => {
          return (
            <div
              key={playIndex}
              style={{
                margin: "4px 0",
                display: "flex",
                opacity:
                  !show && playIndex === 4 && (game.highlights || []).length > 5
                    ? ".1"
                    : "1",
              }}
            >
              <div
                style={{
                  minWidth: "40px",
                  padding: "4px",
                  backgroundColor: "#1e90ff",
                  color: "#fff",
                  marginRight: "4px",
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
        })}
      {show &&
        (game.highlights || []).map((play, playIndex) => {
          let newQuarter = play.quarter;
          let isNewQuarter = quarter !== newQuarter;
          if (isNewQuarter) quarter = newQuarter;

          return (
            <div key={playIndex}>
              {isNewQuarter && (
                <div style={{ display: "flex", margin: "10px 0" }}>
                  <div
                    style={{ borderTop: "1px solid lightgray", width: "50%" }}
                  />
                  <div
                    style={{
                      fontFamily: "monospace",
                      position: "relative",
                      margin: "-7px 10px 0 10px",
                    }}
                  >
                    {["59723313734d1d6202a85f21"].includes(game?.leagueId)
                      ? quarter
                      : quarter === 1
                      ? "1st"
                      : quarter === 2
                      ? "2nd"
                      : quarter === 3
                      ? "3rd"
                      : quarter + "th"}
                  </div>
                  <div
                    style={{ borderTop: "1px solid lightgray", width: "50%" }}
                  />
                </div>
              )}
              <div style={{ margin: "4px 0", display: "flex" }}>
                <div
                  style={{
                    minWidth: "40px",
                    padding: "4px",
                    backgroundColor: "#1e90ff",
                    color: "#fff",
                    marginRight: "4px",
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
            </div>
          );
        })}
      {(game.highlights || []).length > 5 && (
        <div class="center-box" onClick={handleChange}>
          <div className="animated-border-box">
            {show ? "show less -" : "show more +"}
          </div>
        </div>
      )}
    </>
  );
};

  export default GameHighlights;