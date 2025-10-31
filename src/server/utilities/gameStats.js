const get = require('lodash/get');

const { ncaaTeams } = require('./teams');

const { nflTeams } = require('../utilities/teams/nfl');

const teamStatTemplate = {
    gamesPlayed: {
      name: "Games Played",
      value: 0,
      displayStat: true,
      list: []
    },
  
    wins: {
      name: "Wins",
      value: 0,
      displayStat: true
    },
  
    losses: {
      name: "Losses",
      value: 0,
      displayStat: true
    },
  
    ties: {
      name: "Ties",
      value: 0,
      displayStat: true
    },
  
    homeGamesPlayed: {
      name: "Home Games Played",
      value: 0,
      displayStat: true
    },
  
    roadGamesPlayed: {
      name: "Road Games Played",
      value: 0,
      displayStat: true
    },
  
    winStreak: {
      name: "Win Streak",
      value: 0,
      displayStat: true
    },
    
    losingStreak: {
      name: "Losing Streak",
      value: 0,
      displayStat: true
    },
  
    pointsScored: {
      name: "Points Scored",
      value: 0,
      displayStat: true
    },
  
    pointsAllowed: {
      name: "Points Allowed",
      value: 0,
      displayStat: true
    },
  
    pointDifferential: {
      name: "Point Diff",
      value: 0,
      displayStat: true
    },
  
    roadPointsScored: {
      name: "Road Points Scored",
      value: 0
    },
  
    roadPointsAllowed: {
      name: "Road Points Allowed",
      value: 0
    },
  
    roadPointDifferential: {
      name: "Road Point Diff",
      value: 0
    },
  
    homePointsScored: {
      name: "Home Points Scored",
      value: 0
    },
  
    homePointsAllowed: {
      name: "Home Points Allowed",
      value: 0
    },
  
    homePointDifferential: {
      name: "Home Point Diff",
      value: 0
    },
  
    pointsScoredAvg: {
      name: "Pnts Scrd Avg",
      value: 0,
      displayStat: true
    },
  
    pointsAllowedAvg: {
      name: "Pnts Allwd Avg",
      value: 0,
      displayStat: true
    },
  
    pointDifferentialAvg: {
      name: "Point Diff Avg",
      value: 0,
      displayStat: true
    },
  
    roadPointsScoredAvg: {
      name: "Road Pnts Scrd Avg",
      value: 0,
      displayStat: true
    },
  
    roadPointsAllowedAvg: {
      name: "Road Pnts Allwd Avg",
      value: 0,
      displayStat: true
    },
  
    roadPointDifferentialAvg: {
      name: "Road Point Diff Avg",
      value: 0,
      displayStat: true
    },
  
    homePointsScoredAvg: {
      name: "Home Pnts Scrd Avg",
      value: 0,
      displayStat: true
    },
  
    homePointsAllowedAvg: {
      name: "Home Pnts Allwd Avg",
      value: 0,
      displayStat: true
    },
  
    homePointDifferentialAvg: {
      name: "Home Point Diff Avg",
      value: 0,
      displayStat: true
    },
  
    mostPointsScored: {
      name: "Most Points Scored",
      value: 0,
      displayStat: true
    },
  
    mostPointsAllowed: {
      name: "Most Points Allowed",
      value: 0,
      displayStat: true
    },
  
    beatVegas: {
      name: "Beat Vegas as Fave",
      value: 0,
      displayStat: true
    },
  
    beatVegasDog: {
      name: "Beat Vegas as Dog",
      value: 0,
      displayStat: true
    },
  
    roadBeatVegas: {
      name: "Beat Vegas as Road Fave",
      value: 0,
      displayStat: true
    },
  
    roadBeatVegasDog: {
      name: "Beat Vegas as Road Dog",
      value: 0,
      displayStat: true
    },
  
    homeBeatVegas: {
      name: "Beat Vegas as Home Fave",
      value: 0,
      displayStat: true
    },
  
    homeBeatVegasDog: {
      name: "Beat Vegas as Home Dog",
      value: 0,
      displayStat: true
    },
  
    topDogScoring: {
      name: "Scored 27 or more",
      value: 0,
      displayStat: true
    },
  
    clutchDefense: {
      name: "Allowed only 23 or less",
      value: 0,
      displayStat: true
    },
  
    clutchWins: {
      name: "Won by less than 8",
      value: 0,
      displayStat: true
    },
    
    closeLosses: {
      name: "Loss by less than 8",
      value: 0,
      displayStat: true
    },
};
  
