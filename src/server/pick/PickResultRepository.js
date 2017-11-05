var mongoose = require('mongoose');
var PickResultSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
	weekNo: Number
});
module.exports = mongoose.model('PickResult', PickResultSchema);