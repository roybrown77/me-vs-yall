const express = require('express');
const pushSubscriptionRepository = require('./PushSubscriptionRepository');
const { sendPickReminderOnce } = require('./pickReminderScheduler');

let router = express.Router();

const validNotificationTypes = ['upcoming', 'in_progress', 'all_final'];

const normalizeNotificationTypes = (types) => {
  if (!Array.isArray(types) || !types.length) {
    return validNotificationTypes;
  }

  const cleaned = types
    .map((x) => String(x || '').trim().toLowerCase())
    .filter((x) => validNotificationTypes.includes(x));

  return cleaned.length ? [...new Set(cleaned)] : validNotificationTypes;
};

router.get('/subscriptions/me', async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const subscription = await pushSubscriptionRepository.findOne({ userId });
    return res.status(200).send({ subscribed: Boolean(subscription) });
  } catch (error) {
    console.error('[NOTIFICATIONS] subscriptions/me error', error);
    return res.status(500).send('Error fetching subscription');
  }
});

router.post('/subscriptions/authenticated', async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const subscription = req.body?.subscription;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).send('Invalid subscription');
    }

    const userAgent = req.body?.userAgent;
    const notificationTypes = normalizeNotificationTypes(req.body?.notificationTypes);

    const upsert = {
      userId,
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      userAgent,
      notificationTypes,
    };

    const saved = await pushSubscriptionRepository.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { $set: upsert },
      { upsert: true, new: true }
    );

    return res.status(200).send({ ok: true, id: saved._id });
  } catch (error) {
    console.error('[NOTIFICATIONS] subscriptions/authenticated POST error', error);
    return res.status(500).send('Error saving authenticated subscription');
  }
});

// Manual trigger for testing end-to-end push delivery.
router.post('/test/sendPickReminder', async (req, res) => {
  try {
    await sendPickReminderOnce();
    return res.status(200).send({ ok: true });
  } catch (error) {
    console.error('[NOTIFICATIONS] test/sendPickReminder error', error);
    return res.status(500).send('Error sending reminders');
  }
});

module.exports = router;
