const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	leagueId: { type: mongoose.Schema.Types.ObjectId, index: true },
    year: { type: Number, index: true },
    startDateTime: { type: 'date', index: true },
    isHidden: { type: Boolean, index: true },
    isGameOver: { type: mongoose.Schema.Types.Boolean, index: true },
    competitors: Array,
    hashCompetitors: String,
    spread: mongoose.Schema.Types.Mixed,
    overUnder: Number,
    currentTime: String,
    down: String,
    playHistory: Array,
    gameName: String,
    stats: Array,
    highlights: Array,
    liveVideoUrl: String,
    highlightVideoUrl: String,
    serverLiveVideoUrl: String,
    isWatchable: Boolean,
    possession: String,
    station: String,
    endDateTime: { type: 'date', index: true },
});

module.exports = mongoose.model('Game', GameSchema);