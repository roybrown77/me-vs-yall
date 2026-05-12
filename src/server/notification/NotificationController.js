const express = require('express');
const pushSubscriptionRepository = require('./PushSubscriptionRepository');
const { vapidPublicKey } = require('../../../config');
const { sendPickReminderOnce } = require('./pickReminderScheduler');

let router = express.Router();

router.get('/vapidPublicKey', (req, res) => {
  if (!vapidPublicKey) {
    return res.status(500).send('Missing VAPID_PUBLIC_KEY');
  }

  return res.status(200).send({ publicKey: vapidPublicKey });
});

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

router.post('/subscriptions', async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const subscription = req.body?.subscription;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).send('Invalid subscription');
    }

    const userAgent = req.body?.userAgent;

    const upsert = {
      userId,
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      userAgent,
    };

    const saved = await pushSubscriptionRepository.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { $set: upsert },
      { upsert: true, new: true }
    );

    return res.status(200).send({ ok: true, id: saved._id });
  } catch (error) {
    console.error('[NOTIFICATIONS] subscriptions POST error', error);
    return res.status(500).send('Error saving subscription');
  }
});

router.delete('/subscriptions', async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const endpoint = req.body?.endpoint;

    if (!endpoint) return res.status(400).send('Missing endpoint');

    await pushSubscriptionRepository.deleteOne({ endpoint, userId });

    return res.status(200).send({ ok: true });
  } catch (error) {
    console.error('[NOTIFICATIONS] subscriptions DELETE error', error);
    return res.status(500).send('Error deleting subscription');
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
