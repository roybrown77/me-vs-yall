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
const userRepository = require('../user/UserRepository');
const pushSubscriptionRepository = require('./PushSubscriptionRepository');
const { rankLeaders, formatTopLeadersBody } = require('./leaderRankings');
const {
  buildLeaderboardPath,
  resolveLeaderboardNotificationWeek,
} = require('../game/gameWeekNavigation');

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
const MAX_DAILY_NOTIFICATIONS = 2;

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

const getGamesOnLocalDate = ({ games, timezone, dateKey }) => {
  return games.filter(
    (game) => getLocalDateKey({ dateValue: game.startDateTime, timezone }) === dateKey
  );
};

const isDayBeforeGamesStart = ({
  timezone,
  dateValue = new Date(),
  scheduledGames = [],
}) => {
  const todayKey = getLocalDateKey({ dateValue, timezone });
  const tomorrowKey = moment(dateValue).tz(timezone).add(1, 'day').format('YYYY-MM-DD');
  const gamesToday = getGamesOnLocalDate({ games: scheduledGames, timezone, dateKey: todayKey });
  const gamesTomorrow = getGamesOnLocalDate({
    games: scheduledGames,
    timezone,
    dateKey: tomorrowKey,
  }).filter((game) => game.isGameOver !== true);

  return gamesToday.length === 0 && gamesTomorrow.length > 0;
};

