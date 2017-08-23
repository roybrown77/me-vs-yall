var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

router.use(bodyParser.urlencoded({ extended: true }));

var gameRepository = require('./GameRepository');

router.get('/games/', function (req, res) {
    // console.log("req.query.startDateTime2:" + req.query.beginDateTime);
    // console.log("req.query.endDateTime2:" + req.query.endDateTime);

	const search = {
		leagueId: mongoose.Types.ObjectId(req.query.leagueId),
		weekNo: req.query.weekNo
	};

    gameRepository.find(search, function (err, games) {
        if (err) return res.status(500).send("There was a problem finding the games: " + err.message);
        res.status(200).send(games);
    });
});

router.post('/creategames', function (req, res) {
//     const regularSeasonGames = [
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "New England Patriots",
//     "weekno": 6,
//     "startdate": "Thursday, Sept. 7, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Buffalo Bills",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "Chicago Bears",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Cleveland Browns",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Detroit Lions",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Houston Texans",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Miami Dolphins",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Tennessee Titans",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Washington Redskins",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Green Bay Packers",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 6,
//     "startdate": "Sunday, Sept. 10, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 6,
//     "startdate": "Monday, Sept. 11, 2017",
//     "starttime": "7:10 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Denver Broncos",
//     "weekno": 6,
//     "startdate": "Monday, Sept. 11, 2017",
//     "starttime": "10:20 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 7,
//     "startdate": "Thursday, Sept. 14, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Carolina Panthers",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "New Orleans Saints",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Oakland Raiders",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Denver Broncos",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 7,
//     "startdate": "Sunday, Sept. 17, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "New York Giants",
//     "weekno": 7,
//     "startdate": "Monday, Sept. 18, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 8,
//     "startdate": "Thursday, Sept. 21, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "9:30 a.m.",
//     "station": "TBD"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Buffalo Bills",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Carolina Panthers",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Chicago Bears",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "Detroit Lions",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "New England Patriots",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "New York Jets",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Tennessee Titans",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Green Bay Packers",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Washington Redskins",
//     "weekno": 8,
//     "startdate": "Sunday, Sept. 24, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 8,
//     "startdate": "Monday, Sept. 25, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Green Bay Packers",
//     "weekno": 9,
//     "startdate": "Thursday, Sept. 28, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Miami Dolphins",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "9:30 a.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Cleveland Browns",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Houston Texans",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "New England Patriots",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "New York Jets",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Denver Broncos",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 9,
//     "startdate": "Sunday, Oct. 1, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 9,
//     "startdate": "Monday, Oct. 2, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 10,
//     "startdate": "Thursday, Oct. 5, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Cleveland Browns",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "Detroit Lions",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Miami Dolphins",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "New York Giants",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Oakland Raiders",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Houston Texans",
//     "weekno": 10,
//     "startdate": "Sunday, Oct. 8, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Chicago Bears",
//     "weekno": 10,
//     "startdate": "Monday, Oct. 9, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Carolina Panthers",
//     "weekno": 11,
//     "startdate": "Thursday, Oct. 12, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Houston Texans",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "New Orleans Saints",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "New York Jets",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Washington Redskins",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Oakland Raiders",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Denver Broncos",
//     "weekno": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Tennessee Titans",
//     "weekno": 11,
//     "startdate": "Monday, Oct. 16, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Oakland Raiders",
//     "weekno": 12,
//     "startdate": "Thursday, Oct. 19, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Buffalo Bills",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "Chicago Bears",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Cleveland Browns",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Green Bay Packers",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Miami Dolphins",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "New York Giants",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "New England Patriots",
//     "weekno": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 12,
//     "startdate": "Monday, Oct. 23, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 13,
//     "startdate": "Thursday, Oct. 26, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Cleveland Browns",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "9:30 a.m.",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Buffalo Bills",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "New England Patriots",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "New Orleans Saints",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "New York Jets",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Washington Redskins",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Detroit Lions",
//     "weekno": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 13,
//     "startdate": "Monday, Oct. 30, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "New York Jets",
//     "weekno": 14,
//     "startdate": "Thursday, Nov. 2, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "Carolina Panthers",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Houston Texans",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "New Orleans Saints",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "New York Giants",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Tennessee Titans",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Miami Dolphins",
//     "weekno": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Green Bay Packers",
//     "weekno": 14,
//     "startdate": "Monday, Nov. 6, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 15,
//     "startdate": "Thursday, Nov. 9, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Buffalo Bills",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Chicago Bears",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Detroit Lions",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Tennessee Titans",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Washington Redskins",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Denver Broncos",
//     "weekno": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Carolina Panthers",
//     "weekno": 15,
//     "startdate": "Monday, Nov. 13, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 16,
//     "startdate": "Thursday, Nov. 16, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Chicago Bears",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Cleveland Browns",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Green Bay Packers",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Houston Texans",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "New Orleans Saints",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "New York Giants",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Denver Broncos",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Oakland Raiders",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 16,
//     "startdate": "Sunday, Nov. 19, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 16,
//     "startdate": "Monday, Nov. 20, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Detroit Lions",
//     "weekno": 17,
//     "startdate": "Thursday, Nov. 23, 2017",
//     "starttime": "12:30 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 17,
//     "startdate": "Thursday, Nov. 23, 2017",
//     "starttime": "4:30 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Washington Redskins",
//     "weekno": 17,
//     "startdate": "Thursday, Nov. 23, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "New England Patriots",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "New York Jets",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Oakland Raiders",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 17,
//     "startdate": "Monday, Nov. 27, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 18,
//     "startdate": "Thursday, Nov. 30, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Buffalo Bills",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Chicago Bears",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Green Bay Packers",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Miami Dolphins",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "New Orleans Saints",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "New York Jets",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Tennessee Titans",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Oakland Raiders",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 18,
//     "startdate": "Monday, Dec. 4, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 19,
//     "startdate": "Thursday, Dec. 7, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Buffalo Bills",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Carolina Panthers",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Cleveland Browns",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Houston Texans",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Denver Broncos",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "New York Giants",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Miami Dolphins",
//     "weekno": 19,
//     "startdate": "Monday, Dec. 11, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 20,
//     "startdate": "Thursday, Dec. 14, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Detroit Lions",
//     "weekno": 20,
//     "startdate": "Saturday, Dec. 16, 2017",
//     "starttime": "4:30 p.m.",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 20,
//     "startdate": "Saturday, Dec. 16, 2017",
//     "starttime": "8:25 p.m.",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Buffalo Bills",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Carolina Panthers",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Cleveland Browns",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Jacksonville Jaguars",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "New Orleans Saints",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "New York Giants",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Washington Redskins",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Oakland Raiders",
//     "weekno": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 20,
//     "startdate": "Monday, Dec. 18, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 21,
//     "startdate": "Saturday, Dec. 23, 2017",
//     "starttime": "4:30 p.m.",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Green Bay Packers",
//     "weekno": 21,
//     "startdate": "Saturday, Dec. 23, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Carolina Panthers",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Chicago Bears",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Cincinnati Bengals",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Kansas City Chiefs",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "New England Patriots",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "New Orleans Saints",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "New York Jets",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Tennessee Titans",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Washington Redskins",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "San Francisco 49ers",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "4:05 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Arizona Cardinals",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Dallas Cowboys",
//     "weekno": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Houston Texans",
//     "weekno": 21,
//     "startdate": "Monday, Dec. 25, 2017",
//     "starttime": "4:30 p.m.",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 21,
//     "startdate": "Monday, Dec. 25, 2017",
//     "starttime": "8:30 p.m.",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "Atlanta Falcons",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Baltimore Ravens",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Detroit Lions",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Indianapolis Colts",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Miami Dolphins",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Minnesota Vikings",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "New England Patriots",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "New York Giants",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Philadelphia Eagles",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Pittsburgh Steelers",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Tennessee Titans",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Denver Broncos",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Los Angeles Rams",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Seattle Seahawks",
//     "weekno": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 p.m.",
//     "station": "Fox"
//   }
// ];

    const games = 
[
  // {
  //   "awayteam": "Miami",
  //   "hometeam": "Philadelphia",
  //   "startdate": "Thursday, Aug 24, 2017",
  //   "starttime": "7:00 PM",
  //   "station": "NFLN",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Carolina",
  //   "hometeam": "Jacksonville",
  //   "startdate": "Thursday, Aug 24, 2017",
  //   "starttime": "7:30 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "New England",
  //   "hometeam": "Detroit",
  //   "startdate": "Friday, Aug 25, 2017",
  //   "starttime": "7:00 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Kansas City",
  //   "hometeam": "Seattle",
  //   "startdate": "Friday, Aug 25, 2017",
  //   "starttime": "8:00 PM",
  //   "station": "CBS",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "New York Jets",
  //   "hometeam": "New York Giants",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "7:00 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Buffalo",
  //   "hometeam": "Baltimore",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "7:00 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Arizona",
  //   "hometeam": "Atlanta",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "7:00 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Indianapolis",
  //   "hometeam": "Pittsburgh",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "7:30 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Cleveland",
  //   "hometeam": "Tampa Bay",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "7:30 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Houston",
  //   "hometeam": "New Orleans",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "8:00 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Los Angeles Chargers",
  //   "hometeam": "Los Angeles Rams",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "8:00 PM",
  //   "station": "CBS",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Oakland",
  //   "hometeam": "Dallas",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "8:00 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Green Bay",
  //   "hometeam": "Denver",
  //   "startdate": "Saturday, Aug 26, 2017",
  //   "starttime": "9:00 PM",
  //   "station": "",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Chicago",
  //   "hometeam": "Tennessee",
  //   "startdate": "Sunday, Aug 27, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "Cincinnati",
  //   "hometeam": "Washington",
  //   "startdate": "Sunday, Aug 27, 2017",
  //   "starttime": "4:30 PM",
  //   "station": "FOX",
  //   "weekno": 4
  // },
  // {
  //   "awayteam": "San Francisco",
  //   "hometeam": "Minnesota",
  //   "startdate": "Sunday, Aug 27, 2017",
  //   "starttime": "8:00 PM",
  //   "station": "NBC",
  //   "weekno": 4
  // }
];

            const teamData = [
        {
            _id: "19823783734d1d04a1b39001",
            location: 'Kansas City',
            shortLocation: "KC",
            name: "Chiefs",
            color: "#CA2430",
            stadiumName: "Arrowhead Stadium",
            stadiumCity: "Kansas City, MO"
        },
        {
            _id: "19823783734d1d04a1b39002",
            location: 'New England',
            shortLocation: "NE",
            name: "Patriots",
            color: "#0A2342",
            stadiumName: "Gillette Stadium",
            stadiumCity: "Foxboro, MA"
        },
        {
            _id: "19823783734d1d04a1b39003",
            location: 'Atlanta',
            shortLocation: "ATL",
            name: "Falcons",
            color: "#A71930",
            stadiumName: "Mercedes-Benz Stadium",
            stadiumCity: "Atlanta, GA"
        },
        {
            _id: "19823783734d1d04a1b39004",
            location: 'Chicago',
            shortLocation: "CHI",
            name: "Bears",
            color: "#00143F",
            stadiumName: "Soldier Field",
            stadiumCity: "Chicago, IL"
        },
        {
            _id: "19823783734d1d04a1b39005",
            location: 'Arizona',
            shortLocation: "ARI",
            name: "Cardinals",
            color: "#97233F",
            stadiumName: "University of Phoenix Stadium",
            stadiumCity: "Glendale, AZ"
        },
        {
            _id: "19823783734d1d04a1b39006",
            location: 'Dallas',
            shortLocation: "DAL",
            name: "Cowboys",
            color: "#0C264C",
            stadiumName: "AT&T Stadium",
            stadiumCity: "Dallas, TX"
        },
        {
            _id: "19823783734d1d04a1b39007",
            location: 'Houston',
            shortLocation: "HOU",
            name: "Texans",
            color: "#00143F",
            stadiumName: "NRG Stadium",
            stadiumCity: "Houston, TX"
        },
        {
            _id: "19823783734d1d04a1b39008",
            location: 'Carolina',
            shortLocation: "CAR",
            name: "Panthers",
            color: "#0085CA",
            stadiumName: "Bank of America Stadium",
            stadiumCity: "Charlotte, NC"
        },
        {
            _id: "19823783734d1d04a1b39009",
            location: 'Miami',
            shortLocation: "MIA",
            name: "Dolphins",
            color: "#0091A0",
            stadiumName: "Hard Rock Stadium",
            stadiumCity: "Miami, FL"
        },
        {
            _id: "19823783734d1d04a1b3900a",
            location: 'Minnesota',
            shortLocation: "MIN",
            name: "Vikings",
            color: "#4F2E84",
            stadiumName: "U.S. Bank Stadium",
            stadiumCity: "Minneapolis, MN"
        },
        {
            _id: "19823783734d1d04a1b3900b",
            location: 'Buffalo',
            shortLocation: "BUF",
            name: "Bills",
            color: "#00338D",
            stadiumName: "New Era Field",
            stadiumCity: "Buffalo, NY"
        },
        {
            _id: "19823783734d1d04a1b3900c",
            location: 'Washington',
            shortLocation: "WAS",
            name: "Redskins",
            color: "#7C1415",
            stadiumName: "FedExField",
            stadiumCity: "Landover, MD"
        },
        {
            _id: "19823783734d1d04a1b3900d",
            location: 'Baltimore',
            shortLocation: "BAL",
            name: "Ravens",
            color: "#241773",
            stadiumName: "M&T Bank Stadium",
            stadiumCity: "Baltimore, MD"
        },
        {
            _id: "19823783734d1d04a1b3900e",
            location: 'Jacksonville',
            shortLocation: "JAC",
            name: "Jaguars",
            color: "#136677",
            stadiumName: "EverBank Field",
            stadiumCity: "Jacksonville, FL"
        },
        {
            _id: "19823783734d1d04a1b3900f",
            location: 'New Orleans',
            shortLocation: "NO",
            name: "Saints",
            color: "#A08A58",
            stadiumName: "Mercedes-Benz Superdome",
            stadiumCity: "New Orleans, LA"
        },
        {
            _id: "19823783734d1d04a1b39010",
            location: 'Cleveland',
            shortLocation: "CLE",
            name: "Browns",
            color: "#FB4F14",
            stadiumName: "FirstEnergy Stadium",
            stadiumCity: "Cleveland, OH"
        },
        {
            _id: "19823783734d1d04a1b39011",
            location: 'Philadelphia',
            shortLocation: "PHI",
            name: "Eagles",
            color: "#014A53",
            stadiumName: "Lincoln Financial Field",
            stadiumCity: "Philadelphia, PA"
        },
        {
            _id: "19823783734d1d04a1b39012",
            location: 'Green Bay',
            shortLocation: "GB",
            name: "Packers",
            color: "#24423c",
            stadiumName: "Lambeau Field",
            stadiumCity: "Green Bay, WI"
        },
        {
            _id: "19823783734d1d04a1b39013",
            location: 'Denver',
            shortLocation: "DEN",
            name: "Broncos",
            color: "#FB4F14",
            stadiumName: "Sports Authority Field",
            stadiumCity: "Denver, CO"
        },
        {
            _id: "19823783734d1d04a1b39014",
            location: 'Pittsburgh',
            shortLocation: "PIT",
            name: "Steelers",
            color: "#FFC20E",
            stadiumName: "Heinz Field",
            stadiumCity: "Pittsburgh, PA"
        },
        {
            _id: "19823783734d1d04a1b39015",
            location: 'New York',
            shortLocation: "NY",
            name: "Giants",
            color: "#192E6C",
            stadiumName: "MetLife Stadium",
            stadiumCity: "East Rutherford, NJ"
        },
        {
            _id: "19823783734d1d04a1b39016",
            location: 'Tampa Bay',
            shortLocation: "TB",
            name: "Buccaneers",
            color: "#D40909",
            stadiumName: "Raymond James Stadium",
            stadiumCity: "Tampa, FL"
        },
        {
            _id: "19823783734d1d04a1b39017",
            location: 'Cincinnati',
            shortLocation: "CIN",
            name: "Bengals",
            color: "#FB4F14",
            stadiumName: "Paul Brown Stadium",
            stadiumCity: "Cincinnati, OH"
        },
        {
            _id: "19823783734d1d04a1b39018",
            location: 'San Francisco',
            shortLocation: "SF",
            name: "49ers",
            color: "#C9243F",
            stadiumName: "Levi's Stadium",
            stadiumCity: "Santa Clara, CA"
        },
        {
            _id: "19823783734d1d04a1b39019",
            location: 'Tennessee',
            shortLocation: "TEN",
            name: "Titans",
            color: "#4095D1",
            stadiumName: "Nissan Stadium",
            stadiumCity: "Nashville, TN"
        },
        {
            _id: "19823783734d1d04a1b3901a",
            location: 'New York',
            shortLocation: "NY",
            name: "Jets",
            color: "#203731",
            stadiumName: "MetLife Stadium",
            stadiumCity: "East Rutherford, NJ"
        },
        {
            _id: "19823783734d1d04a1b3901b",
            location: 'Los Angeles',
            shortLocation: "LA",
            name: "Rams",
            color: "#95774C",
            stadiumName: "Los Angeles Stadium",
            stadiumCity: "Inglewood, CA"
        },
        {
            _id: "19823783734d1d04a1b3901c",
            location: 'Oakland',
            shortLocation: "OAK",
            name: "Raiders",
            color: "#C4C9CC",
            stadiumName: "Oakland Alameda Coliseum",
            stadiumCity: "Oakland, CA"
        },
        {
            _id: "19823783734d1d04a1b3901d",
            location: 'Detroit',
            shortLocation: "DET",
            name: "Lions",
            color: "#046EB4",
            stadiumName: "Ford Field",
            stadiumCity: "Detroit, MI"
        },
        {
            _id: "19823783734d1d04a1b3901e",
            location: 'Indianapolis',
            shortLocation: "IND",
            name: "Colts",
            color: "#003D79",
            stadiumName: "Lucas Oil Stadium",
            stadiumCity: "Indianapolis, IN"
        },
        {
            _id: "19823783734d1d04a1b3901f",
            location: 'Seattle',
            shortLocation: "SEA",
            name: "Seahawks",
            color: "#7AC142",
            stadiumName: "CenturyLink Field",
            stadiumCity: "Seattle, WA"
        },
        {
            _id: "19823783734d1d04a1b39000",
            location: 'Los Angeles',
            shortLocation: "LA",
            name: "Chargers",
            color: "#2072BA",
            stadiumName: "Los Angeles Stadium",
            stadiumCity: "Inglewood, CA"
        }
    ];

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

        date = date.split('.')[0] + '+04:00';
        
        const formattedGame = {
            startDateTime: date,
            station: game.station,
            leagueId: mongoose.Types.ObjectId("59723313734d1d6202a85f10"),
            weekNo: game.weekno,
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