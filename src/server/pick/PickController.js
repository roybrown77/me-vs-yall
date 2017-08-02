var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));

var pickRepository = require('./PickRepository');

router.post('/', function (req, res) {
   const pick = {
        userId: req.user.sub,
        leagueId: mongoose.Types.ObjectId(req.body.leagueId),
        gameId: mongoose.Types.ObjectId(req.body.gameId),
        pickId: mongoose.Types.ObjectId(req.body.pickId),
        createDateTime: new Date(new Date().toUTCString()).toISOString()
    };

    pickRepository.create(pick, function (err, pickCreated) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(pickCreated);
        });
});

router.get('/', function (req, res) {
    const search = {
        userId: req.user.sub,
        leagueId: mongoose.Types.ObjectId(req.query.leagueId)
    };

    pickRepository.find(search, function (err, picks) {
        if (err) return res.status(500).send("There was a problem finding the picks.");
        res.status(200).send(picks);
    });
});

router.get('/:id', function (req, res) {
    pickRepository.findById(req.params.id, function (err, pick) {
        if (err) return res.status(500).send("There was a problem finding the pick.");
        if (!pick) return res.status(404).send("No pick found.");
        res.status(200).send(pick);
    });
});

router.delete('/:id', function (req, res) {
    const pick = {
        deleted: true
    };
    pickRepository.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), pick, {new: true}, function (err, pick) {
        if (err) return res.status(500).send("There was a problem deleting the pick.");
        res.status(200).send(pick);
    });
});

router.put('/:id', function (req, res) {
    const pick = {
        pickId: mongoose.Types.ObjectId(req.body.pickId)
    };
    pickRepository.findByIdAndUpdate(req.params.id, pick, {new: true}, function (err, pick) {
        if (err) return res.status(500).send("There was a problem updating the pick.");
        res.status(200).send(pick);
    });
});

module.exports = router;