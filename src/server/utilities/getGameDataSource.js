const get = require('lodash/get');

const getNflGameDataSource = () => {
  const year = 2024;
  const seasonType = 2; // preseason 1, regular 2, playoffs 3
  const weekNumber = 5;
  const dayNumber = 1; // thursday 1 (first in list on espn), sunday 2, monday 3; games could be on other days so will affect which number module
  const url = `https://www.espn.com/nfl/scoreboard/_/week/${weekNumber}/year/${year}/seasontype/${seasonType}`;
  return { year, seasonType, weekNumber, dayNumber, url };
};

module.exports = {
  getNflGameDataSource,
};