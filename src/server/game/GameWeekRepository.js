var mongoose = require('mongoose');
var GameSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
    year: Number,
    seasonType: Number,
    weekNo: Number,
    beginDateTime: 'date',
    endDateTime: 'date',
    description: String,
	weekNumberDisplay: String,
    namePrefix: String,
});
module.exports = mongoose.model('Game_Week', GameSchema);