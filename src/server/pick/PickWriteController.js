const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const pickDomain = require('./PickDomain');
const pickRepository = require('./PickRepository');

const omit = require('lodash/omit');
const get = require('lodash/get');

router.post('/picks/', function (req, res) {
    const pick = {
        userId: req.body.userId,
        leagueId: mongoose.Types.ObjectId(req.body.leagueId),
        weekNo: req.body.weekNo,
        gameId: mongoose.Types.ObjectId(req.body.gameId),
        pickId: req.body.pickId,
        year: req.body.year,
        seasonType: req.body.seasonType,
        createDateTime: new Date(new Date().toUTCString()).toISOString()
    };

    pickDomain.upsert(pick, (err, pickCreated) => {
        if (err) return res.status(500).json("There was a problem adding the information to the database: " + err.message);
        res.status(200).send(pick);
    });
});

router.put('/picks/:id', function (req, res) {
    const pick = {
        userId: req.body.userId,
        gameId: mongoose.Types.ObjectId(req.body.gameId),
        pickId: mongoose.Types.ObjectId(req.body.pickId),
        createDateTime: new Date(new Date().toUTCString()).toISOString()
    };

    pickDomain.upsert(pick, (err, updatedPick) => {
        if (err) return res.status(500).send("There was a problem updating the information to the database: " + err.message);
        res.status(200).send(pick);
    });
});

router.delete('/picks/:id', function (req, res) {
    // const pick = {
    //     deleted: true
    // };
    // pickRepository.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), pick, {}, function (err, pick) {
    //     if (err) return res.status(500).send("There was a problem deleting the pick.");
    //     res.status(200).send(pick);
    // });
});

module.exports = router;