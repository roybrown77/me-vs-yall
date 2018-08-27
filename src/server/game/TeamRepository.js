var mongoose = require('mongoose');
var TeamSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
	location: String,
	shortLocation: String,
	name: String,
	color: String,
	firstName: String,
	LastName: String,
	colors: Array,
	espnId: String,
});
module.exports = mongoose.model('Team', TeamSchema);