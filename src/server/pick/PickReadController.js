const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const omit = require('lodash/omit');
const get = require('lodash/get');

const pickRepository = require('./PickRepository');
const gameRepository = require('../game/GameRepository');
const { getAllTeamStats, getGameStats } = require('../utilities');

let router = express.Router();

router.get('/picks/', async function (req, res) {
    const gameType = req.query.gameType;
    const leagueId = get(req, 'query.leagueId');
    const year = get(req, 'query.year');

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
        gamesThisRange.forEach((game)=>{
            const mvyHomePicks = {
                _id: mongoose.Types.ObjectId().toString(),
                userId: 2,
                gameId: game._id,
                pickId: game.competitors[1]._id,
                leagueId: game.leagueId
            };
            
            let mvyDefensePicks = {};
            let mvyRoadHomePicks = {};
            let mvyOffensePicks = {}

            try {
                const gameStats = getGameStats(game, teamStats);

                const roadPointsAllowed = gameStats.find(x=>x.name === 'Road Pnts Allwd Avg');
                const homePointsAllowed = gameStats.find(x=>x.name === 'Home Pnts Allwd Avg');

                const roadPointsScored = gameStats.find(x=>x.name === 'Road Pnts Scrd Avg');
                const homePointsScored = gameStats.find(x=>x.name === 'Home Pnts Scrd Avg');

                mvyOffensePicks = {
                    _id: mongoose.Types.ObjectId().toString(),
                    userId: 3,
                    gameId: game._id,
                    pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                    : roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id,
                    leagueId: game.leagueId,
                    leagueId: game.leagueId
                };

                mvyDefensePicks = {
                    _id: mongoose.Types.ObjectId().toString(),
                    userId: 4,
                    gameId: game._id,
                    pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value < 0 ? game.competitors[0]._id : game.competitors[1]._id)
                    : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 ? game.competitors[0]._id : game.competitors[1]._id,
                    leagueId: game.leagueId
                };

                mvyRoadHomePicks = {
                    _id: mongoose.Types.ObjectId().toString(),
                    userId: 5,
                    gameId: game._id,
                    pickId: (game.gameName || '').startsWith('Super Bowl') ? (roadPointsAllowed.awayTeam.value - roadPointsAllowed.homeTeam.value > 1 && roadPointsScored.awayTeam.value - roadPointsScored.homeTeam.value > 0 ? game.competitors[0]._id : game.competitors[1]._id)
                    : roadPointsAllowed.awayTeam.value - homePointsAllowed.homeTeam.value < 0 && roadPointsScored.awayTeam.value - homePointsScored.homeTeam.value > 0
                    ? game.competitors[0]._id : game.competitors[1]._id,
                    leagueId: game.leagueId
                };
            } catch (error) {
                console.log("PickReadController user picks error", error);
            }

            picks = [...picks, mvyHomePicks, mvyOffensePicks, mvyDefensePicks, mvyRoadHomePicks];
        });
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