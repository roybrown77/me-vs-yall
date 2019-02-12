const mongoose = require('mongoose');
const GameSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
    year: Number,
    seasonType: Number,
    weekNo: Number,
    beginDateTime: 'date',
    endDateTime: 'date',
    description: String,
	weekNumberDisplay: String,
    namePrefix: String,
    prize: mongoose.Schema.Types.Mixed
});
module.exports = mongoose.model('Game_Week', GameSchema);