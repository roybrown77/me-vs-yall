var mongoose = require('mongoose');
var GameSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
    name: String
});
module.exports = mongoose.model('Game', GameSchema);