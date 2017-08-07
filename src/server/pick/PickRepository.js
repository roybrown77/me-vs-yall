var mongoose = require('mongoose');

var PickSchema = new mongoose.Schema({
	userId: String,
	leagueId: mongoose.Schema.Types.ObjectId,
	weekNo: Number,
    gameId: mongoose.Schema.Types.ObjectId,
    pickId: String,
    createDateTime: 'date'
});
module.exports = mongoose.model('Pick', PickSchema)