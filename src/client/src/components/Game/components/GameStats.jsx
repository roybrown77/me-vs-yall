import { useState } from 'react';

const GamePlayHistory = (props) => {
  const { game } = props;

  const [show, setShow] = useState(false);
  const [showGamesPlayedDetail, setShowGamesPlayedDetail] = useState({});

  const handleShowGamesPlayedDetail = (id) => {
    setShowGamesPlayedDetail({...showGamesPlayedDetail, [id]: !showGamesPlayedDetail?.[id]});
  };

  const statsToShow = show ? (game.stats || []) : (game.stats || []).slice(0, 10);

  const handleChange = () => {
    setShow(prevState => !prevState);
  };

  return (
    <>
      <div style={{ margin: "4px 0", display: "flex" }}>
        <div
          style={{
            minWidth: "40px",
            padding: "4px",
            backgroundColor: "#f50057",
            color: "#fff",
            marginRight: "4px",
          }}
        >
          MvY Stats
        </div>
      </div>
      {(game.stats || []).length > 0 && (
        <div style={{ 
          fontSize: "0.7rem",
          fontFamily: "monospace",
        }}>
          <div style={{ padding: "0.625rem" }}>
            <div style={{ display: "flex" }}>
              <div style={{ height: "1.5rem" }}></div>
              <div style={{ position: "absolute", right: "9.25rem" }}>
                {game.stats[0].awayTeam.name}
              </div>
              <div style={{ position: "absolute", right: "0.625rem" }}>
                {game.stats[1].homeTeam.name}
              </div>
            </div>
            {statsToShow.map((stat, statIndex) => (
              <div 
                key={game._id + '-' + stat.name}
                style={{ 
                  opacity: !show && statIndex > 6 && statsToShow.length > 5 ? ".1" : "1",
                  height: stat.name === 'Games Played' && showGamesPlayedDetail?.[game._id] && stat.homeTeam?.list?.length > 0 ? `${stat.homeTeam.list.length*.9 + 2}rem` : ''
                }}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ cursor: 'pointer', height: '100%' }} onClick={() => stat.name === 'Games Played' ? handleShowGamesPlayedDetail(game._id) : null}>{stat.name} {stat.name === 'Games Played' ? showGamesPlayedDetail?.[game._id] ? '-' : '+' : ''}</div>
                  <div style={{ position: "absolute", right: "9.25rem" }}>
                    <div style={{ textAlign: 'right' }}>{stat.awayTeam.value}</div>
                    {
                      stat.name === 'Games Played' && showGamesPlayedDetail?.[game._id] &&
                      <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                        {
                          stat.awayTeam.list?.map(gamePlayed => (
                            <div key={gamePlayed + statIndex + stat.awayTeam.value} style={{ fontWeight: '700', color: gamePlayed[0] === 'W' ? 'darkgreen' : '' }}>{gamePlayed}</div>
                          ))
                        }
                      </div>
                    }
                    </div>
                  <div style={{ position: "absolute", right: "0.625rem" }}>
                    <div style={{ textAlign: 'right' }}>{stat.homeTeam.value}</div>
                    {
                      stat.name === 'Games Played' && showGamesPlayedDetail?.[game._id] &&
                      <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                        {
                          stat.homeTeam.list?.map(gamePlayed => (
                            <div key={gamePlayed + statIndex + stat.homeTeam.value} style={{ fontWeight: '700', color: gamePlayed[0] === 'W' ? 'darkgreen' : '' }}>{gamePlayed}</div>
                          ))
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            ))}
            {(game.stats || []).length > 0 && (
              <div
                style={{
                  color: "rgba(0,0,0,0.87)",
                  fontSize: "15px",
                  margin: "4px 17%",
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
          </div>
        </div>
      )}
      {
        (game.stats || []).length === 0 &&
        <div>
          Stats are not available.
        </div>
      }
    </>
  );
};

export default GamePlayHistory;