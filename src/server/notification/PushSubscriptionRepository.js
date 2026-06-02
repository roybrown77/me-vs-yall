const mongoose = require('mongoose');

const PushSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    endpoint: { type: String, unique: true, index: true },
    expirationTime: { type: Number },
    keys: {
      p256dh: { type: String },
      auth: { type: String },
    },
    userAgent: { type: String },
    notificationTypes: [{ type: String }],
    sentEventKeys: [{ type: String }],
    lastNotifiedAt: { type: Date, index: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Push_Subscription', PushSubscriptionSchema);
