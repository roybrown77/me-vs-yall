const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const pickRepository = require('./PickRepository');

const omit = require('lodash/omit');
const get = require('lodash/get');

router.get('/picks/', function (req, res) {
    const search = {
        leagueId: mongoose.Types.ObjectId(req.query.leagueId),
        userId: req.query.userId,
        weekNo: req.query.weekNo,
        seasonType: req.query.seasonType
    };
        
    const finalSearch = omit(search, 
        [
            get(req,'query.userId','userId'), 
            !get(req,'query.weekNo') || get(req,'query.weekNo') === '-1' ? 'weekNo' : undefined, 
            !get(req,'query.seasonType') || get(req,'query.seasonType') === '-1' ? 'seasonType' : undefined, 
        ]
    );

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

module.exports = router;