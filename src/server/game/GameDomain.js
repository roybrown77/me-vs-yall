const mongoose = require('mongoose');
const moment = require('moment-timezone');

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

        if (get(game,'awayRank','null').trim() !== "null") {
            set(updatedGame,'competitors.0.rank',game.awayRank);
        }

        if (get(game,'awayRecord','null').trim() !== "null") {
            set(updatedGame,'competitors.0.record',game.awayRecord);
        }

        if (get(game,'awaySpread','null').trim() !== "null") {
            const spread = {
              teamId: get(gameFound,'competitors.0._id'),
              amount: get(game,'awaySpread'),
              spreadDateTime: moment().toISOString()
            };
            set(updatedGame,'spread',spread);
        }

        if (get(game,'homeScore','null').trim() !== "null" ) {
            set(updatedGame,'competitors.1.score',parseInt(game.homeScore));
        }

        if (get(game,'homeRank','null').trim() !== "null" ) {
            set(updatedGame,'competitors.1.rank',game.homeRank);
        }

        if (get(game,'homeRecord','null').trim() !== "null") {
            set(updatedGame,'competitors.1.record',game.homeRecord);
        }

        if (get(game,'homeSpread','null').trim() !== "null" ) {
            const spread = {
              teamId: get(gameFound,'competitors.1._id'),
              amount: get(game,'homeSpread'),
              spreadDateTime: moment().toISOString()
            };
            set(updatedGame,'spread',spread);
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

        if (get(game,'gameTime','null') !== "null") {
            const newYork = moment.tz(game.gameTime, "America/New_York");
            set(updatedGame,'startDateTime', newYork.format());
        }

        if (get(game,'liveVideoUrl','null').trim() !== "null") {
            set(updatedGame,'liveVideoUrl',game.liveVideoUrl);
        }

        if (get(game,'highlightVideoUrl','null').trim() !== "null") {
            set(updatedGame,'highlightVideoUrl',game.highlightVideoUrl);
        }

        if (get(game,'isHidden','null') !== "null") {
            set(updatedGame,'isHidden',game.isHidden);
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