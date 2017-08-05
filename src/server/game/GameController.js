var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));

var gameRepository = require('./GameRepository');

router.get('/games/', function (req, res) {
    console.log("req.query.startDateTime2:" + req.query.startDateTime);
    console.log("req.query.endDateTime2:" + req.query.endDateTime);

	const search = {
		leagueId: mongoose.Types.ObjectId(req.query.leagueId),
        startDateTime: {
            '$gt': new Date(req.query.startDateTime).toISOString(),
            '$lt': new Date(req.query.endDateTime).toISOString()
        }
	};

    gameRepository.find(search, function (err, games) {
        if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
        res.status(200).send(games);
    });
});

module.exports = router;