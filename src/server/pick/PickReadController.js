const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

let router = express.Router();

const pickRepository = require('./PickRepository');
const gameRepository = require('../game/GameRepository');

const omit = require('lodash/omit');
const get = require('lodash/get');

router.get('/picks/', async function (req, res) {
    const gameType = req.query.gameType;

    const search = {
        leagueId: mongoose.Types.ObjectId(req.query.leagueId),
        userId: req.query.userId,
        year: req.query.year,
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
        leagueId: mongoose.Types.ObjectId(mongoose.Types.ObjectId(req.query.leagueId)),
        year: req.query.year,
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

    const games = await gameRepository.find(thisRangeSearch,{},{});

    // console.log(`******* games: ${games}`);

    pickRepository.find(finalSearch, function (err, picks) {
        if (err) return res.status(500).send("There was a problem finding the picks.");
        games.forEach((game)=>{
            const mvyHomeTeamPlayerPick = {
                userId: 2,
                gameId: game._id,
                pickId: game.competitors[1]._id,
                leagueId: game.leagueId
            };
            picks = [...picks, mvyHomeTeamPlayerPick];
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