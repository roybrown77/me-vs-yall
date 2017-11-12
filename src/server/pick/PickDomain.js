var moment = require('moment');

var pickRepository = require('./PickRepository');
var gameRepository = require('../game/GameRepository');

function createPick(pick, cb) {
	gameRepository.findById(pick.gameId, function (err, game) {
        if (!isValid(err, game, pick)) {
        	return cb(new Error('It is too late to make a pick.  Picks must be made 5 minutes before game starts.'));
        }

		return pickRepository.create(pick, cb);
    });
}

function updatePick(id, pick, cb) {
	gameRepository.findById(pick.gameId, function (err, game) {
        if (!isValid(err, game, pick)) {
        	return cb(new Error('It is too late to make a pick.  Picks must be made 5 minutes before game starts.'));
        }
		
		return pickRepository.findByIdAndUpdate(id, pick, {new: true}, cb);
    });
}

function isValid(err, game, pick) {
	if (err) throw new Error('Finding game id ' + pick.gameId + ' - ' + err.message);
    if (!game) throw new Error('Game is required.');
    if (!pick) throw new Error('Pick is required.');
    if (!pick.gameId) throw new Error('Game id is required.');
    if (!pick.pickId) throw new Error('Pick id is required.');

	const started = hasGameStarted(game.startDateTime, pick.createDateTime);

	if (started) {
		return false;
	}

	return true;
}

function hasGameStarted(gameDateTime, pickDateTime) {
    const gameStartDateTime = moment(new Date(gameDateTime));
    const currentDateTime = moment(pickDateTime);
    const difference = gameStartDateTime.diff(currentDateTime,'minutes');
    return difference < 5;
}

const domain = { createPick, updatePick };

module.exports = domain;