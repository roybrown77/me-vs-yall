import moment from "moment-timezone";

import get from "lodash/get";
import last from "lodash/last";
import groupBy from "lodash/groupBy";
import transform from "lodash/transform";
import orderBy from "lodash/orderBy";

import zachBaby from "../styles/images/zach-baby.jpg";
import gold from "../styles/images/gold.png";
import silver from "../styles/images/silver.png";
import bronze from "../styles/images/bronze.png";

// *** leaders

const getLeaders = ({
  games = [],
  picks = [],
  users = [],
  teams = [],
  spreadMode = false,
  isRollup = false,
}) => {
  const sortedGames = orderBy(games, ["_id"], ["desc"]).sort(
    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
  );
  const picksWithVegas = [...picks, ...getVegasPicks(sortedGames)];
  const formattedLeaders = getLeadersFormatted(
    sortedGames,
    picksWithVegas,
    users,
    teams,
    isRollup,
    spreadMode
  );
  const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
  let wins;
  let losses;
  let medalCount = 0;
  formattedLeaders.map((leader) => {
    const leaderWins = areAnyGamesInProgress
      ? leader.winsBeforeGameOver
      : leader.wins;
    const leaderLosses = areAnyGamesInProgress
      ? leader.lossesBeforeGameOver
      : leader.losses;

    if ((leaderWins !== wins || leaderLosses !== losses) && medalCount <= 3) {
      wins = leaderWins;
      losses = leaderLosses;
      medalCount = medalCount + 1;
    }

    if (leaderWins >= wins && leaderLosses >= losses && medalCount === 1) {
      leader.medal = gold;
    }

    if (leaderWins >= wins && leaderLosses >= losses && medalCount === 2) {
      leader.medal = silver;
    }

    if (leaderWins >= wins && leaderLosses >= losses && medalCount === 3) {
      leader.medal = bronze;
    }

    return leader;
  });
  return formattedLeaders;
};

const getLeadersFormatted = (
  games = [],
  picks = [],
  users = [],
  teams = [],
  isRollup = false,
  spreadMode = false
) => {
  const picksByUser = groupBy(picks, "userId");

  const usersHash = users.reduce((obj, item) => {
    obj[item.authServiceId] = item;
    return obj;
  }, {});

  const teamsHash = teams.reduce((obj, item) => {
    obj[item._id] = item;
    return obj;
  }, {});

  let date;

  const pickResults = transform(
    picksByUser,
    (result, value, key) => {
      const user = usersHash[key];
      if (!!user) {
        const leaderPicks = picksByUser[key];
        const pickResult = getResults(games, leaderPicks, spreadMode);
        const winnings = getWinnings(pickResult);

        result.push({
          id: key,
          userName:
            get(user, "firstName", "") + " " + get(user, "lastName", ""),
          picture: key === "1" ? getVegasUser().picture : get(user, "picture"),
          wins: pickResult.wins,
          losses: pickResult.losses,
          spreadWins: pickResult.spreadWins,
          spreadLosses: pickResult.spreadLosses,
          winsBeforeGameOver: pickResult.winsBeforeGameOver,
          lossesBeforeGameOver: pickResult.lossesBeforeGameOver,
          winsInARow: pickResult.winsInARow,
          lossesInARow: pickResult.lossesInARow,
          totalPicks: leaderPicks.length,
          percentage:
            pickResult.wins + pickResult.losses > 0
              ? parseInt(
                  (pickResult.wins / (pickResult.wins + pickResult.losses)) *
                    100
                ) + "%"
              : "",
          positiveWinnings: (winnings || 0) < 0 ? false : true,
          vegasWinnings:
            ((winnings || 0) < 0 ? "-" : "") + formatMoney(winnings),
          games: isRollup
            ? []
            : games.map((game) => {
                const newGameDate = moment(get(game, "startDateTime")).format(
                  "dddd MMM D YYYY"
                );
                const isNewDate = date !== newGameDate;
                if (isNewDate) date = newGameDate;
                const hasStarted = hasGameStarted(game.startDateTime);
                return {
                  ...game,
                  isNewDate,
                  date,
                  awayTeam:
                    (spreadMode &&
                    game.competitors[0]._id === get(game, "spread.teamId")
                      ? "(" + get(game, "spread.amount") + ") "
                      : "") + teamsHash[game.competitors[0]._id].name,
                  awayIndicator: spreadMode
                    ? getSpreadLeaderIndicator(
                        game,
                        leaderPicks,
                        0,
                        1,
                        get(game, "spread.teamId")
                      )
                    : getLeaderIndicator(game, leaderPicks, 0, 1),
                  awayScore: hasStarted
                    ? get(game, "competitors.0.score") || 0
                    : undefined,
                  homeTeam:
                    (spreadMode &&
                    game.competitors[1]._id === get(game, "spread.teamId")
                      ? "(" + get(game, "spread.amount") + ") "
                      : "") + teamsHash[game.competitors[1]._id].name,
                  homeIndicator: spreadMode
                    ? getSpreadLeaderIndicator(
                        game,
                        leaderPicks,
                        1,
                        0,
                        get(game, "spread.teamId")
                      )
                    : getLeaderIndicator(game, leaderPicks, 1, 0),
                  homeScore: hasStarted
                    ? get(game, "competitors.1.score") || 0
                    : undefined,
                };
              }),
        });
      }

      return result;
    },
    []
  );

  return orderBy(
    pickResults,
    ["winsBeforeGameOver", "winsInARow", "wins", "lossesInARow", "userName"],
    ["desc", "desc", "desc", "asc", "asc"]
  );
};

