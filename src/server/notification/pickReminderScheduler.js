const mongoose = require('mongoose');
const moment = require('moment-timezone');
const webpush = require('web-push');

const {
  vapidSubject,
  vapidPublicKey,
  vapidPrivateKey,
  enablePickPushReminders,
  pickPushReminderWindowHours,
} = require('../../../config');

const gameRepository = require('../game/databaseRepositories/GameRepository');
const gameWeekRepository = require('../game/databaseRepositories/GameWeekRepository');
const pickRepository = require('../pick/PickRepository');
const pushSubscriptionRepository = require('./PushSubscriptionRepository');

const leagueIdToName = {
  '59723313734d1d6202a85f10': 'nfl',
  '59723313734d1d6202a85f15': 'cfb',
  '59723313734d1d6202a85f17': 'premier',
  '59723313734d1d6202a85f27': 'mma',
  '59723313734d1d6202a85f25': 'boxing',
  '59723313734d1d6202a85f21': 'mlb',
  '59723313734d1d6202a85f19': 'nba',
  '59723313734d1d6202a85f37': 'wnba',
  '59723313734d1d6202a85f33': 'ncaam',
  '59723313734d1d6202a85f31': 'ncaaw',
  '59723313734d1d6202a85f35': 'nba2k',
};

const defaultNotificationTypes = ['upcoming', 'in_progress', 'all_final'];

const NFL_LEAGUE_ID = '59723313734d1d6202a85f10';
const PICK_FINALIZE_REMINDER_HOUR = 19;
const PICK_FINALIZE_LOOKAHEAD_DAYS = 21;

const buildPickFinalizeReminderPayload = () => ({
  title: 'Are you ready for some football?!',
  body: 'Finalize your picks.',
  icon: '/favicon.png',
  badge: '/favicon.png',
  tag: 'pick-finalize-reminder',
  renotify: true,
  actions: [
    { action: 'open-picks', title: 'Open Picks' },
    { action: 'dismiss', title: 'Later' },
  ],
  url: '/scoreboards/nfl',
});

const isSevenPmWindow = ({ timezone, dateValue = new Date() }) => {
  const local = moment(dateValue).tz(timezone);
  return local.hour() === PICK_FINALIZE_REMINDER_HOUR && local.minute() < 15;
};

const findGameWeek = (game, gameWeeks = []) => {
  const start = new Date(game.startDateTime).getTime();

  return gameWeeks.find((week) => {
    const begin = new Date(week.beginDateTime).getTime();
    const end = new Date(week.endDateTime).getTime();
    return start >= begin && start <= end;
  });
};

const getUpcomingNflFirstGamesOfWeek = async () => {
  const now = new Date();
  const windowEnd = new Date(Date.now() + PICK_FINALIZE_LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);
  const leagueObjectId = new mongoose.Types.ObjectId(NFL_LEAGUE_ID);

  const games = await gameRepository.find({
    leagueId: leagueObjectId,
    isGameOver: { $ne: true },
    isHidden: { $ne: true },
    startDateTime: { $gt: now, $lte: windowEnd },
  });

  if (!games.length) return [];

  const years = [...new Set(games.map((game) => game.year).filter(Boolean))];
  const gameWeeks = years.length
    ? await gameWeekRepository.find({
        leagueId: leagueObjectId,
        year: years.length === 1 ? years[0] : { $in: years },
      })
    : [];

  const firstGamesByWeek = new Map();

  for (const game of games) {
    const week = findGameWeek(game, gameWeeks);
    const weekKey = week ? String(week._id) : `fallback-${getDateKey(game.startDateTime)}`;
    const existing = firstGamesByWeek.get(weekKey);

    if (!existing || new Date(game.startDateTime) < new Date(existing.startDateTime)) {
      firstGamesByWeek.set(weekKey, game);
    }
  }

  return [...firstGamesByWeek.values()];
};

const isDayBeforeFirstGameOfWeek = ({
  timezone,
  dateValue = new Date(),
  firstGamesOfWeek = [],
}) => {
  if (!firstGamesOfWeek.length) return false;

  const tomorrowKey = moment(dateValue).tz(timezone).clone().add(1, 'day').format('YYYY-MM-DD');

  return firstGamesOfWeek.some((game) => {
    return getLocalDateKey({ dateValue: game.startDateTime, timezone }) === tomorrowKey;
  });
};

