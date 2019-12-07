const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	leagueId: mongoose.Schema.Types.ObjectId,
    startDateTime: 'date',
    station: String,
    isGameOver: mongoose.Schema.Types.Boolean,
    competitors: Array,
    year: Number,
    spread: mongoose.Schema.Types.Mixed,
    possession: String,
    down: String,
    playHistory: Array,
    currentTime: String,
    gameName: String,
    hashCompetitors: String
});

module.exports = mongoose.model('Game', GameSchema);