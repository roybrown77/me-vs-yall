const moment = require('moment-timezone');

const pickRepository = require('./PickRepository');
const gameRepository = require('../game/databaseRepositories/GameRepository');

const get = require('lodash/get');

const upsert = async (pick, cb) => {
    try {
        const game = await gameRepository.findById(pick.gameId);
        if (!isValid(game, pick)) {
            return cb(new Error('Invalid pick'));
        }
        const finalPick = { 
            ...pick,
            leagueId: get(game,'leagueId'),
            year: get(game,'year')
        }

        const result = await pickRepository.findOneAndUpdate(
            {
                userId: pick.userId,
                gameId: pick.gameId,
                gameType: pick.gameType === "1" ? 1 : { $ne: 1 },
            },
            finalPick,
            {
                new: true, // Return the updated document
                upsert: true // Create a new document if no match is found
            }
        );
        return cb(null, result); // Return the updated or newly created document
    } catch (error) {
        console.log('Upserting pick error: ', error);
        return cb(new Error('Invalid pick'));
    }
};

const isValid = (game, pick) => {
    if (!get(pick,'gameId')) {
        console.log('Game id is required');
        return false;
    }

    if (!get(pick,'pickId')) {
        console.log('Pick id is required');
        return false;
    }

    if (game.isGameOver) {
        console.log(`Game ${get(pick,'gameId')} is over`);
        return false;
    }

	const started = hasGameStarted(game.startDateTime, pick.createDateTime);

	if (started) {
        console.log(`Game ${get(pick,'gameId')} already started`);
		return false;
	}

	return true;
};

const hasGameStarted = (gameDateTime, pickDateTime) =>{
    const gameStartDateTime = moment(new Date(gameDateTime));
    const currentDateTime = moment(pickDateTime);
    const difference = gameStartDateTime.diff(currentDateTime,'seconds');
    return difference < 0;
};

const domain = { upsert };

module.exports = domain;