const isPickFinalizeReminderWindow = ({
  timezone,
  dateValue = new Date(),
  firstGamesOfWeek = [],
}) => {
  return (
    isSevenPmWindow({ timezone, dateValue }) &&
    isDayBeforeFirstGameOfWeek({ timezone, dateValue, firstGamesOfWeek })
  );
};

const hasNotificationTypeEnabled = ({ subscription, type }) => {
  const configuredTypes = Array.isArray(subscription?.notificationTypes)
    ? subscription.notificationTypes
    : [];

  const types = configuredTypes.length ? configuredTypes : defaultNotificationTypes;
  return types.includes(type);
};

const hasSentEventKey = ({ subscription, eventKey }) => {
  return Array.isArray(subscription?.sentEventKeys) && subscription.sentEventKeys.includes(eventKey);
};

const markEventKeySent = async ({ subscriptionId, eventKey }) => {
  await pushSubscriptionRepository.updateOne(
    { _id: subscriptionId },
    { $addToSet: { sentEventKeys: eventKey } }
  );
};

const getValidTimezone = (timezone) => {
  if (!timezone) return null;
  return moment.tz.zone(timezone) ? timezone : null;
};

const getLocalDateKey = ({ dateValue, timezone }) => {
  return moment(dateValue).tz(timezone).format('YYYY-MM-DD');
};

const buildDailyEventKey = ({ type, timezone, dateValue = new Date() }) => {
  const dateKey = getLocalDateKey({ dateValue, timezone });
  return `${type}:${dateKey}`;
};

const canRun = () => {
  if (!enablePickPushReminders) return false;

  if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
    console.warn('[NOTIFICATIONS] Missing VAPID env vars; pick reminders disabled.');
    return false;
  }

  return true;
};

const configureWebPush = () => {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
};

const getUpcomingGames = async ({ windowHours }) => {
  const now = new Date();
  const windowEnd = new Date(Date.now() + windowHours * 60 * 60 * 1000);

  const search = {
    isGameOver: { $ne: true },
    isHidden: { $ne: true },
    startDateTime: { $gt: now, $lte: windowEnd },
  };

  return gameRepository.find(search);
};

const getInProgressGames = async ({ lookbackHours = 8 }) => {
  const now = new Date();
  const startedAfter = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

  return gameRepository.find({
    isGameOver: { $ne: true },
    isHidden: { $ne: true },
    startDateTime: { $gte: startedAfter, $lte: now },
  });
};

const getRecentlyStartedGames = async ({ lookbackHours = 36 }) => {
  const now = new Date();
  const startedAfter = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

  return gameRepository.find({
    isHidden: { $ne: true },
    startDateTime: { $gte: startedAfter, $lte: now },
  });
};

const getLeagueName = (leagueId) => leagueIdToName[String(leagueId)] || 'nfl';

const getDateKey = (dateValue) => moment(dateValue).utc().format('YYYY-MM-DD');

const buildInProgressEvent = (games = []) => {
  if (!games.length) return null;

  const sorted = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
  const first = sorted[0];
  const leagueName = getLeagueName(first.leagueId);
  const dateKey = getDateKey(first.startDateTime);

  return {
    eventKey: `in-progress:${leagueName}:${dateKey}`,
    payload: {
      title: '⏱️ Games In Progress',
      body: `${sorted.length} game${sorted.length === 1 ? ' is' : 's are'} in progress now`,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: `in-progress-${leagueName}-${dateKey}`,
      renotify: true,
      actions: [
        { action: 'open-picks', title: 'Watch Live' },
        { action: 'dismiss', title: 'Later' },
      ],
      url: `/scoreboards/${leagueName}`,
    },
  };
};

