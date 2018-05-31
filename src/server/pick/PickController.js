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

    pickDomain.createPick(pick, function (err, pickCreated) {
        if (err) {
            return res.status(500).json("There was a problem adding the information to the database: " + err.message);
        }  
        
        res.status(200).send(pickCreated);
    });
});

router.put('/picks/:id', function (req, res) {
    const pick = {
        gameId: mongoose.Types.ObjectId(req.body.gameId),
        pickId: mongoose.Types.ObjectId(req.body.pickId),
        createDateTime: new Date(new Date().toUTCString()).toISOString()
    };
    pickDomain.updatePick(req.params.id, pick, function (err, pick) {
        if (err) return res.status(500).send("There was a problem updating the information to the database: " + err.message);
        res.status(200).send(pick);
    });
});

router.get('/picks/', function (req, res) {
    const search = {
        leagueId: mongoose.Types.ObjectId(req.query.leagueId),
        userId: req.query.userId,
        weekNo: req.query.weekNo,
        seasonType: req.query.seasonType
    };
        
    const finalSearch = omit(search, [get(req,'query.userId','userId'), get(req,'query.weekNo','seasonType'), get(req,'query.seasonType','seasonType')]);

    pickRepository.find(finalSearch, function (err, picks) {
        if (err) return res.status(500).send("There was a problem finding the picks.");
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

router.delete('/picks/:id', function (req, res) {
    const pick = {
        deleted: true
    };
    pickRepository.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), pick, {new: true}, function (err, pick) {
        if (err) return res.status(500).send("There was a problem deleting the pick.");
        res.status(200).send(pick);
    });
});

module.exports = router;