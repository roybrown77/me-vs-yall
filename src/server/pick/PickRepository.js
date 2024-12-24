const mongoose = require('mongoose');

const PickSchema = new mongoose.Schema({
	leagueId: { type: mongoose.Schema.Types.ObjectId, index: true },
    userId: { type: String, index: true },
	year: { type: Number, index: true },
    createDateTime: { type: 'date', index: true },
    gameType: { type: Number, index: true },
    gameId: mongoose.Schema.Types.ObjectId,
    pickId: mongoose.Schema.Types.ObjectId,
    gameDateTime: 'date',
});
module.exports = mongoose.model('Pick', PickSchema)