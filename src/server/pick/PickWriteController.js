const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

let router = express.Router();

const pickDomain = require('./PickDomain');

const ids = [
    'google-oauth2|106585827534408667194',
    'google-oauth2|102013494920578024535'
];

router.post('/picks/', function (req, res) {
    if (ids.includes(req.auth.sub)) {
        return res.status(200).send({});
    }

    const pick = {
        userId: req.auth.sub,
        gameId: new mongoose.Types.ObjectId(req.body.gameId),
        pickId: new mongoose.Types.ObjectId(req.body.pickId),
        gameType: req.body.gameType,
        createDateTime: moment().toISOString()
    };

    pickDomain.upsert(pick, (error, pickCreated) => {
        if (error) return res.status(500).json("There was a problem adding picking: " + error.message);
        return res.status(200).send({...pick,_id:pickCreated._id});
    });
});

router.put('/picks/:id', function (req, res) {
    if (ids.includes(req.auth.sub)) {
        return res.status(200).send({});
    }

    const pick = {
        userId: req.auth.sub,
        gameId: new mongoose.Types.ObjectId(req.body.gameId),
        pickId: new mongoose.Types.ObjectId(req.body.pickId),
        gameType: req.body.gameType,
        createDateTime: moment().toISOString()
    };

    pickDomain.upsert(pick, (error, updatedPick) => {
        if (error) return res.status(500).send("There was a problem updating pick: " + error.message);
        return res.status(200).send({...pick,_id:updatedPick._id});
    });
});

module.exports = router;