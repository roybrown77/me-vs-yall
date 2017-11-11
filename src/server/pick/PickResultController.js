var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));

var pickResultRepository = require('./PickResultRepository');

router.get('/pickResults/', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year,
    weekNo: req.query.weekNo
  };

  pickResultRepository.find(search, function (err, pickResults) {
      if (err) return res.status(500).send("There was a problem finding the pick results: " + err.message);
      res.status(200).send(pickResults);
  });
});

router.post('/pickResults', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    year: req.query.year,
    weekNo: req.query.weekNo
  };

  console.log('search: ' + JSON.stringify(search));

  pickResultRepository.find(search, function (err, pickResults) {
      if (err) return res.status(500).send("There was a problem finding the pick results: " + err.message);
      res.status(200).send(pickResults);
  });
});

module.exports = router;