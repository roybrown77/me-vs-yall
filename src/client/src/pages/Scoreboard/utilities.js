import moment from 'moment-timezone';
import orderBy from "lodash/orderBy";
import get from "lodash/get";

import {
  getRandomIntInclusive,
  hasGameStarted,
  isSpreadPickWinner,
  isSpreadPush,
} from '../../utilities';

const NFL_LEAGUE_ID = '59723313734d1d6202a85f10';

const isHallOfFameWeek = (week = {}) => {
  const weekLabels = [week?.description, week?.name, week?.displayName]
    .map((value) => String(value || '').toLowerCase());

  return weekLabels.some((label) => label.includes('hall of fame game'));
};

const getNflSeasonOpenerGameId = (games = [], week = {}) => {
  if (!isHallOfFameWeek(week)) {
    return null;
  }

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
      stadiumCity: 'Canton, Ohio, USA',
      stadiumLocation: [
        'Where summer heat shimmers under the lights and a new season roars to life.',
        'In Canton, shoulder pads crack like thunder and opening night writes the first line of legend.',
      ],
    };
  }

  return team;
};

const mergeCompetitorStadiumFields = (competitor = {}, team = {}) => {
  const hasText = (value) =>
    value !== undefined && value !== null && String(value).trim() !== "";

  const competitorLocation = competitor.stadiumLocation;
  const hasLocationOverride =
    Array.isArray(competitorLocation) &&
    competitorLocation.some((line) => String(line || "").trim() !== "");

  return {
    stadiumName: hasText(competitor.stadiumName)
      ? competitor.stadiumName
      : team.stadiumName,
    stadiumCity: hasText(competitor.stadiumCity)
      ? competitor.stadiumCity
      : team.stadiumCity,
    stadiumLocation: hasLocationOverride
      ? competitorLocation
      : team.stadiumLocation,
  };
};

const getPickerLabel = (user) => {
  if (!user) {
    return "?";
  }

  const first = String(user.firstName || "").trim();
  const last = String(user.lastName || "").trim();

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  if (first) {
    return first.slice(0, 2).toUpperCase();
  }

  return "?";
};

const getFieldPickersForGame = (game, revealedPicks = [], users = []) => {
  if (!game || !hasGameStarted(game.startDateTime)) {
    return { away: [], home: [] };
  }

  const awayId = String(game.competitors?.[0]?._id || "");
  const homeId = String(game.competitors?.[1]?._id || "");
  const usersByAuthId = users.reduce((acc, user) => {
    acc[String(user.authServiceId)] = user;
    return acc;
  }, {});

  const away = [];
  const home = [];
  const seen = new Set();

  revealedPicks
    .filter((pick) => String(pick.gameId) === String(game._id))
    .forEach((pick) => {
      const dedupeKey = `${pick.userId}-${pick.pickId}`;
      if (seen.has(dedupeKey)) {
        return;
      }
      seen.add(dedupeKey);

      const user = usersByAuthId[String(pick.userId)];
      const entry = {
        id: String(pick.userId),
        picture: user?.picture || null,
        label: getPickerLabel(user),
      };

      if (String(pick.pickId) === awayId) {
        away.push(entry);
      } else if (String(pick.pickId) === homeId) {
        home.push(entry);
      }
    });

  return { away, home };
};

const getPicksNotSelected = (games = [], picks = []) => {
    return games.reduce((count, game) => {
      const isPickMissing = !picks.some(pick => pick.gameId === game._id);
      const isGameNotStarted = !hasGameStarted(game.startDateTime);
      return isPickMissing && isGameNotStarted ? count + 1 : count;
    }, 0);
};

const getGroupedGames = ({games = [], picks = [], teams = [], spreadMode = false, week = {}}) => {
  const seasonOpenerGameId = getNflSeasonOpenerGameId(games, week);

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
            const spreadPush = get(game, "isGameOver") && isSpreadPush(game);
            const selectedWinner =
              !!teamAPick &&
              !spreadPush &&
              isSpreadPickWinner(game, competitor._id);
            return {
              ...competitor,
              ...team,
              ...mergeCompetitorStadiumFields(competitor, team),
              record: competitor.finalRecord || competitor.record,
              selectedWinner,
              spreadPush: spreadPush && !!teamAPick,
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
            ...mergeCompetitorStadiumFields(competitor, team),
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
    getFieldPickersForGame,
    getPicksNotSelected,
    getGroupedGames,
};