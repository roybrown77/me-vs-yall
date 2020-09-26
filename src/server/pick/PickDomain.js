const moment = require('moment-timezone');
const mongoose = require('mongoose');

const pickRepository = require('./PickRepository');
const gameRepository = require('../game/GameRepository');

const get = require('lodash/get');

function upsert(pick, cb) {
    gameRepository.findById(pick.gameId, function (err, game) {
        if (!isValid(err, game, pick)) {
            return cb(new Error('It is too late to make a pick.  Picks must be made before game starts.'));
        }

        const finalPick = { 
            ...pick,
            leagueId: get(game,'leagueId'),
            year: get(game,'year')
        }

        return pickRepository.findOneAndUpdate(
            {
                userId: pick.userId, 
                gameId: pick.gameId
            }, 
            finalPick,
            {
                returnNewDocument: true, new: true, upsert: true
            }, 
            cb
        );
    });
}

function isValid(err, game, pick) {
	if (err) {
        console.log('Finding game id ' + pick.gameId + ' - ' + err.message);
        return false;
    }

    if (!get(pick,'gameId')) {
        console.log('Game id is required.');
        return false;
    }

    if (!get(pick,'pickId')) {
        console.log('Pick id is required.');
        return false;
    }

	const started = hasGameStarted(game.startDateTime, pick.createDateTime);

	if (started) {
        console.log(`Game ${get(pick,'gameId')} already started.`);
		return false;
	}

	return true;
}

function hasGameStarted(gameDateTime, pickDateTime) {
    const gameStartDateTime = moment(new Date(gameDateTime));
    const currentDateTime = moment(pickDateTime);
    const difference = gameStartDateTime.diff(currentDateTime,'minutes');
    return difference < 0;
}

const domain = { upsert };

module.exports = domain;