const buildAllFinalEvent = (games = []) => {
  if (!games.length) return null;

  const buckets = new Map();
  for (const game of games) {
    const leagueName = getLeagueName(game.leagueId);
    const dateKey = getDateKey(game.startDateTime);
    const key = `${leagueName}:${dateKey}`;

    if (!buckets.has(key)) {
      buckets.set(key, { leagueName, dateKey, games: [] });
    }
    buckets.get(key).games.push(game);
  }

  const allFinalBuckets = [...buckets.values()].filter((bucket) => {
    return bucket.games.length > 0 && bucket.games.every((game) => game.isGameOver === true);
  });

  if (!allFinalBuckets.length) return null;

  allFinalBuckets.sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
  const chosen = allFinalBuckets[0];

  return {
    eventKey: `all-final:${chosen.leagueName}:${chosen.dateKey}`,
    payload: {
      title: '🏁 Final Scores Ready',
      body: `All ${chosen.leagueName.toUpperCase()} games are final. Check the leaderboard.`,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: `all-final-${chosen.leagueName}-${chosen.dateKey}`,
      renotify: true,
      actions: [
        { action: 'open-leaderboard', title: 'Open Leaderboard' },
        { action: 'dismiss', title: 'Later' },
      ],
      url: `/leaders/${chosen.leagueName}`,
    },
  };
};

const computeMissingPickCount = async ({ userId, gameIds }) => {
  const picks = await pickRepository.find({
    userId,
    gameId: { $in: gameIds },
  });

  const pickedGameIds = new Set(picks.map((p) => String(p.gameId)));
  return gameIds.filter((gameId) => !pickedGameIds.has(String(gameId)));
};

const sendPickFinalizeReminder = async ({
  subscription,
  subscriptionTimezone,
  dateValue = new Date(),
  firstGamesOfWeek = [],
}) => {
  if (
    !isPickFinalizeReminderWindow({
      timezone: subscriptionTimezone,
      dateValue,
      firstGamesOfWeek,
    }) ||
    !hasNotificationTypeEnabled({ subscription, type: 'upcoming' })
  ) {
    return false;
  }

  const pickFinalizeEventKey = buildDailyEventKey({
    type: 'pick-finalize',
    timezone: subscriptionTimezone,
    dateValue,
  });

  if (hasSentEventKey({ subscription, eventKey: pickFinalizeEventKey })) {
    return false;
  }

  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: subscription.keys,
    },
    JSON.stringify(buildPickFinalizeReminderPayload())
  );

  await markEventKeySent({
    subscriptionId: subscription._id,
    eventKey: pickFinalizeEventKey,
  });

  return true;
};

