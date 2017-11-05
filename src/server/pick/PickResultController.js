var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));

var pickResultRepository = require('./PickResultRepository');

router.get('/pickResults/', function (req, res) {
  const search = {
    leagueId: mongoose.Types.ObjectId(req.query.leagueId),
    weekNo: req.query.weekNo
  };

  pickResultRepository.find(search, function (err, games) {
      if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
      res.status(200).send(games);
  });
});

router.post('/pickResults', function (req, res) {
  const leaders = [
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "New England Patriots",
//     "weekNo": 6,
//     "startdate": "Thursday, Sept. 7, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
  ]

  for (var i = 0, len = games.length; i < len; i++) {
      let game = games[i];
      
      let competitors = [];

      let awayteam = teamData.find(x=>((x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.awayteam) || x.location + " " + x.name === game.awayteam);

      let awaycompetitor = {
          _id: mongoose.Types.ObjectId(awayteam._id),
          name: awayteam.location + " " + awayteam.name
      };

      competitors.push(awaycompetitor);

      let hometeam = teamData.find(x=>((x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.hometeam) || x.location + " " + x.name === game.hometeam);

      let homecompetitor = {
          _id: mongoose.Types.ObjectId(hometeam._id),
          name: hometeam.location + " " + hometeam.name
      };

      competitors.push(homecompetitor);

      let date = new Date(new Date(game.startdate + " " + game.starttime).toUTCString()).toISOString();
      date = date.split('.')[0] + '+00:00';
      date = new Date(date);

      const formattedGame = {
          startDateTime: date,
          station: game.station,
          leagueId: mongoose.Types.ObjectId("59723313734d1d6202a85f10"),
          weekNo: game.weekNo,
          competitors: competitors
      };

      gameRepository.create(formattedGame, function (err, gameCreated) {
          if (err) {
              console.log("There was a problem adding the information to the database: " + err.message);
          }  
          
          console.log("Success Creating: " + gameCreated._id);
      });
  };

  res.status(200).send({message: "done", code: 200});
});

module.exports = router;