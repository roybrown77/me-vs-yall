const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

let router = express.Router();

const gameDomain = require('./GameDomain');
const gameRepository = require('./GameRepository');

const omit = require('lodash/omit');
const get = require('lodash/get');

router.put('/games/:id', function (req, res) {
    const game = {
        id: mongoose.Types.ObjectId(req.body.id),
        userId: req.user.sub,
        awayScore: req.body.awayScore,
        homeScore: req.body.homeScore,
        awayRecord: req.body.awayRecord,
        homeRecord: req.body.homeRecord,
        awayRank: req.body.awayRank,
        homeRank: req.body.homeRank,
        awaySpread: req.body.awaySpread,
        homeSpread: req.body.homeSpread,
        gameName: req.body.gameName,
        isGameOver: req.body.isGameOver,
        currentTime: req.body.currentTime,
        gameTime: req.body.gameTime,
        liveVideoUrl: req.body.liveVideoUrl,
        highlightVideoUrl: req.body.highlightVideoUrl,
        isHidden: req.body.isHidden
    };

    gameDomain.update(game, (err, gameCreated) => {
        if (err) return res.status(500).send("There was a problem updating the information to the database: " + err.message);
        return res.status(200).send({...game,_id:gameCreated._id});
    });
});

module.exports = router;