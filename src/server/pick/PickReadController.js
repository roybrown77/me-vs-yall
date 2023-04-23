const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');
const get = require('lodash/get');

const pickRepository = require('./PickRepository');
const gameRepository = require('../game/databaseRepositories/GameRepository');
const { getAllTeamStats, getGameStats } = require('../utilities/gameStats');

let router = express.Router();

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

    const wholeYearFields = { 
        leagueId: 1, 
        isGameOver: 1, 
        competitors: 1, 
        year: 1, 
        spread: 1, 
        startDateTime: 1, 
        hashCompetitors: 1, 
        highlights: 1, 
        currentTime: 1
    };

    const [gamesThisRange, gamesWholeYear] = await Promise.all([
        gameRepository.find(thisRangeSearch, {}, {}), 
        gameRepository.find(wholeYearSearch, wholeYearFields, {}), 
    ]);

    const teamStats = getAllTeamStats(gamesWholeYear);

    pickRepository.find(finalSearch, function (err, picks) {
        if (err) return res.status(500).send("There was a problem finding the picks.");

        if (includeStrategies) {
            gamesThisRange.forEach((game, index)=>{
                // playoffs - straight up 69%, spread 46%
                // season - straight up 56%, spread 46%

                const mvyHomePicks = {
                    _id: mongoose.Types.ObjectId().toString(),
                    userId: 2,
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

                    if ((gamesThisRange.length > 112 && index > 112) || gamesThisRange.length <= 48) {
                        // playoffs - straight up ?, spread ?
                        // season - straight up ?, spread ?

                        // mvyOffensePicks = {
                        //     _id: mongoose.Types.ObjectId().toString(),
                        //     userId: 3,
                        //     gameId: game._id,
                        //     pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //     : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id,
                        //     leagueId: game.leagueId,
                        //     leagueId: game.leagueId
                        // };

                        // playoffs - straight up ?, spread ?
                        // season - straight up ?, spread ?
        
                        // mvyDefensePicks = {
                        //     _id: mongoose.Types.ObjectId().toString(),
                        //     userId: 4,
                        //     gameId: game._id,
                        //     pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //     : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 ? game.competitors[0]._id : game.competitors[1]._id,
                        //     leagueId: game.leagueId
                        // };

                        // playoffs - straight up ?, spread ?
                        // season - straight up ?, spread ?
        
                        // mvyRoadHomePicks = {
                        //     _id: mongoose.Types.ObjectId().toString(),
                        //     userId: 5,
                        //     gameId: game._id,
                        //     pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //     : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                        //     ? game.competitors[0]._id : game.competitors[1]._id,
                        //     leagueId: game.leagueId
                        // };

                        // playoffs - straight up 76%, spread 53%
                        // season - straight up 74%, spread 61%

                        // if ((game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        // : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0) {
                            mvyOffensePicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 3,
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId,
                                leagueId: game.leagueId
                            };
                        // }

                        // playoffs - straight up 92%, spread 69%
                        // season - straight up 62%, spread 50%

                        // if ((game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 ? game.competitors[0]._id : game.competitors[1]._id)
                        // : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0) {
                            mvyDefensePicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 4,
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        // }

                        // playoffs - straight up 84%, spread 61%
                        // season - straight up 69%, spread 57%

                        mvyRoadHomePicks = {
                            _id: mongoose.Types.ObjectId().toString(),
                            userId: 5,
                            gameId: game._id,
                            pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                            : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                            ? game.competitors[0]._id : game.competitors[1]._id,
                            leagueId: game.leagueId
                        };

                        const date = new Date(game.startDateTime);
                        date.setMinutes(date.getMinutes() - 300);
                        const weekday = date.getDay();

                        // console.log("weekday", weekday, date, game.startDateTime, new Date().getTimezoneOffset());

                        // Monday
                        // playoffs - straight up 100%, spread 100%
                        // season - straight up 69%, spread 53%

                        // Thursday
                        // playoffs - straight up 0%, spread 0%
                        // season - straight up 76%, spread 69%

                        // Saturday
                        // playoffs - straight up 100%, spread 75%
                        // season - straight up 85%, spread 60%
        
                        if (weekday === 1 || weekday === 4 || weekday === 6) {
                            mvyDayPicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: weekday === 1 ? 7 : weekday === 4 ? 8 : 9,
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                                ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }

                        // Sunday Limit
                        // playoffs - straight up 0%, spread 0%; due to constraints
                        // season - straight up 75%, spread 50%

                        // if (weekday === 0 &&
                        //     index%16 === 0) {
                        //     mvyDayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: 10,
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }

                        // Sunday Limit
                        // playoffs - straight up 0%, spread 0%; due to constraints
                        // season - straight up 83%, spread 83%

                        if (weekday === 0 && 
                            index%10 === 0) {
                            mvyDayPicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 10,
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : (roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0)
                                ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }

                                                // Sunday
                        // playoffs - straight up ?, spread ?
                        // season - straight up ?, spread ?

                        // if (weekday === 0 && 
                        //     roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0) {
                        //     mvyDayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: 11,
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }

                        // Sunday
                        // playoffs - straight up ?, spread ?
                        // season - straight up ?, spread ?

                        // if (weekday === 0 && 
                        //     game.spread.teamId === game.competitors[0]._id.toString().toLowerCase() &&
                        //     roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && 
                        //     roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0) {
                        //     mvyDayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: 11,
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }

                        // Sunday
                        // playoffs - straight up 0%, spread 0%; due to constraints
                        // season - straight up 59%, spread 68%

                        // if (weekday === 0 && 
                        //     game.spread.teamId === game.competitors[0]._id.toString().toLowerCase() &&
                        //     !(roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0)) {
                        //     mvyDayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: 11,
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }

                        // Sunday
                        // playoffs - straight up 75%, spread 50%
                        // season - straight up 66%, spread 56%

                        // if (weekday === 0) {
                        //     mvyDayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: 11,
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }

                        // Sunday
                        // playoffs - straight up 59%, spread 47%
                        // season - straight up 87%, spread 62%

                        // if (weekday === 0) {
                        //     mvyDayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: 11,
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }

                        // Sunday
                        // playoffs - straight up 0%, spread 0%; due to constraints
                        // season - straight up 83%, spread 83%

                        if (weekday === 0) {
                            mvyDayPicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 11,
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 3 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                                ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }

                        // MultiVegas
                        // playoffs - straight up ?, spread ?
                        // season - straight up ?, spread ?
                        // if (weekday === 0 && 
                        //     lastDay === 1 &&
                        //     ((roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0) && game.spread.teamId === game.competitors[0]._id.toString().toLowerCase())) {
                        
                        if (((roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 && game.spread.teamId === game.competitors[1]._id.toString().toLowerCase()) ||
                            (!(roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0) && game.spread.teamId === game.competitors[0]._id.toString().toLowerCase()))) {
                            mvyOffensePicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 12,
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? 
                                    game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 && game.spread.teamId === game.competitors[1]._id.toString().toLowerCase() ? 
                                game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId,
                                leagueId: game.leagueId
                            };
                        }
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