const getWinnings = (results) => {
  return results["wins"] * 100 - results["losses"] * 110;
};

const formatMoney = (number, places, symbol, thousand, decimal) => {
  number = number || 0;
  places = !isNaN((places = Math.abs(places))) ? places : 2;
  symbol = symbol !== undefined ? symbol : "$";
  thousand = thousand || ",";
  decimal = decimal || ".";
  let i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + "";
  let j = i.length > 3 ? i.length % 3 : 0;

  const format =
    symbol +
    (j ? i.substr(0, j) + thousand : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : "");

  return format;
};

const getVegasPicks = (games = []) => {
  return games.map((x) => {
    return {
      gameId: get(x, "spread.amount") ? x._id : "000000000000000000000000",
      userId: "1",
      pickId: get(x, "spread.amount")
        ? get(x, "spread.teamId")
        : get(x, "competitors.1._id"),
    };
  });
};

const vegasPictures = [zachBaby];

const getVegasUser = () => {
  return {
    firstName: "Vegas SuperBook",
    authServiceId: "1",
    picture: vegasPictures[Math.floor(Math.random() * vegasPictures.length)],
  };
};

const getSpreadLeaderIndicator = (
  game,
  picks,
  index1,
  index2,
  spread = null
) => {
  if (!spread) return;

  const teamAPick = picks.find(
    (pick) =>
      pick.pickId === game.competitors[index1]._id && pick.gameId === game._id
  );

  return game.isGameOver &&
    get(game, "spread.teamId") &&
    ((game.competitors[index1].score > game.competitors[index2].score &&
      teamAPick &&
      game.spread.teamId === game.competitors[index1]._id &&
      game.competitors[index1].score - game.competitors[index2].score >=
        getSpreadAmount(game.spread.amount)) ||
      (game.competitors[index1].score >= game.competitors[index2].score &&
        teamAPick &&
        game.spread.teamId === game.competitors[index2]._id) ||
      (game.competitors[index2].score > game.competitors[index1].score &&
        teamAPick &&
        game.spread.teamId === game.competitors[index2]._id &&
        game.competitors[index2].score - game.competitors[index1].score <
          getSpreadAmount(game.spread.amount)))
    ? "#009933"
    : game.isGameOver && get(game, "spread.teamId") && teamAPick
    ? "red"
    : teamAPick
    ? "lightblue"
    : "";
};

