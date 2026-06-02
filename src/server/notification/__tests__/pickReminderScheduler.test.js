const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

const schedulerModulePath = require.resolve('../pickReminderScheduler');

const leagueIdNFL = '59723313734d1d6202a85f10';

const baseEnv = {
  ENABLE_PICK_PUSH_REMINDERS: 'true',
  VAPID_SUBJECT: 'mailto:test@example.com',
  VAPID_PUBLIC_KEY: 'public-key',
  VAPID_PRIVATE_KEY: 'private-key',
  PICK_PUSH_REMINDER_WINDOW_HOURS: '24',
  PICK_PUSH_REMINDER_COOLDOWN_HOURS: '6',
};

test('sendPickReminderOnce sends push when user has missing picks', async () => {
  const originalEnv = {
    ENABLE_PICK_PUSH_REMINDERS: process.env.ENABLE_PICK_PUSH_REMINDERS,
    VAPID_SUBJECT: process.env.VAPID_SUBJECT,
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    PICK_PUSH_REMINDER_WINDOW_HOURS: process.env.PICK_PUSH_REMINDER_WINDOW_HOURS,
    PICK_PUSH_REMINDER_COOLDOWN_HOURS: process.env.PICK_PUSH_REMINDER_COOLDOWN_HOURS,
  };

  Object.assign(process.env, baseEnv);

  const originalLoad = Module._load;

  const calls = {
    setVapidDetails: [],
    sendNotification: [],
    gameFind: [],
    pickFind: [],
    subFind: 0,
    updateOne: [],
    deleteOne: [],
  };

  const games = [
    {
      _id: 'game-early',
      leagueId: leagueIdNFL,
      startDateTime: new Date(Date.now() + 60 * 60 * 1000),
    },
    {
      _id: 'game-late',
      leagueId: leagueIdNFL,
      startDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  ];

  const subscriptions = [
    {
      _id: 'sub-1',
      userId: 'user-1',
      endpoint: 'https://example.com/sub',
      keys: { p256dh: 'p256dh', auth: 'auth' },
      expirationTime: null,
      lastNotifiedAt: null,
    },
  ];

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === '../../../config') {
      return {
        vapidSubject: baseEnv.VAPID_SUBJECT,
        vapidPublicKey: baseEnv.VAPID_PUBLIC_KEY,
        vapidPrivateKey: baseEnv.VAPID_PRIVATE_KEY,
        enablePickPushReminders: true,
        pickPushReminderWindowHours: 24,
        pickPushReminderCooldownHours: 6,
      };
    }

    if (request === 'web-push') {
      return {
        setVapidDetails: (...args) => calls.setVapidDetails.push(args),
        sendNotification: async (...args) => {
          calls.sendNotification.push(args);
        },
      };
    }

    if (request === '../game/databaseRepositories/GameRepository') {
      return {
        find: async (search) => {
          calls.gameFind.push(search);
          return games.filter((game) => {
            const gameStart = new Date(game.startDateTime).getTime();

            if (search?.startDateTime?.$gt) {
              const gt = new Date(search.startDateTime.$gt).getTime();
              if (!(gameStart > gt)) return false;
            }

            if (search?.startDateTime?.$gte) {
              const gte = new Date(search.startDateTime.$gte).getTime();
              if (!(gameStart >= gte)) return false;
            }

            if (search?.startDateTime?.$lt) {
              const lt = new Date(search.startDateTime.$lt).getTime();
              if (!(gameStart < lt)) return false;
            }

            if (search?.startDateTime?.$lte) {
              const lte = new Date(search.startDateTime.$lte).getTime();
              if (!(gameStart <= lte)) return false;
            }

            if (search?.isGameOver?.$ne === true && game.isGameOver === true) {
              return false;
            }

            if (typeof search?.isGameOver === 'boolean' && game.isGameOver !== search.isGameOver) {
              return false;
            }

            if (search?.isHidden?.$ne === true && game.isHidden === true) {
              return false;
            }

            return true;
          });
        },
      };
    }

    if (request === '../pick/PickRepository') {
      return {
        find: async (query) => {
          calls.pickFind.push(query);
          return [{ gameId: 'game-early' }];
        },
      };
    }

    if (request === './PushSubscriptionRepository') {
      return {
        find: async () => {
          calls.subFind += 1;
          return subscriptions;
        },
        updateOne: async (...args) => {
          calls.updateOne.push(args);
        },
        deleteOne: async (...args) => {
          calls.deleteOne.push(args);
        },
      };
    }

    return originalLoad(request, parent, isMain);
  };

  delete require.cache[schedulerModulePath];
  const { sendPickReminderOnce } = require('../pickReminderScheduler');

  await sendPickReminderOnce();

  assert.equal(calls.setVapidDetails.length, 1, 'Expected VAPID config to be set once');
  assert.equal(calls.gameFind.length, 3, 'Expected upcoming, in-progress, and final-status game queries');
  assert.equal(calls.pickFind.length, 1, 'Expected picks query once for subscription user');
  assert.equal(calls.subFind, 1, 'Expected subscription lookup once');
  assert.equal(calls.sendNotification.length, 1, 'Expected one push notification');
  assert.equal(calls.updateOne.length, 1, 'Expected lastNotifiedAt to be updated');
  assert.equal(calls.deleteOne.length, 0, 'Expected no subscription deletions');

  const sentPayload = JSON.parse(calls.sendNotification[0][1]);
  assert.equal(sentPayload.title, '🏈 Me vs Yall');
  assert.equal(sentPayload.body, '1 upcoming game need your pick');
  assert.equal(sentPayload.icon, '/favicon.png');
  assert.equal(sentPayload.badge, '/favicon.png');
  assert.equal(sentPayload.tag, 'pick-reminder-nfl');
  assert.equal(sentPayload.renotify, true);
  assert.deepEqual(sentPayload.actions, [
    { action: 'open-picks', title: 'Open Picks' },
    { action: 'dismiss', title: 'Later' },
  ]);
  assert.equal(sentPayload.url, '/scoreboards/nfl');

  Module._load = originalLoad;
  delete require.cache[schedulerModulePath];

  Object.entries(originalEnv).forEach(([key, value]) => {
    if (typeof value === 'undefined') {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
});
