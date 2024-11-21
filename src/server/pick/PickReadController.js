const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');
const get = require('lodash/get');
const sortBy = require('lodash/sortBy');

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

    pickRepository.find(finalSearch, async (err, picks) => {
        if (err) return res.status(500).send("There was a problem finding the picks.");

        if (includeStrategies) {
            console.log('include strategies');

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
                    $lt: new Date(get(req, 'query.endDateTime') ? moment(get(req, 'query.endDateTime')).add('-6','days') : moment())
                },
                isGameOver: true
            };
        
            const fields = { 
                leagueId: 1, 
                isGameOver: 1, 
                competitors: 1, 
                year: 1, 
                spread: 1, 
                startDateTime: 1, 
                hashCompetitors: 1, 
                currentTime: 1
              };
        
            const [gamesThisRange, gamesWholeYear] = await Promise.all([
                gameRepository.find(thisRangeSearch, fields, {}), 
                gameRepository.find(wholeYearSearch, fields, {}), 
            ]);
        
            const sortedGamesThisRange = sortBy(gamesThisRange, ['startDateTime']);
            const sortedGamesWholeYear = sortBy(gamesWholeYear, ['startDateTime']);
            
            for(let gameIndex = 0; gameIndex < sortedGamesThisRange.length; gameIndex++) {
                const game = sortedGamesThisRange[gameIndex];
                const sortedGamesWholeYearUpUntilGameDateTime = sortedGamesWholeYear.filter(x => x.startDateTime < game.startDateTime);
                const teamStats = getAllTeamStats(sortedGamesWholeYearUpUntilGameDateTime);

                const mvyHomePicks = {
                    _id: mongoose.Types.ObjectId().toString(),
                    userId: 2, // King Homer
                    gameId: game._id,
                    pickId: game.competitors[1]._id,
                    leagueId: game.leagueId
                };

                // const mvyRoadPicks = {
                //     _id: mongoose.Types.ObjectId().toString(),
                //     userId: 14, // King Roadie
                //     gameId: game._id,
                //     pickId: game.competitors[0]._id,
                //     leagueId: game.leagueId
                // };

                // const mvySharp = {
                //     _id: mongoose.Types.ObjectId().toString(),
                //     userId: 10, // King Sharp; Goes against the spread
                //     gameId: game._id,
                //     pickId: game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase() ? game.competitors[0]._id : game.competitors[1]._id,
                //     leagueId: game.leagueId
                // };
                
                let mvyDefensePicks = {};
                let mvyOffensePicks = {};
                let mvyDoomPicks = {};
                let mvyThanosPicks = {}
                // let mvyDayPicks = {};
                // let mvySundayPicks = {};
                let mvyMagnetoPicks = {};
                let mvyKangPicks = {};

                const endOfCurrentWeek1 = '2024-09-09';
                const currentYear = 2024;

                const daysSinceEndOfWeek1 = moment().diff(moment(endOfCurrentWeek1), 'days');
                const isReadyForTheKings = year < currentYear || daysSinceEndOfWeek1 > (6*7 + 2); // End of week 1 plus 6 more weeks + 2 is start of Week 8

                if (isReadyForTheKings) {
                    try {
                        const gameStats = getGameStats(game, teamStats);
    
                        const roadPointsAllowed = gameStats.find(x=>x.name === 'Road Pnts Allwd Avg');
                        const homePointsAllowed = gameStats.find(x=>x.name === 'Home Pnts Allwd Avg');
    
                        const roadPointsScored = gameStats.find(x=>x.name === 'Road Pnts Scrd Avg');
                        const homePointsScored = gameStats.find(x=>x.name === 'Home Pnts Scrd Avg');
    
                        const date = new Date(game.startDateTime);
                        date.setMinutes(date.getMinutes() - 300);
                        const weekday = date.getDay();
    
                        mvyOffensePicks = {
                            _id: mongoose.Types.ObjectId().toString(),
                            userId: 3, // King Offense; Points Scored
                            gameId: game._id,
                            pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                            : roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0
                            ? game.competitors[0]._id : game.competitors[1]._id,
                            leagueId: game.leagueId
                        };
    
                        mvyDefensePicks = {
                            _id: mongoose.Types.ObjectId().toString(),
                            userId: 4, // King Defense; Points Allowed
                            gameId: game._id,
                            pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 3 ? game.competitors[0]._id : game.competitors[1]._id)
                            : roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 ? game.competitors[0]._id : game.competitors[1]._id,
                            leagueId: game.leagueId
                        };
    
                        mvyDoomPicks = {
                            _id: mongoose.Types.ObjectId().toString(),
                            userId: 5, // King Doom; Points Scored & Allowed
                            gameId: game._id,
                            pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 3 && roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                            : roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 && roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0
                            ? game.competitors[0]._id : game.competitors[1]._id,
                            leagueId: game.leagueId
                        };
    
                        if (((game.gameName || '').startsWith('Super Bowl') && (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 3 && roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0)) ||
                            (roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 && roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0)) {
                            mvyThanosPicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 17, // King Thanos; Points Scored & Allowed, Road Only
                                gameId: game._id,
                                pickId: game.competitors[0]._id,
                                leagueId: game.leagueId
                            };
                        }
        
                        // if (weekday === 1 || weekday === 4 || weekday === 6) {
                        //     mvyDayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: weekday === 1 ? 7 : weekday === 4 ? 8 : 9, // King Monday, Thursday, Saturday; Points Scored & Allowed
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 3 && roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 && roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }
    
                        // if (weekday === 0) {
                        //     mvySundayPicks = {
                        //         _id: mongoose.Types.ObjectId().toString(),
                        //         userId: 11, // King Sunday; Points Scored
                        //         gameId: game._id,
                        //         pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 3 && roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                        //         : roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0
                        //         ? game.competitors[0]._id : game.competitors[1]._id,
                        //         leagueId: game.leagueId
                        //     };
                        // }
    
                        if (weekday === 0 && roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0) {
                            mvyMagnetoPicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 15, // King Magneto; Points Scored, Road only
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 3 && roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0
                                ? game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }
    
                        if (((roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase()) ||
                            (!(roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0) && game.spread?.teamId === game.competitors[0]._id.toString().toLowerCase()))) {
                            mvyKangPicks = {
                                _id: mongoose.Types.ObjectId().toString(),
                                userId: 12, // Kang; Points Scored for Dogs
                                gameId: game._id,
                                pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? 
                                    game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase() ? 
                                game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }
                    } catch (error) {
                        console.log("PickReadController user picks error", error);
                    }
                }

                picks = [...picks, mvyHomePicks, mvyOffensePicks, mvyDefensePicks, mvyDoomPicks, mvyThanosPicks, mvyMagnetoPicks, mvyKangPicks];
            };
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