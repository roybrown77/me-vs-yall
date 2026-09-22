const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	nodeEnv: process.env.NODE_ENV,
  	httpPort: process.env.PORT,
  	dbConnectionString: process.env.DB_CONNECTION_STRING,
	playHistoryCount: process.env.PLAY_HISTORY_COUNT || 10,

	// Web Push / Notifications
	vapidSubject: process.env.VAPID_SUBJECT,
	vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
	vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
	enablePickPushReminders: process.env.ENABLE_PICK_PUSH_REMINDERS === 'true',
	pickPushReminderWindowHours: Number(process.env.PICK_PUSH_REMINDER_WINDOW_HOURS || 24),
	pickPushReminderCooldownHours: Number(process.env.PICK_PUSH_REMINDER_COOLDOWN_HOURS || 6),
};