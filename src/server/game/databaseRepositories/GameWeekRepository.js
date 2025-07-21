const mongoose = require('mongoose');

const GameWeekSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
    year: Number,
    beginDateTime: 'date',
    endDateTime: 'date',
    description: String,
    isRollup: mongoose.Schema.Types.Boolean
});

module.exports = mongoose.model('Game_Week', GameWeekSchema);