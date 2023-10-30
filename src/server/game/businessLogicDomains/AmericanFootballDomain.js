const mongoose = require('mongoose');
const moment = require('moment-timezone');

const gameRepository = require('../databaseRepositories/GameRepository');

const {
  getGames,
  formatGames,
  createGames,
  getScores,
  updateGames
} = require('../../utilities/utilities');

let isUpdateAmericanFootballScoresRunning = false;

const loadAmericanFootballGames = async ({
  leagueId, 
  year, 
  message, 
  url,
  teams, 
  root = 'scoreboard football',
  nameSelector,
  spreadSelector,
  startTimeSelector,
  startDateSelector
}) => {
  if (isUpdateAmericanFootballScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  isUpdateAmericanFootballScoresRunning = true;

  let games = await getGames({
    leagueId,
    message,
    url,
    root,
    nameSelector,
    spreadSelector,
    startTimeSelector,
    startDateSelector
  });
  
  if ((games || []).length === 0) {
    console.log(`${message} no games`);
    isUpdateAmericanFootballScoresRunning = false;
    return;
  }
  
  let mvyGames = await formatGames({message, games, leagueId, year, teams});

  await createGames({message, games: mvyGames});

  isUpdateAmericanFootballScoresRunning = false;
};

const updateAmericanFootballScores = async ({
  leagueId, 
  year, 
  message, 
  url, 
  teams,
  root = 'scoreboard football',
  pregameNameSelector,
  spreadSelector,
  liveQuarterSelector,
  liveTotalSelector,
  liveNameSelector,
  liveCurrentTimeSelector,
  liveDownSelector,
  livePossession,
  livePlaySelector,
  finalNameSelector,
  finalGameOverSelector,
  finalScoreSelector
}) => {
  console.log(`*** update leagueId: ${leagueId}`);

  if (isUpdateAmericanFootballScoresRunning) {
    console.log(`${message} already running.`)
    return;
  }

  isUpdateAmericanFootballScoresRunning = true;

  const search = {
    leagueId: mongoose.Types.ObjectId(leagueId),
    isGameOver: {
      $ne: true
    },
    startDateTime: {
      $lte: new Date(moment().add(30, 'minutes'))
    },
    year: year
  };

  let games = await gameRepository.find(search);

  if ((games || []).length === 0) {
    console.log(`${message} all scores have been updated or games are not close to starting.`);

    const hours = parseInt(moment().format('HH'));
    const minutes = parseInt(moment().format('mm'));
    const timezoneOffset = moment().utcOffset()/60;
    const eastCoastHour = hours + (-4 - timezoneOffset);

    if ((eastCoastHour === 2 && minutes > 0 && minutes < 15)|| (eastCoastHour === 14 && minutes > 0 && minutes < 15)) {
      const search = {
      leagueId: mongoose.Types.ObjectId(leagueId),
        isGameOver: {
          $ne: true
        },
        year: year
      };

      games = await gameRepository.find(search);
    }

    if ((games || []).length === 0) {
      console.log(`${message} not time to update spread.`);
      isUpdateAmericanFootballScoresRunning = false;
      return;
    }
  }

  console.log(`${message} getting scores.`);

  const scoreSet = await getScores({
    leagueId,
    message, 
    url,
    root,
    pregameNameSelector,
    spreadSelector,
    liveQuarterSelector,
    liveTotalSelector,
    liveNameSelector,
    liveCurrentTimeSelector,
    liveDownSelector,
    livePossession,
    livePlaySelector,
    finalNameSelector,
    finalGameOverSelector,
    finalScoreSelector
  });
  
  if (scoreSet.length === 0) {
    console.log(`${message} no scoreSet.`);
    isUpdateAmericanFootballScoresRunning = false;
    return;
  }

  await updateGames({
    leagueId, 
    message,
    games,
    scoreSet,
    teams
  });

  isUpdateAmericanFootballScoresRunning = false;
};

const domain = { 
  loadAmericanFootballGames, 
  updateAmericanFootballScores
};

module.exports = domain;