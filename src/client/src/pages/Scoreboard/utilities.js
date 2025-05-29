import moment from 'moment-timezone';
import orderBy from "lodash/orderBy";
import get from "lodash/get";

import { getRandomIntInclusive, getSpreadAmount } from '../../utilities';

const getPicksNotSelected = (games = [], picks = []) => {
    let count = 0;
    games.forEach(game=>{
        if (!picks.find(x=>x.gameId === game._id) && !game.isGameOver) {
            count++;
        }
    });
    return count;
};

const getGroupedGames = ({games = [], picks = [], teams = [], spreadMode = false}) => {
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
            const team = teams.find((x) => x._id === competitor._id);
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
              shortLocation: team.shortLocation,
              location: team.location,
              name: team.name || team.location,
              color: team.color,
              record: competitor.finalRecord || competitor.record,
              country: team.country,
              selectedWinner,
              selected: !!teamAPick,
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
          const team = teams.find((x) => x._id === competitor._id);
          return {
            ...competitor,
            shortLocation: team.shortLocation,
            name: team.name || team.location,
            location: team.location,
            color: team.color,
            record: competitor.finalRecord || competitor.record,
            country: team.country,
            selected: picks.find(
              (x) =>
                x.gameId === game._id &&
                (x.pickId === competitor._id ||
                  x.pickId === "000000000000000000000000")
            )
              ? true
              : false,
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
        ["_id"], ["desc"],
      ).sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)),
    };
  };

export {
    getPicksNotSelected,
    getGroupedGames,
};