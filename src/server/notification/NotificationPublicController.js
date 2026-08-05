const express = require('express');
const pushSubscriptionRepository = require('./PushSubscriptionRepository');
const { vapidPublicKey } = require('../../../config');

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

const normalizeTimezone = (tz) => {
  const value = String(tz || '').trim();
  return value || null;
};

router.get('/vapidPublicKey', (req, res) => {
  if (!vapidPublicKey) {
    return res.status(500).send('Missing VAPID_PUBLIC_KEY');
  }

  return res.status(200).send({ publicKey: vapidPublicKey });
});

router.post('/subscriptions', async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const subscription = req.body?.subscription;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).send('Invalid subscription');
    }

    const userAgent = req.body?.userAgent;
    const timezone = normalizeTimezone(req.body?.timezone);
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
      timezone,
      notificationTypes,
    };

    const saved = await pushSubscriptionRepository.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { $set: upsert },
      { upsert: true, new: true }
    );

    return res.status(200).send({ ok: true, id: saved._id });
  } catch (error) {
    console.error('[NOTIFICATIONS] public subscriptions POST error', error);
    return res.status(500).send('Error saving subscription');
  }
});

router.delete('/subscriptions', async (req, res) => {
  try {
    const endpoint = req.body?.endpoint;

    if (!endpoint) return res.status(400).send('Missing endpoint');

    await pushSubscriptionRepository.deleteOne({ endpoint });

    return res.status(200).send({ ok: true });
  } catch (error) {
    console.error('[NOTIFICATIONS] public subscriptions DELETE error', error);
    return res.status(500).send('Error deleting subscription');
  }
});

module.exports = router;
