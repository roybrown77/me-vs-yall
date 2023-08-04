const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');
const get = require('lodash/get');
const sortBy = require('lodash/sortBy');

const pickRepository = require('./PickRepository');
const gameRepository = require('../game/databaseRepositories/GameRepository');
const { getAllTeamStats, getGameStats } = require('../utilities/gameStats');

let router = express.Router();

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

router.get('/picks/', async function (req, res) {
    const gameType = req.query.gameType;
    const leagueId = get(req, 'query.leagueId');
    const year = get(req, 'query.year');
    const includeStrategies = get(req,'query.includeStrategies') === 'true';

    const search = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        userId: req.query.userId,
        year: year,
        gameType: gameType === "1" ? 1 : { $ne: 1 },
        createDateTime: {
          $gte: new Date(moment(get(req, 'query.beginDateTime'))),
          $lte: new Date(moment(get(req, 'query.endDateTime')))
        }
      };
        
    const finalSearch = omit(search, 
        [
            get(req,'query.userId','userId'), 
            !(get(req, 'query.beginDateTime') && get(req, 'query.endDateTime')) || get(req,'query.beginDateTime') === '-1' ? 'createDateTime' : undefined
        ]
    );

    const gameSearch = {
        leagueId: mongoose.Types.ObjectId(mongoose.Types.ObjectId(leagueId)),
        year: year,
        startDateTime: get(req, 'query.beginDateTime') && get(req, 'query.endDateTime') ? {
          $gt: new Date(moment(get(req, 'query.beginDateTime'))),
          $lt: new Date(moment(get(req, 'query.endDateTime')))
        } : undefined,
        isHidden: {
          $ne: true
        }
    };
  
    const thisRangeSearch = omit(gameSearch, 
    [
        get(req,'query.year','year'),
        !get(req,'query.beginDateTime') || get(req,'query.beginDateTime') === '-1' ? 'startDateTime' : undefined, 
    ]
    );

    const wholeYearSearch = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: year,
        startDateTime: {
            $gt: new Date(moment(year + '0901')),
            $lt: new Date(get(req, 'query.endDateTime') ? moment(get(req, 'query.endDateTime')).add('-7','days') : moment())
        },
        isGameOver: true
    };

    const [gamesThisRange, gamesWholeYear] = await Promise.all([
        gameRepository.find(thisRangeSearch, {}, {}), 
        gameRepository.find(wholeYearSearch, {}, {}), 
    ]);

    const sortedGamesThisRange = sortBy(gamesThisRange, ['startDateTime']);
    const sortedGamesWholeYear = sortBy(gamesWholeYear, ['startDateTime']);

    pickRepository.find(finalSearch, function (err, picks) {
        if (err) return res.status(500).send("There was a problem finding the picks.");

        if (includeStrategies) {
            sortedGamesThisRange.forEach((game, index) => {
                const sortedGamesWholeYearUpUntilGameDateTime = sortedGamesWholeYear.filter(x => x.startDateTime < game.startDateTime);
                const teamStats = getAllTeamStats(sortedGamesWholeYearUpUntilGameDateTime);

                console.log('sortedGamesWholeYearUpUntilGameDateTime', sortedGamesWholeYearUpUntilGameDateTime.length);

                const mvyHomePicks = {
                    _id: mongoose.Types.ObjectId().toString(),
                    userId: 2, // King Homer
                    gameId: game._id,
                    pickId: game.competitors[1]._id,
                    leagueId: game.leagueId
                };
                
                let mvyDefensePicks = {};
                let mvyRoadHomePicks = {};
                let mvyOffensePicks = {};
                let mvyDayPicks = {};
                let mvyMultiVegasPicks = {};

                try {
                    const gameStats = getGameStats(game, teamStats);

                    const roadPointsAllowed = gameStats.find(x=>x.name === 'Road Pnts Allwd Avg');
                    const homePointsAllowed = gameStats.find(x=>x.name === 'Home Pnts Allwd Avg');

                    const roadPointsScored = gameStats.find(x=>x.name === 'Road Pnts Scrd Avg');
                    const homePointsScored = gameStats.find(x=>x.name === 'Home Pnts Scrd Avg');

                    if ((sortedGamesThisRange.length > 112 && index > 112) || sortedGamesThisRange.length <= 48) {
                        // const randomValue = getRandomIntInclusive(1,10);

                        // console.log('randomValue', randomValue);

                        // if (randomValue === 7) {
                            mvyOffensePicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 3, // King Offense
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId,
                                leagueId: game.leagueId
                            };

                            mvyDefensePicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 4, // King Defense
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        
                            mvyRoadHomePicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 5, // King Road vs Homer
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                                ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };

                            const date = new Date(game.startDateTime);
                            date.setMinutes(date.getMinutes() - 300);
                            const weekday = date.getDay();
            
                            if (weekday === 1 || weekday === 4 || weekday === 6) {
                                mvyDayPicks = {
                                    _id: mongoose.Types.ObjectId().toString(),
                                    userId: weekday === 1 ? 7 : weekday === 4 ? 8 : 9, // King Monday, Thursday, Saturday
                                    gameId: game._id,
                                    pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                    : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                                    ? game.competitors[0]._id : game.competitors[1]._id,
                                    leagueId: game.leagueId
                                };
                            }

                            mvyDayPicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 10, // King Don Do it Shark
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : (roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0)
                                ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };

                            if (weekday === 0) {
                                mvyDayPicks = {
                                    _id: mongoose.Types.ObjectId().toString(),
                                    userId: 11, // King Sunday
                                    gameId: game._id,
                                    pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                    : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                                    ? game.competitors[0]._id : game.competitors[1]._id,
                                    leagueId: game.leagueId
                                };
                            }

                            if (((roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 && game.spread.teamId === game.competitors[1]._id.toString().toLowerCase()) ||
                                (!(roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0) && game.spread.teamId === game.competitors[0]._id.toString().toLowerCase()))) {
                                mvyOffensePicks = {
                                    _id: mongoose.Types.ObjectId().toString(),
                                    userId: 12, // Kang Multivegas
                                    gameId: game._id,
                                    pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? 
                                        game.competitors[0]._id : game.competitors[1]._id)
                                    : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 && game.spread.teamId === game.competitors[1]._id.toString().toLowerCase() ? 
                                    game.competitors[0]._id : game.competitors[1]._id,
                                    leagueId: game.leagueId,
                                    leagueId: game.leagueId
                                };
                            }
                        // }
                    }
                } catch (error) {
                    console.log("PickReadController user picks error", error);
                }

                picks = [...picks, mvyHomePicks, mvyOffensePicks, mvyDefensePicks, mvyRoadHomePicks, mvyDayPicks, mvyMultiVegasPicks];
            });
        }

        res.status(200).send(picks);
    });
});

router.get('/picks/:id', function (req, res) {
    pickRepository.findById(req.params.id, function (err, pick) {
        if (err) return res.status(500).send("There was a problem finding the pick.: " + err.message);
        if (!pick) return res.status(404).send("No pick found.");
        res.status(200).send(pick);
    });
});

module.exports = router;