const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	leagueId: { type: mongoose.Schema.Types.ObjectId, index: true },
    year: { type: Number, index: true },
    startDateTime: { type: 'date', index: true },
    isHidden: { type: Boolean, index: true },
    playHistory: Array,
    isGameOver: mongoose.Schema.Types.Boolean,
    competitors: Array,
    spread: mongoose.Schema.Types.Mixed,
    down: String,
    currentTime: String,
    gameName: String,
    hashCompetitors: String,
    stats: Array,
    highlights: Array,
    liveVideoUrl: String,
    highlightVideoUrl: String,
    serverLiveVideoUrl: String,
    isWatchable: Boolean,
    possession: String,
    station: String,
});

module.exports = mongoose.model('Game', GameSchema);