const mongoose = require('mongoose');

const PickSchema = new mongoose.Schema({
	userId: String,
	leagueId: mongoose.Schema.Types.ObjectId,
	weekNo: Number,
    gameId: mongoose.Schema.Types.ObjectId,
    pickId: mongoose.Schema.Types.ObjectId,
    gameDateTime: 'date',
    createDateTime: 'date',
    year: Number,
    seasonType: Number
});
module.exports = mongoose.model('Pick', PickSchema)