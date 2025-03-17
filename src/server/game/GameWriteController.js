const express = require('express');
const mongoose = require('mongoose');

let router = express.Router();

const gameDomain = require('./businessLogicDomains/GameDomain');

const omit = require('lodash/omit');
const get = require('lodash/get');

router.put('/games/:id', function (req, res) {
    const game = {
        id: new mongoose.Types.ObjectId(req.body.id).toString(),
        userId: req.auth.sub,
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

    gameDomain.update(game, (error, gameToUpdate) => {
        if (error) {
            console.log("Update Game Error: ", error);
            return res.status(500).send("There was a problem updating game");
        }
        return res.status(200).send({...game, _id: gameToUpdate._id});
    });
});

module.exports = router;