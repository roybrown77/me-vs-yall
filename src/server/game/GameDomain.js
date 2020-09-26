const mongoose = require('mongoose');

const gameRepository = require('../game/GameRepository');

const get = require('lodash/get');
const set = require('lodash/set');

function update(game, cb) {
    gameRepository.findById(game.id, function (err, gameFound) {
        if (!isValid(err, game)) {
            return cb(new Error('Invalid Game.'));
        }

        console.log(`game user: ${game.userId}`);

        const updatedGame = {
          id: game.id,
          competitors: gameFound.competitors,
          gameName: gameFound.gameName,
          isGameOver: gameFound.isGameOver
        };

        if (get(game,'awayScore','null').trim() !== "null") {
            set(updatedGame,'competitors.0.score',parseInt(game.awayScore));
        }

        if (get(game,'homeScore','null').trim() !== "null" ) {
            set(updatedGame,'competitors.1.score',parseInt(game.homeScore));
        }

        if (get(game,'gameName','null').trim() !== "null") {
            set(updatedGame,'gameName',game.gameName);
        }

        if (get(game,'isGameOver','null') !== "null") {
            set(updatedGame,'isGameOver',game.isGameOver);
        }

        if (get(game,'currentTime','null') !== "null") {
            set(updatedGame,'currentTime',game.currentTime);
        }

        console.log(`game updated: ${JSON.stringify(updatedGame)}`);

        return gameRepository.findOneAndUpdate(
            {
                _id: updatedGame.id
            },
            updatedGame, 
            cb
        );
    });
}

function isValid(err, game) {
	if (err) {
        console.log('Finding game id ' + game.id + ' - ' + err.message);
        return false;
    }

    if (!get(game,'id')) {
        console.log('Game id is required.');
        return false;
    }

    if (get(game,'userId') !== 'google-oauth2|114172296334563495985') {
        console.log('User is required.');
        return false;
    }

	return true;
}

const domain = { update };

module.exports = domain;