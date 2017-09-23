var mongoose = require('mongoose');
var GameSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
	weekNo: Number,
    startDateTime: 'date',
    station: String,
    competitors: Array
});
module.exports = mongoose.model('Game', GameSchema);