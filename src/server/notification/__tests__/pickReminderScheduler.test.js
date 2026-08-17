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
          return [];
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
  assert.equal(calls.gameFind.length, 4, 'Expected upcoming, in-progress, final-status, and NFL first-game queries');
  assert.equal(calls.pickFind.length, 1, 'Expected picks query once for subscription user');
  assert.equal(calls.subFind, 1, 'Expected subscription lookup once');
  assert.equal(calls.sendNotification.length, 1, 'Expected one push notification');
  assert.equal(calls.updateOne.length, 1, 'Expected lastNotifiedAt to be updated');
  assert.equal(calls.deleteOne.length, 0, 'Expected no subscription deletions');

  const sentPayload = JSON.parse(calls.sendNotification[0][1]);
  assert.equal(sentPayload.title, '🏈 Pick Reminder');
  assert.equal(sentPayload.body, '1 game start in about 1 hour and need your pick');
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

test('sendPickReminderOnce sends 7pm reminder day before first game of week', async () => {
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
    gameWeekFind: [],
    pickFind: [],
    subFind: 0,
    updateOne: [],
    deleteOne: [],
  };

  const subscriptions = [
    {
      _id: 'sub-1',
      userId: 'user-1',
      endpoint: 'https://example.com/sub',
      keys: { p256dh: 'p256dh', auth: 'auth' },
      expirationTime: null,
      timezone: 'America/New_York',
      sentEventKeys: [],
    },
  ];

  const nflWeek = {
    _id: 'week-1',
    leagueId: leagueIdNFL,
    year: 2026,
    beginDateTime: new Date('2026-08-19T04:00:00.000Z'),
    endDateTime: new Date('2026-08-26T03:59:59.000Z'),
    description: 'Week 1',
  };

  const firstGameOfWeek = {
    _id: 'game-thursday',
    leagueId: leagueIdNFL,
    year: 2026,
    startDateTime: new Date('2026-08-21T00:20:00.000Z'), // Thu 8:20pm ET
  };

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

          if (String(search?.leagueId) === leagueIdNFL) {
            return [firstGameOfWeek];
          }

          return [];
        },
      };
    }

    if (request === '../game/databaseRepositories/GameWeekRepository') {
      return {
        find: async (search) => {
          calls.gameWeekFind.push(search);
          return [nflWeek];
        },
      };
    }

    if (request === '../pick/PickRepository') {
      return {
        find: async (query) => {
          calls.pickFind.push(query);
          return [];
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
  const {
    sendPickReminderOnce,
    isPickFinalizeReminderWindow,
    isDayBeforeFirstGameOfWeek,
    buildPickFinalizeReminderPayload,
  } = require('../pickReminderScheduler');

  const wednesdaySevenPm = new Date('2026-08-19T23:05:00.000Z'); // Wed 7:05pm ET
  const firstGamesOfWeek = [firstGameOfWeek];

  assert.equal(
    isDayBeforeFirstGameOfWeek({
      timezone: 'America/New_York',
      dateValue: wednesdaySevenPm,
      firstGamesOfWeek,
    }),
    true
  );

  assert.equal(
    isPickFinalizeReminderWindow({
      timezone: 'America/New_York',
      dateValue: wednesdaySevenPm,
      firstGamesOfWeek,
    }),
    true
  );

  assert.equal(
    isPickFinalizeReminderWindow({
      timezone: 'America/New_York',
      dateValue: new Date('2026-08-20T23:05:00.000Z'),
      firstGamesOfWeek,
    }),
    false
  );

  assert.equal(
    isPickFinalizeReminderWindow({
      timezone: 'America/New_York',
      dateValue: wednesdaySevenPm,
      firstGamesOfWeek: [],
    }),
    false
  );

  const payload = buildPickFinalizeReminderPayload();
  assert.equal(payload.title, 'Are you ready for some football?!');
  assert.equal(payload.body, 'Finalize your picks.');

  const originalDate = Date;
  global.Date = class extends Date {
    constructor(...args) {
      if (args.length === 0) {
        super(wednesdaySevenPm.getTime());
        return;
      }

      super(...args);
    }

    static now() {
      return wednesdaySevenPm.getTime();
    }
  };

  await sendPickReminderOnce();

  global.Date = originalDate;

  assert.equal(calls.gameWeekFind.length, 1, 'Expected NFL game weeks lookup');
  assert.equal(calls.sendNotification.length, 1, 'Expected one pick finalize push notification');
  assert.equal(calls.updateOne.length, 1, 'Expected pick finalize event key to be stored');

  const sentPayload = JSON.parse(calls.sendNotification[0][1]);
  assert.equal(sentPayload.title, 'Are you ready for some football?!');
  assert.equal(sentPayload.body, 'Finalize your picks.');
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

test('isPickFinalizeReminderWindow supports playoff Friday before Saturday kickoff', () => {
  delete require.cache[schedulerModulePath];
  const { isPickFinalizeReminderWindow } = require('../pickReminderScheduler');

  const fridaySevenPm = new Date('2026-01-10T00:05:00.000Z'); // Fri 7:05pm ET
  const firstGamesOfWeek = [
    {
      _id: 'game-saturday',
      leagueId: leagueIdNFL,
      year: 2026,
      startDateTime: new Date('2026-01-10T21:30:00.000Z'), // Sat 4:30pm ET
    },
  ];

  assert.equal(
    isPickFinalizeReminderWindow({
      timezone: 'America/New_York',
      dateValue: fridaySevenPm,
      firstGamesOfWeek,
    }),
    true
  );
});

test('isPickFinalizeReminderWindow supports holiday Tuesday before Wednesday kickoff', () => {
  delete require.cache[schedulerModulePath];
  const { isPickFinalizeReminderWindow } = require('../pickReminderScheduler');

  const tuesdaySevenPm = new Date('2026-11-25T00:05:00.000Z'); // Tue 7:05pm ET
  const firstGamesOfWeek = [
    {
      _id: 'game-wednesday',
      leagueId: leagueIdNFL,
      year: 2026,
      startDateTime: new Date('2026-11-25T18:00:00.000Z'), // Wed 1:00pm ET
    },
  ];

  assert.equal(
    isPickFinalizeReminderWindow({
      timezone: 'America/New_York',
      dateValue: tuesdaySevenPm,
      firstGamesOfWeek,
    }),
    true
  );
});
