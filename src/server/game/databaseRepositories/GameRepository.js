const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	leagueId: { type: mongoose.Schema.Types.ObjectId, index: true },
    year: { type: Number, index: true },
    gameName: String,
    startDateTime: { type: 'date', index: true },
    competitors: Array,
    hashCompetitors: String,
    spread: mongoose.Schema.Types.Mixed,
    overUnder: Number,
    currentTime: String,
    down: String,
    weather: String,
    stats: Array,
    isGameOver: { type: mongoose.Schema.Types.Boolean, index: true },
    finalStatusDueAt: { type: Date },
    isHidden: { type: Boolean, index: true },
    isGameOfTheWeek: { type: Boolean, index: true },
    // deprecate following fields
    playHistory: Array,
    highlights: Array,
    station: String,
    possession: String,
    endDateTime: { type: 'date', index: true },
    liveVideoUrl: String,
    highlightVideoUrl: String,
    serverLiveVideoUrl: String,
    isWatchable: Boolean,
});

module.exports = mongoose.model('Game', GameSchema);