const getLeaderIndicator = (game, picks, index1, index2) => {
  return game.isGameOver &&
    ((game.competitors[index1].score === game.competitors[index2].score &&
      picks.find(
        (pick) =>
          pick.pickId === "000000000000000000000000" && pick.gameId === game._id
      )) ||
      (game.competitors[index1].score > game.competitors[index2].score &&
        picks.find(
          (pick) =>
            (pick.pickId === game.competitors[index1]._id ||
              pick.pickId === "000000000000000000000000") &&
            pick.gameId === game._id
        )))
    ? "#009933"
    : game.isGameOver &&
      ((game.competitors[index1].score === game.competitors[index2].score &&
        picks.find(
          (pick) =>
            pick.pickId === game.competitors[index1]._id &&
            pick.gameId === game._id
        )) ||
        (game.isGameOver &&
          game.competitors[index1].score < game.competitors[index2].score &&
          picks.find(
            (pick) =>
              (pick.pickId === game.competitors[index1]._id ||
                pick.pickId === "000000000000000000000000") &&
              pick.gameId === game._id
          )))
    ? "red"
    : picks.find(
        (pick) =>
          (pick.pickId === game.competitors[index1]._id ||
            pick.pickId === "000000000000000000000000") &&
          pick.gameId === game._id
      )
    ? "lightblue"
    : "";
};

// *** shared

const getAreAnyGamesInProgress = (games = []) => {
  return games.some((x) => hasGameStarted(x.startDateTime) && !x.isGameOver);
};

const getAreAllGamesOver = (games = []) => {
  return !games.some((x) => !x.isGameOver);
};

const hasGameStarted = (dateTime) => {
  const gameStartDateTime = moment(new Date(dateTime));
  const currentDateTime = moment(new Date());
  const difference = gameStartDateTime.diff(currentDateTime, "seconds");
  return difference < 5;
};

const getCurrentWeek = (weeks = []) => {
  return last(weeks);
};

const formatWeeks = (gameWeeks = []) => {
  const formattedGameWeeks = gameWeeks.map((week) => {
    const startDateTime = moment(
      week.displayBeginDateTime || week.beginDateTime
    ).format("ddd M/D");
    const endDateTime = moment(week.endDateTime).format("ddd M/D");

    if (startDateTime !== endDateTime) {
      week.displayName =
        (get(week, "description") ? get(week, "description") + " " : "") +
        moment(new Date(week.displayBeginDateTime || week.beginDateTime))
          .tz("America/New_York")
          .format("ddd M/D") +
        " - " +
        moment(new Date(week.endDateTime))
          .tz("America/New_York")
          .format("ddd M/D");
    } else {
      week.displayName =
        (get(week, "description") ? get(week, "description") + " " : "") +
        moment(new Date(week.displayBeginDateTime || week.beginDateTime))
          .tz("America/New_York")
          .format("ddd M/D");
    }

    return week;
  });

  return formattedGameWeeks;
};

