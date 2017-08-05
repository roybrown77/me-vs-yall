var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));

var pickDomain = require('./PickDomain');
var pickRepository = require('./PickRepository');

router.post('/picks/', function (req, res) {
    const pick = {
        userId: req.user.sub,
        leagueId: mongoose.Types.ObjectId(req.body.leagueId),
        weekNo: mongoose.Types.Number(req.user.weekNo),
        gameId: mongoose.Types.ObjectId(req.body.gameId),
        pickId: mongoose.Types.ObjectId(req.body.pickId),
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
    // console.log("req.query.startDateTime1:" + req.query.beginDateTime);
    // console.log("req.query.endDateTime1:" + req.query.endDateTime);

    const search = {
        userId: req.user.sub,
        leagueId: mongoose.Types.ObjectId(req.query.leagueId),
        weekNo: req.query.weekNo
    };
        
    pickRepository.find(search, function (err, picks) {
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