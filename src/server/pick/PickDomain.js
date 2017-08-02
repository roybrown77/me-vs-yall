var moment = require('moment');

var pickRepository = require('./PickRepository');
var gameRepository = require('../game/GameRepository');

function createPick(pick, cb) {
	gameRepository.findById(pick.gameId, function (err, game) {
        if (err) throw new Error('Finding game id ' + pick.gameId + ' - ' + err.message);
        if (!game) throw new Error('Game id was not found: ' + pick.gameId);

		var gameStartDateTime = moment.utc(new Date(game.startDateTime)).format("YYYY-MM-DD HH:mm:ss");
		var pickDateTime = moment(new Date(pick.createDateTime)).format("YYYY-MM-DD HH:mm:ss");
		var minuteDifference = moment(gameStartDateTime).diff(pickDateTime, 'minutes');

		// console.log("gameStartDateTime: " + gameStartDateTime);
		// console.log("pickDateTime: " + pickDateTime);
		// console.log("minuteDifference: " + minuteDifference);

		if (minuteDifference < 15) {
			return cb(new Error('It is too late to make a pick.  Picks must be made 15 minutes before game starts.'));
		}
		
		return pickRepository.create(pick, cb);
    });
}

const domain = { createPick };

module.exports = domain;