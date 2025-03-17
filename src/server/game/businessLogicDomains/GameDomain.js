const moment = require('moment-timezone');

const gameRepository = require('../databaseRepositories/GameRepository');

const set = require('lodash/set');

const update = async (game, cb) => {
    console.log(`game user: ${game.userId}`);

    try {
        const gameFound = await gameRepository.findById(game.id);

        if (!isValid(game)) {
            return cb(new Error('Invalid Game'));
        }

        const updatedGame = {
          id: game.id,
          competitors: gameFound.competitors,
          gameName: gameFound.gameName,
          isGameOver: gameFound.isGameOver
        };

        if (game?.awayScore) {
            set(updatedGame,'competitors.0.score',parseInt(game.awayScore));
        }

        if (game?.awayRank) {
            set(updatedGame,'competitors.0.rank',game.awayRank);
        }

        if (game?.awayRecord) {
            set(updatedGame,'competitors.0.record',game.awayRecord);
        }

        if (game?.awaySpread) {
            const spread = {
              teamId: gameFound.competitors[0]._id,
              amount: game.awaySpread,
              spreadDateTime: moment().toISOString()
            };
            set(updatedGame,'spread',spread);
        }

        if (game?.homeScore) {
            set(updatedGame,'competitors.1.score',parseInt(game.homeScore));
        }

        if (game?.homeRank) {
            set(updatedGame,'competitors.1.rank',game.homeRank);
        }

        if (game?.homeRecord) {
            set(updatedGame,'competitors.1.record',game.homeRecord);
        }

        if (game?.homeSpread) {
            const spread = {
              teamId: gameFound.competitors[1]._id,
              amount: game.homeSpread,
              spreadDateTime: moment().toISOString()
            };
            set(updatedGame,'spread',spread);
        }

        if (game?.gameName) {
            set(updatedGame,'gameName',game.gameName);
        }

        if (game?.isGameOver) {
            set(updatedGame,'isGameOver',game.isGameOver);
        }

        if (game?.currentTime) {
            set(updatedGame,'currentTime',game.currentTime);
        }

        if (game?.gameTime) {
            const newYork = moment.tz(game.gameTime, "America/New_York");
            set(updatedGame,'startDateTime', newYork.format());
        }

        if (game?.liveVideoUrl) {
            set(updatedGame,'liveVideoUrl',game.liveVideoUrl);
        }

        if (game?.highlightVideoUrl) {
            set(updatedGame,'highlightVideoUrl',game.highlightVideoUrl);
        }

        if (game?.isHidden) {
            set(updatedGame,'isHidden',game.isHidden);
        }

        console.log(`game updated: ${JSON.stringify(updatedGame)}`);

        const gameUpdated = await gameRepository.findOneAndUpdate(
            { _id: updatedGame.id }, // Query filter
            updatedGame,             // Update object
            { new: true }            // Options: return the updated document
        );
        return cb(null, gameUpdated); // Return the updated game
    } catch (error) {
        console.log('Updating game error: ', error);
        return cb(new Error('Invalid Game'));
    }
};

const isValid = (game) => {
    if (!game?.id) {
        console.log('Game id is required');
        return false;
    }

    if (game?.userId !== 'google-oauth2|114172296334563495985') {
        console.log('User is required');
        return false;
    }

	return true;
};

const domain = { update };

module.exports = domain;