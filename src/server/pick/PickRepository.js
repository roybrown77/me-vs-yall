var mongoose = require('mongoose');

var PickSchema = new mongoose.Schema({
	userId: String,
	leagueId: mongoose.Schema.Types.ObjectId,
    gameId: mongoose.Schema.Types.ObjectId,
    pickId: mongoose.Schema.Types.ObjectId,
    createDateTime: 'date',
    deleted: Boolean
});
module.exports = mongoose.model('Pick', PickSchema)