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
    if (!game) throw new Error('Game id was not found: ' + pick.gameId);

	const gameStartDateTime = moment.utc(new Date(game.startDateTime)).format("YYYY-MM-DD HH:mm:ss");
	const pickDateTime = moment(new Date(pick.createDateTime)).format("YYYY-MM-DD HH:mm:ss");
	const minuteDiffTime = moment(gameStartDateTime).diff(pickDateTime, 'minutes');
	const minuteDifference = moment.duration(minuteDiffTime,'minutes').asMinutes();

	if (minuteDifference < 5) {
		return false;
	}

	return true;
}

const domain = { createPick, updatePick };

module.exports = domain;