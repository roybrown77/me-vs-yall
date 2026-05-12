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

  const games = await getUpcomingGames({ windowHours: pickPushReminderWindowHours });
  if (!games?.length) return;

  // Prefer deep-linking to the league of the next upcoming game.
  const sorted = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
  const nextGame = sorted[0];
  const leagueName = leagueIdToName[String(nextGame.leagueId)] || 'nfl';

  const gameIds = sorted.map((g) => g._id);

  const subscriptions = await pushSubscriptionRepository.find({});
  if (!subscriptions?.length) return;

  for (const sub of subscriptions) {
    try {
      if (!shouldSendForSubscription({ subscription: sub, cooldownHours: pickPushReminderCooldownHours })) {
        continue;
      }

      const missingCount = await computeMissingPickCount({ userId: sub.userId, gameIds });
      if (!missingCount) continue;

      const payload = {
        title: 'Me vs Yall',
        body: `${missingCount} upcoming game${missingCount === 1 ? '' : 's'} need your pick`,
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
