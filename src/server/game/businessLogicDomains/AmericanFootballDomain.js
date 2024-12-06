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

let lastRunTime = 0; // Track the last run time

const loadAmericanFootballGames = async ({
  leagueId, 
  year, 
  message, 
  url,
  teams, 
  root,
  nameSelector,
  spreadSelector,
  startTimeSelector,
  startDateSelector
}) => {
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
    return;
  }
  
  let mvyGames = formatGames({message, games, leagueId, year, teams});

  createGames({message, games: mvyGames});
};

const updateAmericanFootballScores = async ({
  leagueId, 
  year, 
  message, 
  url, 
  teams,
  root,
  pregameNameSelector,
  spreadSelector,
  liveQuarterSelector,
  liveScoreSelector,
  liveNameSelector,
  liveCurrentTimeSelector,
  liveDownSelector,
  livePossession,
  liveCurrentPlaySelector,
  finalNameSelector,
  finalGameOverSelector,
  finalScoreSelector
}) => {
  console.log(`*** update leagueId: ${leagueId}`);

  const now = Date.now();

  const updateGameIntervalSeconds = 10;

  if (now - lastRunTime < (updateGameIntervalSeconds * 1000)) {
    console.log(`${message} update skipped; last update was within ${10} seconds.`);
    return;
  }

  lastRunTime = now;

  try {
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

      if ((eastCoastHour === 2 && minutes > 0 && minutes < 15) || (eastCoastHour === 14 && minutes > 0 && minutes < 15)) {
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
        return;
      }
    }

    console.log(`${message} getting scores.`);

    const scores = await getScores({
      leagueId,
      message, 
      url,
      root,
      pregameNameSelector,
      spreadSelector,
      liveQuarterSelector,
      liveScoreSelector,
      liveNameSelector,
      liveCurrentTimeSelector,
      liveDownSelector,
      livePossession,
      liveCurrentPlaySelector,
      finalNameSelector,
      finalGameOverSelector,
      finalScoreSelector
    });
    
    if (scores.length === 0) {
      console.log(`${message} no scores.`);
      return;
    }

    updateGames({
      leagueId, 
      message,
      games,
      scoreSet: scores,
      teams
    });
  } catch (error) {
    console.error(`${message} updateAmericanFootballScores error:`, error);
}
};

const domain = { 
  loadAmericanFootballGames, 
  updateAmericanFootballScores
};

module.exports = domain;