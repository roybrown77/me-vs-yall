const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');
const sortBy = require('lodash/sortBy');

const pickRepository = require('./PickRepository');
const gameRepository = require('../game/databaseRepositories/GameRepository');
const { getAllTeamStats, getGameStats } = require('../utilities/gameStats');

let router = express.Router();

const getPickStrategies = async (req) => {
    const leagueId = req.query?.leagueId;
    const year = req.query?.year;
    const includeStrategies = req.query?.includeStrategies === 'true';
  
    let picks = [];
  
    if (includeStrategies && leagueId === '59723313734d1d6202a85f10') {
        console.log('include strategies');
    
        const gameSearch = {
            leagueId: new mongoose.Types.ObjectId(leagueId),
            year: year,
            startDateTime:
            req.query?.beginDateTime && req.query?.endDateTime
                ? {
                    $gt: new Date(moment(req.query?.beginDateTime)),
                    $lt: new Date(moment(req.query?.endDateTime)),
                }
                : undefined,
            isHidden: { $ne: true },
        };
    
        const thisRangeSearch = omit(gameSearch, [
            req.query?.year ?? 'year',
            !req.query?.beginDateTime || req.query?.beginDateTime === '-1'
            ? 'startDateTime'
            : undefined,
        ]);
    
        const wholeYearSearch = {
            leagueId: new mongoose.Types.ObjectId(leagueId),
            year: year,
            startDateTime: {
            $gt: new Date(moment(year + '0901')),
            $lt: new Date(
                req.query?.endDateTime
                ? moment(req.query?.endDateTime).add('-6', 'days')
                : moment()
            ),
            },
            isGameOver: true,
        };
    
        const fields = {
            leagueId: 1,
            isGameOver: 1,
            competitors: 1,
            year: 1,
            spread: 1,
            startDateTime: 1,
            hashCompetitors: 1,
            currentTime: 1,
        };
    
        const [gamesThisRange, gamesWholeYear] = await Promise.all([
            gameRepository.find(thisRangeSearch, fields).exec(),
            gameRepository.find(wholeYearSearch, fields).exec(),
        ]);
    
        const sortedGamesThisRange = sortBy(gamesThisRange, ['startDateTime']);
        const sortedGamesWholeYear = sortBy(gamesWholeYear, ['startDateTime']);
    
        const pickPromises = sortedGamesThisRange.map(async (game) => {
            const sortedGamesWholeYearUpUntilGameDateTime = sortedGamesWholeYear.filter(
                (x) => x.startDateTime < game.startDateTime
            );

            const teamStats = getAllTeamStats(sortedGamesWholeYearUpUntilGameDateTime);
    
            let mvyPicks = {};
    
            try {
                const currentYear = 2025;
                const endOfCurrentWeek1 = '2025-09-08';
                
                const daysSinceEndOfWeek1 = moment().diff(moment(endOfCurrentWeek1), 'days');
                const isReadyForTheKings = year < currentYear || daysSinceEndOfWeek1 > (6*7 + 2); // End of week 1 plus 6 more weeks + 2 is start of Week 8

                let mvyHomePicks = {};
                let mvyDefensePicks = {};
                let mvyOffensePicks = {};
                let mvyDoomPicks = {};
                let mvyThanosPicks = {}
                let mvyMagnetoPicks = {};
                let mvyKangPicks = {};
                let mvyRoguePicks = {};
                let mvyStormPicks = {};
                const isSuperBowlGame = 
                game.startDateTime.getMonth() === 1

                if (!isSuperBowlGame) {
                    mvyHomePicks = {
                        _id: new mongoose.Types.ObjectId().toString(),
                        userId: 2, // King Homer
                        gameId: game._id,
                        pickId: game.competitors[1]._id,
                        leagueId: game.leagueId,
                    };
                }

                // if (isReadyForTheKings) {
                    try {
                        const gameStats = getGameStats(game, teamStats);

                        const roadPointsAllowed = gameStats.find(x=>x.name === 'Road Pnts Allwd Avg');
                        const homePointsAllowed = gameStats.find(x=>x.name === 'Home Pnts Allwd Avg');

                        const roadPointsScored = gameStats.find(x=>x.name === 'Road Pnts Scrd Avg');
                        const homePointsScored = gameStats.find(x=>x.name === 'Home Pnts Scrd Avg');

                        mvyOffensePicks = {
                            _id: new mongoose.Types.ObjectId().toString(),
                            userId: 3, // King Offense; Points Scored
                            gameId: game._id,
                            pickId: isSuperBowlGame ? (roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                            : roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0
                            ? game.competitors[0]._id : game.competitors[1]._id,
                            leagueId: game.leagueId
                        };

                        mvyDefensePicks = {
                            _id: new mongoose.Types.ObjectId().toString(),
                            userId: 4, // King Defense; Points Allowed
                            gameId: game._id,
                            pickId: isSuperBowlGame ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 0 ? game.competitors[0]._id : game.competitors[1]._id)
                            : roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 ? game.competitors[0]._id : game.competitors[1]._id,
                            leagueId: game.leagueId
                        };

                        mvyDoomPicks = {
                            _id: new mongoose.Types.ObjectId().toString(),
                            userId: 5, // King Doom; Road if Points Scored & Allowed are better otherwise Home
                            gameId: game._id,
                            pickId: isSuperBowlGame ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 0 && roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                            : roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 && roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0
                            ? game.competitors[0]._id : game.competitors[1]._id,
                            leagueId: game.leagueId
                        };

                        if ((homePointsScored?.homeTeam?.value - roadPointsScored?.awayTeam?.value > 0) && !isSuperBowlGame) {
                            mvyRoguePicks = {
                                _id: new mongoose.Types.ObjectId().toString(),
                                userId: 18, // Queen Rogue; Home if Points Scored is better
                                gameId: game._id,
                                pickId: game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }

                        if ((roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0) && !isSuperBowlGame) {
                            mvyStormPicks = {
                                _id: new mongoose.Types.ObjectId().toString(),
                                userId: 19, // Queen Storm; Home if Road Points Scored is better
                                gameId: game._id,
                                pickId: game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }

                        if ((roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 && roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0) ||
                        (isSuperBowlGame && (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 0 && roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0))) {
                            mvyThanosPicks = {
                                _id: new mongoose.Types.ObjectId().toString(),
                                userId: 17, // King Thanos; Road Only if Points Allowed & Scored are better
                                gameId: game._id,
                                pickId: game.competitors[0]._id,
                                leagueId: game.leagueId
                            };
                        }

                        if ((roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase()) ||
                            (!(homePointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 0) && game.spread?.teamId === game.competitors[0]._id.toString().toLowerCase()) ||
                            (isSuperBowlGame && roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase()) ||
                            (isSuperBowlGame && roadPointsAllowed?.homeTeam?.value - roadPointsAllowed?.awayTeam?.value < 0 && game.spread?.teamId === game.competitors[0]._id.toString().toLowerCase())) {
                                mvyMagnetoPicks = {
                                _id: new mongoose.Types.ObjectId().toString(),
                                userId: 15, // King Magneto; Dogs if Points Allowed is better
                                gameId: game._id,
                                pickId: isSuperBowlGame ? (roadPointsAllowed?.awayTeam?.value - roadPointsAllowed?.homeTeam?.value < 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase() ? 
                                    game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsAllowed?.awayTeam?.value - homePointsAllowed?.homeTeam?.value < 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase() ? 
                                game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }

                        if ((roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase()) ||
                            (!(homePointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0) && game.spread?.teamId === game.competitors[0]._id.toString().toLowerCase()) ||
                            (isSuperBowlGame && (roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0) && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase()) ||
                            (isSuperBowlGame && (roadPointsScored?.homeTeam?.value - roadPointsScored?.awayTeam?.value > 0) && game.spread?.teamId === game.competitors[0]._id.toString().toLowerCase())) {
                            mvyKangPicks = {
                                _id: new mongoose.Types.ObjectId().toString(),
                                userId: 12, // King Kang; Dogs if Points Scored is better
                                gameId: game._id,
                                pickId: isSuperBowlGame ? (roadPointsScored?.awayTeam?.value - roadPointsScored?.homeTeam?.value > 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase()? 
                                    game.competitors[0]._id : game.competitors[1]._id)
                                : roadPointsScored?.awayTeam?.value - homePointsScored?.homeTeam?.value > 0 && game.spread?.teamId === game.competitors[1]._id.toString().toLowerCase() ? 
                                game.competitors[0]._id : game.competitors[1]._id,
                                leagueId: game.leagueId
                            };
                        }
                    } catch (error) {
                        console.log("generate King picks error 1: ", error);
                    }
                // }
    
                mvyPicks = [mvyHomePicks, mvyOffensePicks, mvyDefensePicks, mvyDoomPicks, mvyThanosPicks, mvyMagnetoPicks, mvyKangPicks, mvyRoguePicks, mvyStormPicks];
            } catch (error) {
                console.log('generate King picks error 2: ', error);
            }
    
            return mvyPicks;
        });
  
        const allPicks = await Promise.all(pickPromises);
  
        picks = allPicks.flat();
    }
  
    return picks;
};

const getPicks = async (req) => {
    const gameType = req.query?.gameType;
    const leagueId = req.query?.leagueId;
    const year = req.query?.year;
    
    const search = {
        leagueId: new mongoose.Types.ObjectId(leagueId),
        userId: req.query?.userId,
        year: year,
        gameType: gameType === "1" ? 1 : { $ne: 1 },
        createDateTime: {
          $gte: new Date(moment(req.query?.beginDateTime)),
          $lte: new Date(moment(req.query?.endDateTime))
        }
      };
        
    const finalSearch = omit(search, 
        [
            req.query?.userId ?? 'userId', 
            !(req.query?.beginDateTime && req.query?.endDateTime) || req.query?.beginDateTime === '-1' ? 'createDateTime' : undefined
        ]
    );

    return await pickRepository.find(finalSearch);
};

router.get('/picks/', async function (req, res) {
    try {
        const [ picks, picksWithStrategies ] = await Promise.all([
            getPicks(req),
            getPickStrategies(req)
        ]);

        res.status(200).send([...picks, ...picksWithStrategies]);
    } catch (error) {
        console.log("Get picks error: ", error);
        return res.status(500).send("There was a problem fetching picks");
    }
});

router.get('/picks/:id', async function (req, res) {
    try {
        const pick = await pickRepository.findById(req.params.id);
        if (!pick) return res.status(404).send("No pick found");
        res.status(200).send(pick);
    } catch (error) {
        console.log("Get pick error: ", error);
        return res.status(500).send("There was a problem fetching pick");
    }
});

module.exports = router;
