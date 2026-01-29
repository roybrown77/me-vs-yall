const get = require('lodash/get');

const getNflGameDataSource = () => {
  const year = 2025;
  const seasonType = 3; // preseason 1, regular 2, playoffs 3
  const weekNumber = 3;
  const dayNumber = 1; // thursday(1), friday(2), saturday(3), sunday(4), monday(5); depends on which day the week starts
  const url = `https://www.espn.com/nfl/scoreboard/_/week/${weekNumber}/year/${year}/seasontype/${seasonType}`;
  return { year, seasonType, weekNumber, dayNumber, url };
};

module.exports = {
  getNflGameDataSource,
};