const getAllTeamStats = (gamesWholeYear) => { 
    let teamStats = {};
  
    if (gamesWholeYear.length > 0 && !['59723313734d1d6202a85f10'].includes(gamesWholeYear[0].leagueId.toString().toLowerCase())) {
      return teamStats;
    }
  
    for (let k = 0; k < gamesWholeYear.length; k++) {
      const game = gamesWholeYear[k];
  
      for (let i = 0; i <= 1; i++) {
        if (!teamStats[game.competitors[i]._id]) {
          teamStats[game.competitors[i]._id] = JSON.parse(JSON.stringify(teamStatTemplate));
        }
  
        teamStats[game.competitors[i]._id].gamesPlayed.value += 1;

        const winStatus = game.competitors[i].score >= game.competitors[1-i].score ? 'W' : 'L';
        const locationStatus = i === 0 ? '@' : 'vs';
        const competitor = nflTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase()).shortLocation;
        const isSpreadValueNegative = game.competitors[1-i]._id.toString().toLowerCase() === game.spread?.teamId?.toString();
        const spread = game.spread?.amount ? (isSpreadValueNegative ? game.spread?.amount : -1*game.spread?.amount) : null;
        const result = `${winStatus} ${game.competitors[i].score || 0}-${game.competitors[1-i].score || 0} ${locationStatus} ${competitor} ${isSpreadValueNegative ? '' : '+'}${spread}`;
    
        teamStats[game.competitors[i]._id].gamesPlayed.list = [...teamStats[game.competitors[i]._id].gamesPlayed.list, result];

        teamStats[game.competitors[i]._id].wins.value += (game.competitors[i].score || 0) > (game.competitors[1-i].score || 0) ? 1 : 0;
        teamStats[game.competitors[i]._id].losses.value += (game.competitors[i].score || 0) < (game.competitors[1-i].score || 0) ? 1 : 0;
        teamStats[game.competitors[i]._id].ties.value += (game.competitors[i].score || 0) === (game.competitors[1-i].score || 0) ? 1 : 0;
  
        teamStats[game.competitors[i]._id].roadGamesPlayed.value += game.competitors[0]._id === game.competitors[i]._id ? 1 : 0;
        teamStats[game.competitors[i]._id].homeGamesPlayed.value += game.competitors[1]._id === game.competitors[i]._id ? 1 : 0;
  
        teamStats[game.competitors[i]._id].winStreak.value = (game.competitors[i].score || 0) > (game.competitors[1-i].score || 0) ? 
        teamStats[game.competitors[i]._id].winStreak.value + 1 : 0;
  
        teamStats[game.competitors[i]._id].losingStreak.value = (game.competitors[i].score || 0) <= (game.competitors[1-i].score || 0) ? 
        teamStats[game.competitors[i]._id].losingStreak.value + 1 : 0;
  
        teamStats[game.competitors[i]._id].pointsScored.value += (game.competitors[i].score || 0);
        teamStats[game.competitors[i]._id].pointsAllowed.value += (game.competitors[1-i].score || 0);
        teamStats[game.competitors[i]._id].pointDifferential.value += ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0));
  
        teamStats[game.competitors[i]._id].roadPointsScored.value += game.competitors[0]._id === game.competitors[i]._id ? (game.competitors[i].score || 0) : 0;
        teamStats[game.competitors[i]._id].roadPointsAllowed.value += game.competitors[0]._id === game.competitors[i]._id ? (game.competitors[1-i].score || 0) : 0;
        teamStats[game.competitors[i]._id].roadPointDifferential.value += teamStats[game.competitors[i]._id].roadPointsScored.value - teamStats[game.competitors[i]._id].roadPointsAllowed.value;
  
        teamStats[game.competitors[i]._id].homePointsScored.value += game.competitors[1]._id === game.competitors[i]._id ? (game.competitors[i].score || 0) : 0;
        teamStats[game.competitors[i]._id].homePointsAllowed.value += game.competitors[1]._id === game.competitors[i]._id ? (game.competitors[1-i].score || 0) : 0;
        teamStats[game.competitors[i]._id].homePointDifferential.value += teamStats[game.competitors[i]._id].homePointsScored.value - teamStats[game.competitors[i]._id].homePointsAllowed.value;
  
        teamStats[game.competitors[i]._id].pointsScoredAvg.value = (teamStats[game.competitors[i]._id].pointsScored.value / teamStats[game.competitors[i]._id].gamesPlayed.value).toFixed(2);
        teamStats[game.competitors[i]._id].pointsAllowedAvg.value = (teamStats[game.competitors[i]._id].pointsAllowed.value / teamStats[game.competitors[i]._id].gamesPlayed.value).toFixed(2);
        teamStats[game.competitors[i]._id].pointDifferentialAvg.value = (teamStats[game.competitors[i]._id].pointsScoredAvg.value - teamStats[game.competitors[i]._id].pointsAllowedAvg.value).toFixed(2);
  
        teamStats[game.competitors[i]._id].roadPointsScoredAvg.value = game.competitors[0]._id === game.competitors[i]._id && 
        teamStats[game.competitors[i]._id].roadGamesPlayed.value > 0 ? 
        (teamStats[game.competitors[i]._id].roadPointsScored.value / teamStats[game.competitors[i]._id].roadGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].roadPointsScoredAvg.value;
  
        teamStats[game.competitors[i]._id].roadPointsAllowedAvg.value = game.competitors[0]._id === game.competitors[i]._id && 
        teamStats[game.competitors[i]._id].roadGamesPlayed.value > 0 ? 
        (teamStats[game.competitors[i]._id].roadPointsAllowed.value / teamStats[game.competitors[i]._id].roadGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].roadPointsAllowedAvg.value;
        
        teamStats[game.competitors[i]._id].roadPointDifferentialAvg.value = (teamStats[game.competitors[i]._id].roadPointsScoredAvg.value - teamStats[game.competitors[i]._id].roadPointsAllowedAvg.value).toFixed(2);
  
        teamStats[game.competitors[i]._id].homePointsScoredAvg.value = game.competitors[1]._id === game.competitors[i]._id && 
        teamStats[game.competitors[i]._id].homeGamesPlayed.value > 0 ?  
        (teamStats[game.competitors[i]._id].homePointsScored.value / teamStats[game.competitors[i]._id].homeGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].homePointsScoredAvg.value;
  
        teamStats[game.competitors[i]._id].homePointsAllowedAvg.value = game.competitors[1]._id === game.competitors[i]._id && 
        teamStats[game.competitors[i]._id].homeGamesPlayed.value > 0 ? 
        (teamStats[game.competitors[i]._id].homePointsAllowed.value / teamStats[game.competitors[i]._id].homeGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].homePointsAllowedAvg.value;
  
        teamStats[game.competitors[i]._id].homePointDifferentialAvg.value = (teamStats[game.competitors[i]._id].homePointsScoredAvg.value - teamStats[game.competitors[i]._id].homePointsAllowedAvg.value).toFixed(2);
  
        teamStats[game.competitors[i]._id].mostPointsScored.value = (game.competitors[i].score || 0) > teamStats[game.competitors[i]._id].mostPointsScored.value ? 
        (game.competitors[i].score || 0) : teamStats[game.competitors[i]._id].mostPointsScored.value;
        
        teamStats[game.competitors[i]._id].mostPointsAllowed.value = (game.competitors[1-i].score || 0) > teamStats[game.competitors[i]._id].mostPointsAllowed.value ? 
        (game.competitors[1-i].score || 0) : teamStats[game.competitors[i]._id].mostPointsAllowed.value;
  
        teamStats[game.competitors[i]._id].clutchWins.value += ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) <= 7 && 
        ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > 0 ? 1 : 0;
  
        teamStats[game.competitors[i]._id].closeLosses.value += ((game.competitors[1-i].score || 0) - (game.competitors[i].score || 0)) <= 7 && 
        ((game.competitors[1-i].score || 0) - (game.competitors[i].score || 0)) > 0 ? 1 : 0;
  
        teamStats[game.competitors[i]._id].beatVegas.value += get(game,'spread.amount') && 
        (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
        ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;
  
        teamStats[game.competitors[i]._id].beatVegasDog.value += get(game,'spread.amount') && 
        (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
        ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;
  
        teamStats[game.competitors[i]._id].homeBeatVegas.value += game.competitors[1]._id === game.competitors[i]._id &&
        get(game,'spread.amount') && 
        (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
        ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;
  
        teamStats[game.competitors[i]._id].homeBeatVegasDog.value += game.competitors[1]._id === game.competitors[i]._id && 
        get(game,'spread.amount') && 
        (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
        ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;
  
        teamStats[game.competitors[i]._id].roadBeatVegas.value += game.competitors[0]._id === game.competitors[i]._id &&
        get(game,'spread.amount') && 
        (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
        ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;
  
        teamStats[game.competitors[i]._id].roadBeatVegasDog.value += game.competitors[0]._id === game.competitors[i]._id && 
        get(game,'spread.amount') && 
        (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
        ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;
  
        teamStats[game.competitors[i]._id].clutchDefense.value += (game.competitors[1-i].score || 0) <= 23 ? 1 : 0;
        teamStats[game.competitors[i]._id].topDogScoring.value += (game.competitors[i].score || 0) >= 27 ? 1 : 0;
      }
    }
  
    return teamStats;
};
  
const getGameStats = (game, teamStats) => {
    const stats = [];
  
    if (!['59723313734d1d6202a85f10', '59723313734d1d6202a85f15'].includes(game.leagueId.toString().toLowerCase())) {
      return stats;
    }
  
    const awayTeamStats = teamStats[game.competitors[0]._id];
    const homeTeamStats = teamStats[game.competitors[1]._id];
  
    if (awayTeamStats && homeTeamStats) {
      for (const [key, value] of Object.entries(teamStatTemplate)) {
        if (!value.displayStat) {
          continue;
        }
  
        const stat = {
          name: value.name,
          awayTeam:  {
            id: game.competitors[0]._id.toString().toLowerCase(),
            name: game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f10' ? nflTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[0]._id.toString().toLowerCase()).name : 
            game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f15' ? ncaaTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[0]._id.toString().toLowerCase()).name : null,
            value: awayTeamStats[key].value,
            list: awayTeamStats[key].list
          },
          homeTeam: {
            id: game.competitors[1]._id.toString().toLowerCase(),
            name: game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f10' ? nflTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[1]._id.toString().toLowerCase()).name : 
            game.leagueId.toString().toLowerCase() === '59723313734d1d6202a85f15' ? ncaaTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[1]._id.toString().toLowerCase()).name : null,
            value: homeTeamStats[key].value,
            list: homeTeamStats[key].list
          }
        };
  
        stats.push(stat);
      }
  
      return stats;
    }
  
    return stats;
};

module.exports = {
  getAllTeamStats,
  getGameStats
};