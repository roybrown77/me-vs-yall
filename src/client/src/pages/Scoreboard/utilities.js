import moment from 'moment-timezone';
import orderBy from "lodash/orderBy";
import get from "lodash/get";

import { getRandomIntInclusive, getSpreadAmount, hasGameStarted } from '../../utilities';

const NFL_LEAGUE_ID = '59723313734d1d6202a85f10';

const getNflSeasonOpenerGameId = (games = []) => {
  const nflGames = games
    .filter((game) => game?.leagueId === NFL_LEAGUE_ID && game?.startDateTime)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

  if (nflGames.length === 0) {
    return null;
  }

  const julyOrAugustOpener = nflGames.find((game) => {
    const month = moment(game.startDateTime).month() + 1;
    return month === 7 || month === 8;
  });

  return (julyOrAugustOpener || nflGames[0])._id;
};

const applyNflVenueOverrides = ({ game, team, isSeasonOpener = false }) => {
  if (!game || !team || game?.leagueId !== NFL_LEAGUE_ID) {
    return team;
  }

  const month = moment(game.startDateTime).month() + 1;

  if (month === 2) {
    return {
      ...team,
      stadiumName: '',
      stadiumCity: '',
      stadiumLocation: [''],
    };
  }

  if (isSeasonOpener) {
    return {
      ...team,
      stadiumName: 'Tom Benson Hall of Fame Stadium',
      stadiumCity: 'Canton, Ohio',
      stadiumLocation: [
        'Where summer heat shimmers under the lights and a new season roars to life.',
        'In Canton, shoulder pads crack like thunder and opening night writes the first line of legend.',
      ],
    };
  }

  return team;
};

const getPicksNotSelected = (games = [], picks = []) => {
    return games.reduce((count, game) => {
      const isPickMissing = !picks.some(pick => pick.gameId === game._id);
      const isGameNotStarted = !hasGameStarted(game.startDateTime);
      return isPickMissing && isGameNotStarted ? count + 1 : count;
    }, 0);
};

const getGroupedGames = ({games = [], picks = [], teams = [], spreadMode = false}) => {
  const seasonOpenerGameId = getNflSeasonOpenerGameId(games);

    const formattedGames = games.map((game) => {
      const displayDateTime = moment(new Date(game.startDateTime));
      const away = teams.find((x) => x._id === game.competitors[0]._id);
      const home = teams.find((x) => x._id === game.competitors[1]._id);
      const emojis = `${
              away?.emojis?.[
                getRandomIntInclusive(0, away?.emojis?.length - 1)
              ] || away?.name
            } 🆚 ${
              home?.emojis?.[
                getRandomIntInclusive(0, home?.emojis?.length - 1)
              ] || home?.name
            }`;
      const gameName =
        game?.gameName?.trim()?.length > 0
          ? (emojis ? `${game.gameName} *** ${emojis}` : game.gameName)
          : emojis;
      if (spreadMode) {
        return {
          ...game,
          startDateTimeDisplay: displayDateTime.format("dddd MMM D YYYY h:mm a"),
          gameName,
          competitors: game.competitors.map((competitor, index) => {
            const team = applyNflVenueOverrides({
              game,
              team: teams.find((x) => x._id === competitor._id),
              isSeasonOpener: game?._id === seasonOpenerGameId,
            });
            const index1 = index;
            const index2 = index === 0 ? 1 : 0;
            const teamAPick = picks.find(
              (pick) => pick.pickId === competitor._id && pick.gameId === game._id
            );
            const selectedWinner =
              get(game, "spread.teamId") &&
              ((game.competitors[index1].score > game.competitors[index2].score &&
                teamAPick &&
                game.spread.teamId === game.competitors[index1]._id &&
                game.competitors[index1].score - game.competitors[index2].score >=
                  getSpreadAmount(game.spread.amount)) ||
                (game.competitors[index1].score >=
                  game.competitors[index2].score &&
                  teamAPick &&
                  game.spread.teamId === game.competitors[index2]._id) ||
                (game.competitors[index2].score >
                  game.competitors[index1].score &&
                  teamAPick &&
                  game.spread.teamId === game.competitors[index2]._id &&
                  game.competitors[index2].score -
                    game.competitors[index1].score <
                    getSpreadAmount(game.spread.amount)));
            return {
              ...competitor,
              ...team,
              record: competitor.finalRecord || competitor.record,
              selectedWinner,
              selected: !!teamAPick,
              name: team.name || team.location,
            };
          }),
        };
      }
  
      return {
        ...game,
        startDateTimeDisplay: displayDateTime.format("dddd MMM D YYYY h:mm a"),
        winner:
          game.competitors[0].score === game.competitors[1].score
            ? "000000000000000000000000"
            : game.competitors[0].score > game.competitors[1].score
            ? game.competitors[0]._id
            : game.competitors[1]._id,
        gameName,
        competitors: game.competitors.map((competitor) => {
          const team = applyNflVenueOverrides({
            game,
            team: teams.find((x) => x._id === competitor._id),
            isSeasonOpener: game?._id === seasonOpenerGameId,
          });
          return {
            ...competitor,
            ...team,
            record: competitor.finalRecord || competitor.record,
            selected: picks.find(
              (x) =>
                x.gameId === game._id &&
                (x.pickId === competitor._id ||
                  x.pickId === "000000000000000000000000")
            )
              ? true
              : false,
            name: team.name || team.location,
          };
        }),
      };
    });
  
    return {
      notCompleted: orderBy(
        formattedGames.filter((x) => !x.isGameOver),
        ["_id"], ["desc"],
      ).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)),
      completed: orderBy(
        formattedGames.filter((x) => x.isGameOver),
        ["_id"], ["asc"],
      ).sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)),
    };
  };

export {
    getPicksNotSelected,
    getGroupedGames,
};