import get from 'lodash/get';
import moment from 'moment-timezone';

const EASTERN = 'America/New_York';

export const formatSpreadAmount = (amount) => {
  const n = Number(amount);
  if (!Number.isFinite(n) || n === 0) {
    return 'PK';
  }
  return n > 0 ? `+${n}` : String(n);
};

export const getSpreadFavoriteCompetitor = (game) => {
  const teamId = get(game, 'spread.teamId');
  if (!teamId) {
    return null;
  }
  return (game.competitors || []).find(
    (c) => String(c._id) === String(teamId),
  );
};

export const formatSpreadFavoriteLabel = (game) => {
  const favorite = getSpreadFavoriteCompetitor(game);
  const amount = get(game, 'spread.amount');
  if (!favorite) {
    return 'Spread —';
  }
  const name =
    favorite.shortLocation || favorite.alternateName || favorite.name || 'Favorite';
  return `${name} ${formatSpreadAmount(amount)}`;
};

export const formatOverUnderLabel = (game) => {
  const ou = get(game, 'overUnder');
  if (ou === undefined || ou === null || ou === '') {
    return 'O/U —';
  }
  return `O/U ${ou}`;
};

const formatHistoryDate = (dateKey) =>
  moment.tz(dateKey, 'YYYY-MM-DD', EASTERN).format('ddd MMM D');

export const buildSpreadHistoryRows = (game) => {
  const history = get(game, 'spreadHistory');
  if (Array.isArray(history) && history.length > 0) {
    return history.map((row) => {
      const competitor = (game.competitors || []).find(
        (c) => String(c._id) === String(row.teamId),
      );
      const name =
        competitor?.shortLocation ||
        competitor?.alternateName ||
        competitor?.name ||
        'Favorite';
      return {
        date: row.date,
        dateLabel: formatHistoryDate(row.date),
        valueLabel: `${name} ${formatSpreadAmount(row.amount)}`,
      };
    });
  }

  const favorite = getSpreadFavoriteCompetitor(game);
  if (!favorite) {
    return [];
  }

  const spreadDate = get(game, 'spread.spreadDateTime');
  const dateKey = spreadDate
    ? moment(spreadDate).tz(EASTERN).format('YYYY-MM-DD')
    : moment().tz(EASTERN).format('YYYY-MM-DD');

  return [
    {
      date: dateKey,
      dateLabel: formatHistoryDate(dateKey),
      valueLabel: formatSpreadFavoriteLabel(game),
    },
  ];
};

export const buildOverUnderHistoryRows = (game) => {
  const history = get(game, 'overUnderHistory');
  if (Array.isArray(history) && history.length > 0) {
    return history.map((row) => ({
      date: row.date,
      dateLabel: formatHistoryDate(row.date),
      valueLabel: String(row.value),
    }));
  }

  const ou = get(game, 'overUnder');
  if (ou === undefined || ou === null || ou === '') {
    return [];
  }

  const dateKey = moment().tz(EASTERN).format('YYYY-MM-DD');
  return [
    {
      date: dateKey,
      dateLabel: formatHistoryDate(dateKey),
      valueLabel: String(ou),
    },
  ];
};

export const spreadLineHasMovement = (game) => {
  const history = get(game, 'spreadHistory');
  if (Array.isArray(history) && history.length >= 2) {
    const keys = new Set(
      history.map((row) => `${row.teamId}:${Number(row.amount)}`),
    );
    return keys.size > 1;
  }
  return false;
};

export const overUnderLineHasMovement = (game) => {
  const history = get(game, 'overUnderHistory');
  if (Array.isArray(history) && history.length >= 2) {
    const values = new Set(history.map((row) => Number(row.value)));
    return values.size > 1;
  }
  return false;
};
