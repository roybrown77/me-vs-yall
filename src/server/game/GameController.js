var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));

var gameRepository = require('./GameRepository');

router.get('/games/', function (req, res) {
	const search = {
		leagueId: mongoose.Types.ObjectId(req.query.leagueId)
	};

    gameRepository.find(search, function (err, games) {
        if (err) return res.status(500).send("There was a problem finding the games.");
        res.status(200).send(games);
    });
});

module.exports = router;