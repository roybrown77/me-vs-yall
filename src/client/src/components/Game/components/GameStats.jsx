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
                {game.stats[0]?.awayTeam?.name}
              </div>
              <div style={{ position: "absolute", right: "0.625rem" }}>
                {game.stats[1]?.homeTeam?.name || game.stats[0]?.homeTeam?.name}
              </div>
            </div>
            {statsToShow.map((stat, statIndex) => (
              <div 
                key={game._id + '-' + stat.name}
                style={{ 
                  opacity: !show && statIndex > 6 && statsToShow.length > 5 ? ".1" : "1",
                  height: stat.name === 'Games Played' && showGamesPlayedDetail?.[game._id] && stat.homeTeam?.list?.length > 0 ? `${stat.homeTeam.list.length*.9 + 2}rem` : '',
                  background: statIndex%2=== 0 && statIndex !== 0 ? '#f0f0f0' : '',
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
                          stat.awayTeam.list?.map((gamePlayed, gamePlayedIndex) => (
                            <div key={gamePlayed + statIndex + stat.awayTeam.value} style={{ background: gamePlayedIndex%2=== 0 ? '#f0f0f0' : '', fontWeight: '700', color: gamePlayed[0] === 'W' ? 'darkgreen' : '' }}>{gamePlayed}</div>
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
                          stat.homeTeam.list?.map((gamePlayed, gamePlayedIndex) => (
                            <div key={gamePlayed + statIndex + stat.homeTeam.value} style={{ background: gamePlayedIndex%2=== 0 ? '#f0f0f0' : '', fontWeight: '700', color: gamePlayed[0] === 'W' ? 'darkgreen' : '' }}>{gamePlayed}</div>
                          ))
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            ))}
            {(game.stats || []).length > 0 && (
              <div class="center-box" onClick={handleChange}>
                <div className="animated-border-box">
                  {show ? "show less -" : "show more +"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {
        (game.stats || []).length === 0 &&
        <div style={{ marginTop: '1.25rem' }}>
          Stats are not available.
        </div>
      }
    </>
  );
};

export default GamePlayHistory;