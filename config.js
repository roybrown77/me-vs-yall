const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	nodeEnv: process.env.NODE_ENV,
  	httpPort: process.env.PORT,
  	dbConnectionString: process.env.DB_CONNECTION_STRING,
  	queueUrl: process.env.CLOUDAMQP_URL || 'amqp://localhost',
  	shouldUpdateGames: process.env.SHOULD_UPDATE_GAMES_VIA_WEB_SERVER === 'true',
  	playHistoryCount: process.env.PLAY_HISTORY_COUNT || 5,
  	chromiumVersion: 938248
};