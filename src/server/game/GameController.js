var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

var gameRepository = require('./GameRepository');

router.get('/', function (req, res) {
    gameRepository.find({}, function (err, games) {
        if (err) return res.status(500).send("There was a problem finding the games.");
        res.status(200).send(games);
    });
});

module.exports = router;