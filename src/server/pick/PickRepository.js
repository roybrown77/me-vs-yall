var mongoose = require('mongoose');
var PickSchema = new mongoose.Schema({
	userId: mongoose.Schema.Types.ObjectId,
	leagueId: mongoose.Schema.Types.ObjectId,
    gameId: mongoose.Schema.Types.ObjectId,
    pickId: mongoose.Schema.Types.ObjectId,
    createDateTime: 'date'
});
module.exports = mongoose.model('Pick', PickSchema)