const getResults = (games = [], picks = [], spreadMode = false) => {
  let winsInARow = 0;
  let lossesInARow = 0;

  const picksHash = picks.reduce((obj, item) => {
    obj[item.gameId] = item;
    return obj;
  }, {});

  const result = games.reduce(
    (total, game) => {
      const gamePicked = picksHash[game._id];

      if (gamePicked) {
        let winnerSelected = false;

        if (spreadMode && get(game, "spread.teamId")) {
          winnerSelected =
            (game.competitors[0].score > game.competitors[1].score &&
              gamePicked.pickId === game.competitors[0]._id &&
              game.spread.teamId === game.competitors[0]._id &&
              game.competitors[0].score - game.competitors[1].score >=
                getSpreadAmount(game.spread.amount)) ||
            (game.competitors[1].score > game.competitors[0].score &&
              gamePicked.pickId === game.competitors[1]._id &&
              game.spread.teamId === game.competitors[1]._id &&
              game.competitors[1].score - game.competitors[0].score >=
                getSpreadAmount(game.spread.amount)) ||
            (game.competitors[0].score > game.competitors[1].score &&
              gamePicked.pickId === game.competitors[1]._id &&
              game.spread.teamId === game.competitors[0]._id &&
              game.competitors[0].score - game.competitors[1].score <
                getSpreadAmount(game.spread.amount)) ||
            (game.competitors[1].score > game.competitors[0].score &&
              gamePicked.pickId === game.competitors[0]._id &&
              game.spread.teamId === game.competitors[1]._id &&
              game.competitors[1].score - game.competitors[0].score <
                getSpreadAmount(game.spread.amount)) ||
            (game.competitors[0].score >= game.competitors[1].score &&
              gamePicked.pickId === game.competitors[0]._id &&
              game.spread.teamId === game.competitors[1]._id) ||
            (game.competitors[1].score >= game.competitors[0].score &&
              gamePicked.pickId === game.competitors[1]._id &&
              game.spread.teamId === game.competitors[0]._id);
        } else {
          const winner =
            game.competitors[0].score === game.competitors[1].score
              ? "000000000000000000000000"
              : game.competitors[0].score > game.competitors[1].score
              ? game.competitors[0]._id
              : game.competitors[1]._id;

          winnerSelected = gamePicked.pickId === winner;
        }

        if (!spreadMode || (spreadMode && get(game, "spread.teamId"))) {
          if (winnerSelected) {
            if (get(game, "isGameOver", false)) {
              total["wins"]++;
              total["winsBeforeGameOver"]++;
              lossesInARow = 0;
              winsInARow++;
            } else {
              if (hasGameStarted(game.startDateTime)) {
                total["winsBeforeGameOver"]++;
                lossesInARow = 0;
                winsInARow++;
              }
            }
          } else {
            if (get(game, "isGameOver", false)) {
              total["losses"]++;
              total["lossesBeforeGameOver"]++;
              winsInARow = 0;
              lossesInARow++;
            } else {
              if (hasGameStarted(game.startDateTime)) {
                total["lossesBeforeGameOver"]++;
                winsInARow = 0;
                lossesInARow++;
              }
            }
          }
        }
      }

      return total;
    },
    {
      wins: 0,
      losses: 0,
      winsBeforeGameOver: 0,
      lossesBeforeGameOver: 0,
      spreadWins: 0,
      spreadLosses: 0,
    }
  );

  result["lossesInARow"] = lossesInARow;
  result["winsInARow"] = winsInARow;

  return result;
};

const getLeagueStartDateTime = (leagueId, games) => {
  const monthDay = parseInt(moment().format("MMDD"));
  const year = moment().format("YYYY");
  const nextYear = parseInt(year) + 1;

  if (
    leagueId === "59723313734d1d6202a85f15" &&
    monthDay > 108 &&
    monthDay < 820
  ) {
    return moment(`${year}0820`).toISOString();
  }

  if (
    leagueId === "59723313734d1d6202a85f17" &&
    monthDay > 515 &&
    monthDay < 820
  ) {
    return moment(`${year}0820`).toISOString();
  }

  if (
    leagueId === "59723313734d1d6202a85f21" &&
    (monthDay < 301 || monthDay > 1115)
  ) {
    return moment(`${nextYear}0301`).toISOString();
  }

  if (leagueId === "59723313734d1d6202a85f23" && monthDay > 115) {
    return moment(`${year}1231`).toISOString();
  }

  if (
    leagueId === "59723313734d1d6202a85f29" &&
    (monthDay < 301 || monthDay > 1115)
  ) {
    return moment(`${nextYear}0301`).toISOString();
  }

  if (
    leagueId === "59723313734d1d6202a85f31" &&
    monthDay > 415 &&
    monthDay < 1007
  ) {
    return moment(`${year}1007`).toISOString();
  }

  if (
    leagueId === "59723313734d1d6202a85f33" &&
    monthDay > 415 &&
    monthDay < 1007
  ) {
    return moment(`${year}1007`).toISOString();
  }

  return getStartDateTime(games);
};

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