const isPickFinalizeReminderWindow = ({
  timezone,
  dateValue = new Date(),
  scheduledGames = [],
}) => {
  return (
    isSevenPmWindow({ timezone, dateValue }) &&
    isDayBeforeGamesStart({ timezone, dateValue, scheduledGames })
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

const buildDailyEventKey = ({ type, timezone, dateValue = new Date(), suffix = '' }) => {
  const dateKey = getLocalDateKey({ dateValue, timezone });
  return suffix ? `${type}:${suffix}:${dateKey}` : `${type}:${dateKey}`;
};

const getDailyNotificationCount = ({ subscription, timezone, dateValue = new Date() }) => {
  const dateKey = getLocalDateKey({ dateValue, timezone });
  return (subscription?.sentEventKeys || []).filter((key) => key.endsWith(`:${dateKey}`)).length;
};

const canSendAnotherNotificationToday = ({ subscription, timezone, dateValue = new Date() }) => {
  return getDailyNotificationCount({ subscription, timezone, dateValue }) < MAX_DAILY_NOTIFICATIONS;
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

  return gameRepository.find({
    isGameOver: { $ne: true },
    isHidden: { $ne: true },
    startDateTime: { $gt: now, $lte: windowEnd },
  });
};

const getScheduledGames = async () => {
  const windowStart = new Date(Date.now() - 36 * 60 * 60 * 1000);
  const windowEnd = new Date(Date.now() + PICK_FINALIZE_LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);

  return gameRepository.find({
    isHidden: { $ne: true },
    startDateTime: { $gte: windowStart, $lte: windowEnd },
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

const getTodaysUpcomingGames = ({ games, timezone, dateValue = new Date() }) => {
  const todayKey = getLocalDateKey({ dateValue, timezone });
  const nowMs = new Date(dateValue).getTime();

  return games
    .filter((game) => getLocalDateKey({ dateValue: game.startDateTime, timezone }) === todayKey)
    .filter((game) => game.isGameOver !== true && new Date(game.startDateTime).getTime() > nowMs)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
};

const isOneHourBeforeFirstKickoff = ({ timezone, dateValue = new Date(), firstGame }) => {
  if (!firstGame) return false;

  const kickoff = moment(firstGame.startDateTime).tz(timezone);
  const now = moment(dateValue).tz(timezone);
  const minutesUntil = kickoff.diff(now, 'minutes');

  return minutesUntil > 45 && minutesUntil <= 75;
};

const getAllFinalBucketForTimezone = ({ games, timezone }) => {
  const buckets = new Map();

  for (const game of games) {
    const leagueName = getLeagueName(game.leagueId);
    const dateKey = getLocalDateKey({ dateValue: game.startDateTime, timezone });
    const key = `${leagueName}:${dateKey}`;

    if (!buckets.has(key)) {
      buckets.set(key, {
        leagueName,
        dateKey,
        leagueId: game.leagueId,
        year: game.year,
        games: [],
      });
    }

    buckets.get(key).games.push(game);
  }

  const allFinalBuckets = [...buckets.values()].filter((bucket) => {
    return bucket.games.length > 0 && bucket.games.every((game) => game.isGameOver === true);
  });

  if (!allFinalBuckets.length) return null;

  allFinalBuckets.sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
  return allFinalBuckets[0];
};

const buildAllFinalPayload = ({
  leagueName,
  dateKey,
  topLeaders = [],
  leaderboardUrl,
}) => ({
  title: '🏁 Final Scores Ready',
  body: `All ${leagueName.toUpperCase()} games are final. ${formatTopLeadersBody(topLeaders)}`,
  icon: '/favicon.png',
  badge: '/favicon.png',
  tag: `all-final-${leagueName}-${dateKey}`,
  renotify: true,
  actions: [
    { action: 'open-leaderboard', title: 'Open Leaderboard' },
    { action: 'dismiss', title: 'Later' },
  ],
  url: leaderboardUrl || `/leaders/${leagueName}`,
});

const computeMissingPickCount = async ({ userId, gameIds }) => {
  const picks = await pickRepository.find({
    userId,
    gameId: { $in: gameIds },
  });

  const pickedGameIds = new Set(picks.map((p) => String(p.gameId)));
  return gameIds.filter((gameId) => !pickedGameIds.has(String(gameId)));
};

const getLeaderboardSnapshotForNotification = async ({
  referenceGame,
  leaderCache,
  timezone,
  dateValue = new Date(),
}) => {
  const leagueId = referenceGame.leagueId;
  const year = referenceGame.year;
  const leagueName = getLeagueName(leagueId);
  const gameWeeks = await gameWeekRepository.find({ leagueId, year });
  const { week, weekQueryMetaById, useEntireSeason } = resolveLeaderboardNotificationWeek({
    referenceGame,
    gameWeeks,
    timezone,
    dateValue,
  });

  if (!week) {
    return { topLeaders: [], leaderboardUrl: `/leaders/${leagueName}` };
  }

  const cacheKey = `${String(leagueId)}:${year}:${String(week._id)}:${useEntireSeason ? 'season' : 'week'}`;
  if (leaderCache.has(cacheKey)) {
    return leaderCache.get(cacheKey);
  }

  const weekGames = await gameRepository.find({
    leagueId,
    year,
    isHidden: { $ne: true },
    startDateTime: { $gte: week.beginDateTime, $lte: week.endDateTime },
  });

  const gameIds = weekGames.map((game) => game._id);
  const leaderboardUrl = buildLeaderboardPath({
    leagueName,
    year,
    week,
    weekQueryMetaById,
  });

  if (!gameIds.length) {
    const empty = { topLeaders: [], leaderboardUrl };
    leaderCache.set(cacheKey, empty);
    return empty;
  }

  const picks = await pickRepository.find({ gameId: { $in: gameIds } });
  const userIds = [...new Set(picks.map((pick) => pick.userId).filter((id) => id && id !== '1'))];
  const users = userIds.length
    ? await userRepository.find({ authServiceId: { $in: userIds } })
    : [];

  const snapshot = {
    topLeaders: rankLeaders({ games: weekGames, picks, users }).slice(0, 3),
    leaderboardUrl,
  };
  leaderCache.set(cacheKey, snapshot);
  return snapshot;
};

const sendPickFinalizeReminder = async ({
  subscription,
  subscriptionTimezone,
  dateValue = new Date(),
  scheduledGames = [],
}) => {
  if (
    !isPickFinalizeReminderWindow({
      timezone: subscriptionTimezone,
      dateValue,
      scheduledGames,
    }) ||
    !hasNotificationTypeEnabled({ subscription, type: 'upcoming' }) ||
    !canSendAnotherNotificationToday({
      subscription,
      timezone: subscriptionTimezone,
      dateValue,
    })
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

  const [upcomingGames, scheduledGames, recentlyStartedGames] = await Promise.all([
    getUpcomingGames({ windowHours: pickPushReminderWindowHours }),
    getScheduledGames(),
    getRecentlyStartedGames({ lookbackHours: 36 }),
  ]);

  const leaderCache = new Map();

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
        scheduledGames,
      });

      if (
        hasNotificationTypeEnabled({ subscription: sub, type: 'upcoming' }) &&
        canSendAnotherNotificationToday({
          subscription: sub,
          timezone: subscriptionTimezone,
          dateValue: now,
        })
      ) {
        const todaysUpcomingByLeague = new Map();

        for (const game of getTodaysUpcomingGames({
          games: upcomingGames,
          timezone: subscriptionTimezone,
          dateValue: now,
        })) {
          const leagueName = getLeagueName(game.leagueId);
          if (!todaysUpcomingByLeague.has(leagueName)) {
            todaysUpcomingByLeague.set(leagueName, []);
          }
          todaysUpcomingByLeague.get(leagueName).push(game);
        }

        for (const [leagueName, todaysGames] of todaysUpcomingByLeague.entries()) {
          const firstKickoff = todaysGames[0];
          const dailyKickoffEventKey = buildDailyEventKey({
            type: 'upcoming-1h-daily',
            timezone: subscriptionTimezone,
            dateValue: now,
            suffix: leagueName,
          });

          if (
            !isOneHourBeforeFirstKickoff({
              timezone: subscriptionTimezone,
              dateValue: now,
              firstGame: firstKickoff,
            }) ||
            hasSentEventKey({ subscription: sub, eventKey: dailyKickoffEventKey }) ||
            !canSendAnotherNotificationToday({
              subscription: sub,
              timezone: subscriptionTimezone,
              dateValue: now,
            })
          ) {
            continue;
          }

          const targetGameIds = todaysGames.map((game) => game._id);
          let missingGameIds = targetGameIds;

          if (sub.userId) {
            missingGameIds = await computeMissingPickCount({
              userId: sub.userId,
              gameIds: targetGameIds,
            });
          }

          const missingCount = missingGameIds.length;
          if (missingCount <= 0) {
            continue;
          }

          const payload = {
            title: '🏈 Pick Reminder',
            body: sub.userId
              ? `${missingCount} game${missingCount === 1 ? '' : 's'} kick off in about 1 hour and need your pick`
              : `${missingCount} game${missingCount === 1 ? '' : 's'} kick off in about 1 hour`,
            icon: '/favicon.png',
            badge: '/favicon.png',
            tag: `pick-reminder-${leagueName}`,
            renotify: true,
            actions: [
              { action: 'open-picks', title: 'Open Picks' },
              { action: 'dismiss', title: 'Later' },
            ],
            url: `/scoreboards/${leagueName}`,
          };

          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              expirationTime: sub.expirationTime,
              keys: sub.keys,
            },
            JSON.stringify(payload)
          );

          await markEventKeySent({
            subscriptionId: sub._id,
            eventKey: dailyKickoffEventKey,
          });
        }
      }

      if (
        hasNotificationTypeEnabled({ subscription: sub, type: 'all_final' }) &&
        canSendAnotherNotificationToday({
          subscription: sub,
          timezone: subscriptionTimezone,
          dateValue: now,
        })
      ) {
        const allFinalBucket = getAllFinalBucketForTimezone({
          games: recentlyStartedGames,
          timezone: subscriptionTimezone,
        });

        if (allFinalBucket) {
          const allFinalEventKey = buildDailyEventKey({
            type: 'all-final-daily',
            timezone: subscriptionTimezone,
            dateValue: now,
            suffix: allFinalBucket.leagueName,
          });

          if (!hasSentEventKey({ subscription: sub, eventKey: allFinalEventKey })) {
            const { topLeaders, leaderboardUrl } = await getLeaderboardSnapshotForNotification({
              referenceGame: allFinalBucket.games[0],
              leaderCache,
              timezone: subscriptionTimezone,
              dateValue: now,
            });

            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                expirationTime: sub.expirationTime,
                keys: sub.keys,
              },
              JSON.stringify(
                buildAllFinalPayload({
                  leagueName: allFinalBucket.leagueName,
                  dateKey: allFinalBucket.dateKey,
                  topLeaders,
                  leaderboardUrl,
                })
              )
            );

            await markEventKeySent({
              subscriptionId: sub._id,
              eventKey: allFinalEventKey,
            });
          }
        }
      }
    } catch (error) {
      const statusCode = error?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await pushSubscriptionRepository.deleteOne({ _id: sub._id });
      }

      console.error('[NOTIFICATIONS] sendPickReminderOnce error', error);
    }
  }
};

const startPickReminderScheduler = () => {
  if (!canRun()) return;

  if (global.__pickReminderSchedulerStarted) return;
  global.__pickReminderSchedulerStarted = true;

  console.log('[NOTIFICATIONS] Pick reminder scheduler enabled');

  sendPickReminderOnce().catch((e) => console.error(e));
  global.__pickReminderInterval = setInterval(() => {
    sendPickReminderOnce().catch((e) => console.error(e));
  }, 15 * 60 * 1000);
};

const stopPickReminderScheduler = () => {
  if (global.__pickReminderInterval) {
    clearInterval(global.__pickReminderInterval);
    global.__pickReminderInterval = undefined;
  }

  global.__pickReminderSchedulerStarted = false;
};

module.exports = {
  startPickReminderScheduler,
  stopPickReminderScheduler,
  sendPickReminderOnce,
  isPickFinalizeReminderWindow,
  isDayBeforeGamesStart,
  buildPickFinalizeReminderPayload,
  getGamesOnLocalDate,
  getDailyNotificationCount,
  canSendAnotherNotificationToday,
  isOneHourBeforeFirstKickoff,
  buildAllFinalPayload,
  formatTopLeadersBody,
};
