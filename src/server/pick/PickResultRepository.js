var mongoose = require('mongoose');
var PickResultSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
	weekNo: Number,
	userId: String,
	wins: Number,
	losses: Number,
	ties: Number
});
module.exports = mongoose.model('PickResult', PickResultSchema);