const get = require('lodash/get');

const { nflTeams } = require('../game/teams');

const teamStatTemplate = {
    gamesPlayed: {
      name: "Games Played",
      value: 0,
      displayStat: true
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
    // last3gamesPlayed: {
    //   name: "Games Played",
    //   value: 0,
    //   displayStat: true,
    //   header: 'Stats for Last 3 Games'
    // },
  
    // last3wins: {
    //   name: "Wins",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3losses: {
    //   name: "Losses",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3ties: {
    //   name: "Ties",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3homeGamesPlayed: {
    //   name: "Home Games Played",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3roadGamesPlayed: {
    //   name: "Road Games Played",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3winStreak: {
    //   name: "Win Streak",
    //   value: 0,
    //   displayStat: true
    // },
    
    // last3losingStreak: {
    //   name: "Losing Streak",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3pointsScored: {
    //   name: "Points Scored",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3pointsAllowed: {
    //   name: "Points Allowed",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3pointDifferential: {
    //   name: "Point Diff",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3roadPointsScored: {
    //   name: "Road Points Scored",
    //   value: 0
    // },
  
    // last3roadPointsAllowed: {
    //   name: "Road Points Allowed",
    //   value: 0
    // },
  
    // last3roadPointDifferential: {
    //   name: "Road Point Diff",
    //   value: 0
    // },
  
    // last3homePointsScored: {
    //   name: "Home Points Scored",
    //   value: 0
    // },
  
    // last3homePointsAllowed: {
    //   name: "Home Points Allowed",
    //   value: 0
    // },
  
    // last3homePointDifferential: {
    //   name: "Home Point Diff",
    //   value: 0
    // },
  
    // last3pointsScoredAvg: {
    //   name: "Pnts Scrd Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3pointsAllowedAvg: {
    //   name: "Pnts Allwd Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3pointDifferentialAvg: {
    //   name: "Point Diff Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3roadPointsScoredAvg: {
    //   name: "Road Pnts Scrd Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3roadPointsAllowedAvg: {
    //   name: "Road Pnts Allwd Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3roadPointDifferentialAvg: {
    //   name: "Road Point Diff Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3homePointsScoredAvg: {
    //   name: "Home Pnts Scrd Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3homePointsAllowedAvg: {
    //   name: "Home Pnts Allwd Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3homePointDifferentialAvg: {
    //   name: "Home Point Diff Avg",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3mostPointsScored: {
    //   name: "Most Points Scored",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3mostPointsAllowed: {
    //   name: "Most Points Allowed",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3beatVegas: {
    //   name: "Beat Vegas as Fave",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3beatVegasDog: {
    //   name: "Beat Vegas as Dog",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3roadBeatVegas: {
    //   name: "Beat Vegas as Road Fave",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3roadBeatVegasDog: {
    //   name: "Beat Vegas as Road Dog",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3homeBeatVegas: {
    //   name: "Beat Vegas as Home Fave",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3homeBeatVegasDog: {
    //   name: "Beat Vegas as Home Dog",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3topDogScoring: {
    //   name: "Scored 27 or more",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3clutchDefense: {
    //   name: "Allowed only 23 or less",
    //   value: 0,
    //   displayStat: true
    // },
  
    // last3clutchWins: {
    //   name: "Won by less than 8",
    //   value: 0,
    //   displayStat: true
    // },
    
    // last3closeLosses: {
    //   name: "Loss by less than 8",
    //   value: 0,
    //   displayStat: true
    // },
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
  
      //   const weeksBetweenGameAndLastGame = moment(gamesWholeYear[gamesWholeYear.length-1].startDateTime).diff(moment(game.startDateTime),'weeks');
      //   console.log(`weeksBetweenGameAndLastGame: ${weeksBetweenGameAndLastGame}`);
      //   if (weeksBetweenGameAndLastGame < 3) {
      //     teamStats[game.competitors[i]._id].last3gamesPlayed.value += 1;
      //     teamStats[game.competitors[i]._id].last3wins.value += (game.competitors[i].score || 0) > (game.competitors[1-i].score || 0) ? 1 : 0;
      //     teamStats[game.competitors[i]._id].last3losses.value += (game.competitors[i].score || 0) < (game.competitors[1-i].score || 0) ? 1 : 0;
      //     teamStats[game.competitors[i]._id].last3ties.value += (game.competitors[i].score || 0) === (game.competitors[1-i].score || 0) ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3roadGamesPlayed.value += game.competitors[0]._id === game.competitors[i]._id ? 1 : 0;
      //     teamStats[game.competitors[i]._id].last3homeGamesPlayed.value += game.competitors[1]._id === game.competitors[i]._id ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3winStreak.value = (game.competitors[i].score || 0) > (game.competitors[1-i].score || 0) ? 
      //     teamStats[game.competitors[i]._id].last3winStreak.value + 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3losingStreak.value = (game.competitors[i].score || 0) <= (game.competitors[1-i].score || 0) ? 
      //     teamStats[game.competitors[i]._id].last3losingStreak.value + 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3pointsScored.value += (game.competitors[i].score || 0);
      //     teamStats[game.competitors[i]._id].last3pointsAllowed.value += (game.competitors[1-i].score || 0);
      //     teamStats[game.competitors[i]._id].last3pointDifferential.value += ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0));
  
      //     teamStats[game.competitors[i]._id].last3roadPointsScored.value += game.competitors[0]._id === game.competitors[i]._id ? (game.competitors[i].score || 0) : 0;
      //     teamStats[game.competitors[i]._id].last3roadPointsAllowed.value += game.competitors[0]._id === game.competitors[i]._id ? (game.competitors[1-i].score || 0) : 0;
      //     teamStats[game.competitors[i]._id].last3roadPointDifferential.value += teamStats[game.competitors[i]._id].last3roadPointsScored.value - teamStats[game.competitors[i]._id].last3roadPointsAllowed.value;
  
      //     teamStats[game.competitors[i]._id].last3homePointsScored.value += game.competitors[1]._id === game.competitors[i]._id ? (game.competitors[i].score || 0) : 0;
      //     teamStats[game.competitors[i]._id].last3homePointsAllowed.value += game.competitors[1]._id === game.competitors[i]._id ? (game.competitors[1-i].score || 0) : 0;
      //     teamStats[game.competitors[i]._id].last3homePointDifferential.value += teamStats[game.competitors[i]._id].last3homePointsScored.value - teamStats[game.competitors[i]._id].last3homePointsAllowed.value;
  
      //     teamStats[game.competitors[i]._id].last3pointsScoredAvg.value = (teamStats[game.competitors[i]._id].last3pointsScored.value / teamStats[game.competitors[i]._id].last3gamesPlayed.value).toFixed(2);
      //     teamStats[game.competitors[i]._id].last3pointsAllowedAvg.value = (teamStats[game.competitors[i]._id].last3pointsAllowed.value / teamStats[game.competitors[i]._id].last3gamesPlayed.value).toFixed(2);
      //     teamStats[game.competitors[i]._id].last3pointDifferentialAvg.value = (teamStats[game.competitors[i]._id].last3pointsScoredAvg.value - teamStats[game.competitors[i]._id].last3pointsAllowedAvg.value).toFixed(2);
  
      //     teamStats[game.competitors[i]._id].last3roadPointsScoredAvg.value = game.competitors[0]._id === game.competitors[i]._id && 
      //     teamStats[game.competitors[i]._id].last3roadGamesPlayed.value > 0 ? 
      //     (teamStats[game.competitors[i]._id].last3roadPointsScored.value / teamStats[game.competitors[i]._id].last3roadGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].last3roadPointsScoredAvg.value;
  
      //     teamStats[game.competitors[i]._id].last3roadPointsAllowedAvg.value = game.competitors[0]._id === game.competitors[i]._id && 
      //     teamStats[game.competitors[i]._id].last3roadGamesPlayed.value > 0 ? 
      //     (teamStats[game.competitors[i]._id].last3roadPointsAllowed.value / teamStats[game.competitors[i]._id].last3roadGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].last3roadPointsAllowedAvg.value;
          
      //     teamStats[game.competitors[i]._id].last3roadPointDifferentialAvg.value = (teamStats[game.competitors[i]._id].last3roadPointsScoredAvg.value - teamStats[game.competitors[i]._id].last3roadPointsAllowedAvg.value).toFixed(2);
  
      //     teamStats[game.competitors[i]._id].last3homePointsScoredAvg.value = game.competitors[1]._id === game.competitors[i]._id && 
      //     teamStats[game.competitors[i]._id].last3homeGamesPlayed.value > 0 ?  
      //     (teamStats[game.competitors[i]._id].last3homePointsScored.value / teamStats[game.competitors[i]._id].last3homeGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].last3homePointsScoredAvg.value;
  
      //     teamStats[game.competitors[i]._id].last3homePointsAllowedAvg.value = game.competitors[1]._id === game.competitors[i]._id && 
      //     teamStats[game.competitors[i]._id].last3homeGamesPlayed.value > 0 ? 
      //     (teamStats[game.competitors[i]._id].last3homePointsAllowed.value / teamStats[game.competitors[i]._id].last3homeGamesPlayed.value).toFixed(2) : teamStats[game.competitors[i]._id].last3homePointsAllowedAvg.value;
  
      //     teamStats[game.competitors[i]._id].last3homePointDifferentialAvg.value = (teamStats[game.competitors[i]._id].last3homePointsScoredAvg.value - teamStats[game.competitors[i]._id].last3homePointsAllowedAvg.value).toFixed(2);
  
      //     teamStats[game.competitors[i]._id].last3mostPointsScored.value = (game.competitors[i].score || 0) > teamStats[game.competitors[i]._id].last3mostPointsScored.value ? 
      //     (game.competitors[i].score || 0) : teamStats[game.competitors[i]._id].last3mostPointsScored.value;
          
      //     teamStats[game.competitors[i]._id].last3mostPointsAllowed.value = (game.competitors[1-i].score || 0) > teamStats[game.competitors[i]._id].last3mostPointsAllowed.value ? 
      //     (game.competitors[1-i].score || 0) : teamStats[game.competitors[i]._id].last3mostPointsAllowed.value;
  
      //     teamStats[game.competitors[i]._id].last3clutchWins.value += ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) <= 7 && 
      //     ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > 0 ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3closeLosses.value += ((game.competitors[1-i].score || 0) - (game.competitors[i].score || 0)) <= 7 && 
      //     ((game.competitors[1-i].score || 0) - (game.competitors[i].score || 0)) > 0 ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3beatVegas.value += get(game,'spread.amount') && 
      //     (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
      //     ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3beatVegasDog.value += get(game,'spread.amount') && 
      //     (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
      //     ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3homeBeatVegas.value += game.competitors[1]._id === game.competitors[i]._id &&
      //     get(game,'spread.amount') && 
      //     (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
      //     ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3homeBeatVegasDog.value += game.competitors[1]._id === game.competitors[i]._id && 
      //     get(game,'spread.amount') && 
      //     (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
      //     ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3roadBeatVegas.value += game.competitors[0]._id === game.competitors[i]._id &&
      //     get(game,'spread.amount') && 
      //     (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[i]._id.toString().toLowerCase() && 
      //     ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) >= Math.abs((get(game,'spread.amount') || 0)) ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3roadBeatVegasDog.value += game.competitors[0]._id === game.competitors[i]._id && 
      //     get(game,'spread.amount') && 
      //     (get(game,'spread.teamId') || '').toString().toLowerCase() === game.competitors[1-i]._id.toString().toLowerCase() && 
      //     ((game.competitors[i].score || 0) - (game.competitors[1-i].score || 0)) > (get(game,'spread.amount') || 0) ? 1 : 0;
  
      //     teamStats[game.competitors[i]._id].last3clutchDefense.value += (game.competitors[1-i].score || 0) <= 23 ? 1 : 0;
      //     teamStats[game.competitors[i]._id].last3topDogScoring.value += (game.competitors[i].score || 0) >= 27 ? 1 : 0;
      //   }
      }
    }
  
    return teamStats;
  };
  
  const getGameStats = (game, teamStats) => {
    const stats = [];
  
    if (!['59723313734d1d6202a85f10'].includes(game.leagueId.toString().toLowerCase())) {
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
          header: value.header,
          awayTeam:  {
            id: game.competitors[0]._id.toString().toLowerCase(),
            name: nflTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[0]._id.toString().toLowerCase()).name,
            value: awayTeamStats[key].value
          },
          homeTeam: {
            id: game.competitors[1]._id.toString().toLowerCase(),
            name: nflTeams.find(x=>x._id.toString().toLowerCase() === game.competitors[1]._id.toString().toLowerCase()).name,
            value: homeTeamStats[key].value
          }
        };
  
        stats.push(stat);
      }
  
      return stats;
    }
  
    //console.log("game.stats: ", JSON.stringify(game.stats));
  
    return stats;
  };

  module.exports = {
    getAllTeamStats,
    getGameStats
  };