const leagues = [
  {
    id: "59723313734d1d6202a85f10",
    name: "nfl",
    description: "nfl",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
  },
  {
    id: "59723313734d1d6202a85f15",
    name: "cfb",
    description: "cfb",
    years: [2019, 2020, 2021],
  },
  {
    id: "59723313734d1d6202a85f17",
    name: "premier",
    description: "premier",
    years: [2018, 2019, 2020],
  },
  {
    id: "59723313734d1d6202a85f27",
    name: "mma",
    description: "mma",
    years: [2019, 2020, 2021, 2025],
  },
  {
    id: "59723313734d1d6202a85f25",
    name: "boxing",
    description: "boxing",
    years: [2019, 2020, 2021, 2025],
  },
  {
    id: "59723313734d1d6202a85f21",
    name: "mlb",
    description: "mlb",
    years: [2020, 2021, 2025],
  },
  {
    id: "59723313734d1d6202a85f19",
    name: "nba",
    description: "nba",
    years: [2018, 2019, 2020, 2021],
  },
  {
    id: "59723313734d1d6202a85f37",
    name: "wnba",
    description: "wnba",
    years: [2020],
  },
  {
    id: "59723313734d1d6202a85f33",
    name: "ncaam",
    description: "ncaam",
    years: [2019],
  },
  {
    id: "59723313734d1d6202a85f31",
    name: "ncaaw",
    description: "ncaaw",
    years: [2019],
  },
  {
    id: "59723313734d1d6202a85f35",
    name: "nba2k",
    description: "nba 2k",
    years: [2020],
  },
];

const getStartDateTime = (games) => {
  return getAreAllGamesOver(games) ? null : getNextGameStartDateTime(games);
};

const getNextGameStartDateTime = (games) => {
  return get(
    games
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
      .find((x) => x.isGameOver !== true),
    "startDateTime"
  );
};

const getSpreadAmount = (spreadAmount) => {
  const amount = Math.abs(spreadAmount);
  return amount > 70 ? 1.5 : amount;
};

const areAnyGamesOver = (games = []) => {
  return games.some((x) => !!x.isGameOver);
};

const getCopiedGamesToShare = (games = [], picks = [], teams = [], isAuthenticated, userId) => {
  const sortedGames = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

  let list = "";
  let newDate = "";

  sortedGames.forEach((game)=>{
      const displayDateTime = moment(new Date(game.startDateTime));
      const formattedDateTime = displayDateTime.format('dddd MMM D YYYY h:mm a');
      const teamA = teams.find(x=>x._id === game.competitors[0]._id);
      const teamB = teams.find(x=>x._id === game.competitors[1]._id);

      if (newDate !== formattedDateTime) {
          list += '\n' + formattedDateTime + '\n\n';
          newDate = formattedDateTime;
      }

      const selected = isAuthenticated && picks.filter(x=>x.userId === userId).find(x=>x.gameId === game._id && (x.pickId === game.competitors[0]._id || x.pickId === game.competitors[1]._id));
  
      if (selected) {
          list += selected.pickId === game.competitors[0]._id ? teamA.name + ' over ' + teamB.name + '\n' : teamB.name + ' over ' + teamA.name + '\n';
      } else {
          list += teamA.name + ' vs ' + teamB.name + '\n';
      }
  });

  return 'https://www.mevsyall.com\n' + list + '\nhttps://www.mevsyall.com\n\n';
};

export {
  getResults,
  areAnyGamesOver,
  formatWeeks,
  formatMoney,
  getWinnings,
  getCurrentWeek,
  hasGameStarted,
  getAreAllGamesOver,
  getLeaders,
  getAreAnyGamesInProgress,
  leagues,
  getNextGameStartDateTime,
  getStartDateTime,
  getLeaderIndicator,
  getLeagueStartDateTime,
  getRandomIntInclusive,
  getSpreadAmount,
  getCopiedGamesToShare,
};
