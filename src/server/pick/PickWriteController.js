const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

let router = express.Router();

const pickDomain = require('./PickDomain');
const pickRepository = require('./PickRepository');

const omit = require('lodash/omit');
const get = require('lodash/get');

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
        gameId: mongoose.Types.ObjectId(req.body.gameId),
        pickId: mongoose.Types.ObjectId(req.body.pickId),
        gameType: req.body.gameType,
        createDateTime: moment().toISOString()
    };

    pickDomain.upsert(pick, (err, pickCreated) => {
        if (err) return res.status(500).json("There was a problem adding the information to the database: " + err.message);
        return res.status(200).send({...pick,_id:pickCreated._id});
    });
});

router.put('/picks/:id', function (req, res) {
    if (ids.includes(req.auth.sub)) {
        return res.status(200).send({});
    }

    const pick = {
        userId: req.auth.sub,
        gameId: mongoose.Types.ObjectId(req.body.gameId),
        pickId: mongoose.Types.ObjectId(req.body.pickId),
        gameType: req.body.gameType,
        createDateTime: moment().toISOString()
    };

    pickDomain.upsert(pick, (err, updatedPick) => {
        if (err) return res.status(500).send("There was a problem updating the information to the database: " + err.message);
        return res.status(200).send({...pick,_id:updatedPick._id});
    });
});

module.exports = router;