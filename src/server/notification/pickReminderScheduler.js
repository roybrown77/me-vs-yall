const mongoose = require('mongoose');
const moment = require('moment-timezone');
const webpush = require('web-push');

const {
  vapidSubject,
  vapidPublicKey,
  vapidPrivateKey,
  enablePickPushReminders,
  pickPushReminderWindowHours,
  pickPushReminderCooldownHours,
} = require('../../../config');

const gameRepository = require('../game/databaseRepositories/GameRepository');
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
      title: '⏱️ Me vs Yall',
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
      title: '🏁 Me vs Yall',
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
  let missing = 0;
  for (const gameId of gameIds) {
    if (!pickedGameIds.has(String(gameId))) missing += 1;
  }

  return missing;
};

const shouldSendForSubscription = ({ subscription, cooldownHours }) => {
  if (!subscription?.lastNotifiedAt) return true;
  const nextAllowedAt = moment(subscription.lastNotifiedAt).add(cooldownHours, 'hours');
  return moment().isAfter(nextAllowedAt);
};

const sendPickReminderOnce = async () => {
  if (!canRun()) return;

  configureWebPush();

  const [upcomingGames, inProgressGames, recentlyStartedGames] = await Promise.all([
    getUpcomingGames({ windowHours: pickPushReminderWindowHours }),
    getInProgressGames({ lookbackHours: 8 }),
    getRecentlyStartedGames({ lookbackHours: 36 }),
  ]);

  const hasAnyEvents =
    (upcomingGames && upcomingGames.length) ||
    (inProgressGames && inProgressGames.length) ||
    (recentlyStartedGames && recentlyStartedGames.length);

  if (!hasAnyEvents) return;

  // Prefer deep-linking to the league of the next upcoming game.
  const sortedUpcomingGames = [...(upcomingGames || [])].sort(
    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
  );
  const nextGame = sortedUpcomingGames[0];
  const leagueName = nextGame ? getLeagueName(nextGame.leagueId) : 'nfl';
  const gameIds = sortedUpcomingGames.map((g) => g._id);

  const inProgressEvent = buildInProgressEvent(inProgressGames || []);
  const allFinalEvent = buildAllFinalEvent(recentlyStartedGames || []);

  const subscriptions = await pushSubscriptionRepository.find({});
  if (!subscriptions?.length) return;

  for (const sub of subscriptions) {
    try {
      if (!shouldSendForSubscription({ subscription: sub, cooldownHours: pickPushReminderCooldownHours })) {
        // Upcoming reminders are cooldown controlled; other event types use dedupe keys.
      } else if (hasNotificationTypeEnabled({ subscription: sub, type: 'upcoming' }) && nextGame) {
        let missingCount = 0;

        if (sub.userId) {
          missingCount = await computeMissingPickCount({ userId: sub.userId, gameIds });
          if (!missingCount) {
            missingCount = 0;
          }
        } else {
          // Guest installs still get a generic upcoming kickoff reminder.
          missingCount = sortedUpcomingGames.length;
        }

        if (missingCount > 0) {
          const payload = {
            title: '🏈 Me vs Yall',
            body: sub.userId
              ? `${missingCount} upcoming game${missingCount === 1 ? '' : 's'} need your pick`
              : `${missingCount} game${missingCount === 1 ? '' : 's'} kick off soon`,
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

          await pushSubscriptionRepository.updateOne(
            { _id: sub._id },
            { $set: { lastNotifiedAt: new Date() } }
          );
        }
      }

      if (
        inProgressEvent &&
        hasNotificationTypeEnabled({ subscription: sub, type: 'in_progress' }) &&
        !hasSentEventKey({ subscription: sub, eventKey: inProgressEvent.eventKey })
      ) {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: sub.keys,
          },
          JSON.stringify(inProgressEvent.payload)
        );

        await markEventKeySent({ subscriptionId: sub._id, eventKey: inProgressEvent.eventKey });
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
};