const sendPickReminderOnce = async () => {
  if (!canRun()) return;

  configureWebPush();

  const [upcomingGames, inProgressGames, recentlyStartedGames] = await Promise.all([
    getUpcomingGames({ windowHours: pickPushReminderWindowHours }),
    getInProgressGames({ lookbackHours: 8 }),
    getRecentlyStartedGames({ lookbackHours: 36 }),
  ]);

  const sortedUpcomingGames = [...(upcomingGames || [])].sort(
    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
  );
  const nextGame = sortedUpcomingGames[0];
  const nowMs = Date.now();
  const oneHourFromNow = nowMs + 60 * 60 * 1000;
  const upcomingGamesStartingSoon = sortedUpcomingGames.filter((game) => {
    const startTime = new Date(game.startDateTime).getTime();
    return startTime > nowMs && startTime <= oneHourFromNow;
  });

  const inProgressEvent = buildInProgressEvent(inProgressGames || []);
  const allFinalEvent = buildAllFinalEvent(recentlyStartedGames || []);
  const hasAnyGameEvents =
    Boolean(inProgressEvent) ||
    Boolean(allFinalEvent) ||
    Boolean(upcomingGamesStartingSoon.length);
  const firstGamesOfWeek = await getUpcomingNflFirstGamesOfWeek();

  const subscriptions = await pushSubscriptionRepository.find({});
  if (!subscriptions?.length) return;

  for (const sub of subscriptions) {
    try {
      const validTimezone = getValidTimezone(sub.timezone);
      const subscriptionTimezone = validTimezone || 'UTC';
      const now = new Date();

      await sendPickFinalizeReminder({
        subscription: sub,
        subscriptionTimezone,
        dateValue: now,
        firstGamesOfWeek,
      });

      if (!hasAnyGameEvents) {
        continue;
      }

      if (
        hasNotificationTypeEnabled({ subscription: sub, type: 'upcoming' }) &&
        nextGame &&
        upcomingGamesStartingSoon.length
      ) {
        const unnotifiedStartingSoonGames = upcomingGamesStartingSoon.filter((game) => {
          const eventKey = `upcoming-1h:${String(game._id)}`;
          return !hasSentEventKey({ subscription: sub, eventKey });
        });

        if (unnotifiedStartingSoonGames.length) {
          const targetGameIds = unnotifiedStartingSoonGames.map((g) => g._id);
          const firstTargetGame = unnotifiedStartingSoonGames[0];
          const targetLeagueName = firstTargetGame ? getLeagueName(firstTargetGame.leagueId) : 'nfl';
          let missingGameIds = targetGameIds;

        if (sub.userId) {
          missingGameIds = await computeMissingPickCount({
            userId: sub.userId,
            gameIds: targetGameIds,
          });
        }

        const missingCount = missingGameIds.length;
        if (missingCount > 0) {
          const payload = {
            title: '🏈 Pick Reminder',
            body: sub.userId
              ? `${missingCount} game${missingCount === 1 ? '' : 's'} start in about 1 hour and need your pick`
              : `${missingCount} game${missingCount === 1 ? '' : 's'} start in about 1 hour`,
            icon: '/favicon.png',
            badge: '/favicon.png',
            tag: `pick-reminder-${targetLeagueName}`,
            renotify: true,
            actions: [
              { action: 'open-picks', title: 'Open Picks' },
              { action: 'dismiss', title: 'Later' },
            ],
            url: `/scoreboards/${targetLeagueName}`,
          };

          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              expirationTime: sub.expirationTime,
              keys: sub.keys,
            },
            JSON.stringify(payload)
          );

          for (const gameId of missingGameIds) {
            await markEventKeySent({
              subscriptionId: sub._id,
              eventKey: `upcoming-1h:${String(gameId)}`,
            });
          }
        }
        }
      }

      if (
        inProgressEvent &&
        hasNotificationTypeEnabled({ subscription: sub, type: 'in_progress' }) &&
        !hasSentEventKey({
          subscription: sub,
          eventKey: buildDailyEventKey({
            type: 'in-progress-daily',
            timezone: subscriptionTimezone,
            dateValue: new Date(),
          }),
        })
      ) {
        const inProgressEventKey = buildDailyEventKey({
          type: 'in-progress-daily',
          timezone: subscriptionTimezone,
          dateValue: new Date(),
        });

        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: sub.keys,
          },
          JSON.stringify(inProgressEvent.payload)
        );

        await markEventKeySent({ subscriptionId: sub._id, eventKey: inProgressEventKey });
      }

      if (
        allFinalEvent &&
        hasNotificationTypeEnabled({ subscription: sub, type: 'all_final' }) &&
        !hasSentEventKey({ subscription: sub, eventKey: allFinalEvent.eventKey })
      ) {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: sub.keys,
          },
          JSON.stringify(allFinalEvent.payload)
        );

        await markEventKeySent({ subscriptionId: sub._id, eventKey: allFinalEvent.eventKey });
      }
    } catch (error) {
      const statusCode = error?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // Subscription is gone/expired; clean it up.
        await pushSubscriptionRepository.deleteOne({ _id: sub._id });
      }

      console.error('[NOTIFICATIONS] sendPickReminderOnce error', error);
    }
  }
};

const startPickReminderScheduler = () => {
  if (!canRun()) return;

  // Guard: avoid multiple schedulers (e.g. hot reload)
  if (global.__pickReminderSchedulerStarted) return;
  global.__pickReminderSchedulerStarted = true;

  console.log('[NOTIFICATIONS] Pick reminder scheduler enabled');

  // Run immediately and then every 15 minutes.
  sendPickReminderOnce().catch((e) => console.error(e));
  setInterval(() => {
    sendPickReminderOnce().catch((e) => console.error(e));
  }, 15 * 60 * 1000);
};

module.exports = {
  startPickReminderScheduler,
  sendPickReminderOnce,
  isPickFinalizeReminderWindow,
  isDayBeforeFirstGameOfWeek,
  buildPickFinalizeReminderPayload,
  getUpcomingNflFirstGamesOfWeek,
};
