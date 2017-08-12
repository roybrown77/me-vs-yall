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

router.post('/games/creategames', function (req, res) {
    const games = [];

//     const games = 
// [
//   {
//     "awayteam": "Buffalo",
//     "hometeam": "Philadelphia",
//     "weekno": 3,
//     "startdate": "Thursday, Aug 17, 2017",
//     "starttime": "7:00 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "Baltimore",
//     "hometeam": "Miami",
//     "weekno": 3,
//     "startdate": "Thursday, Aug 17, 2017",
//     "starttime": "7:00 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "Tampa Bay",
//     "hometeam": "Jacksonville",
//     "weekno": 3,
//     "startdate": "Thursday, Aug 17, 2017",
//     "starttime": "8:00 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Minnesota",
//     "hometeam": "Seattle",
//     "weekno": 3,
//     "startdate": "Friday, Aug 18, 2017",
//     "starttime": "10:00 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Carolina",
//     "hometeam": "Tennessee",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "3:00 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Kansas City",
//     "hometeam": "Cincinnati",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "7:00 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "Indianapolis",
//     "hometeam": "Dallas",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "7:00 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Detroit",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "7:30 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "Green Bay",
//     "hometeam": "Washington",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "7:30 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "New England",
//     "hometeam": "Houston",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "8:00 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "Denver",
//     "hometeam": "San Francisco",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "10:00 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Oakland",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "10:00 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "Chicago",
//     "hometeam": "Arizona",
//     "weekno": 3,
//     "startdate": "Saturday, Aug 19, 2017",
//     "starttime": "10:00 PM",
//     "station": ""
//   },
//   {
//     "awayteam": "Atlanta",
//     "hometeam": "Pittsburgh",
//     "weekno": 3,
//     "startdate": "Sunday, Aug 20, 2017",
//     "starttime": "4:00 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "New Orleans",
//     "hometeam": "Los Angeles Chargers",
//     "weekno": 3,
//     "startdate": "Sunday, Aug 20, 2017",
//     "starttime": "8:00 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Cleveland",
//     "weekno": 3,
//     "startdate": "Monday, Aug 21, 2017",
//     "starttime": "8:00 PM",
//     "station": "ESPN"
//   }
// ];

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

    // for (var i = 0, len = games.length; i < len; i++) {
    //     let game = games[i];
        
    //     let competitors = [];

    //     let awayteam = teamData.find(x=>((x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.awayteam) || x.location + " " + x.name === game.awayteam);

    //     let awaycompetitor = {
    //         _id: mongoose.Types.ObjectId(awayteam._id),
    //         name: awayteam.location + " " + awayteam.name
    //     };

    //     let hometeam = teamData.find(x=>(x.location != 'Los Angeles' && x.location != 'New York') && x.location === game.awayteam) || x.location + " " + x.name === game.hometeam);

    //     competitors.push(awaycompetitor);

    //     let homecompetitor = {
    //         _id: mongoose.Types.ObjectId(hometeam._id),
    //         name: hometeam.location + " " + hometeam.name
    //     };

    //     competitors.push(homecompetitor);

    //     let date = new Date(new Date(game.startdate + game.starttime).toUTCString()).toISOString();

    //     date = date.split('.')[0] + '+04:00';
        
    //     const formattedGame = {
    //         startDateTime: date,
    //         station: game.station,
    //         leagueId: mongoose.Types.ObjectId("59723313734d1d6202a85f10"),
    //         weekNo: game.weekno,
    //         competitors: competitors
    //     };

    //     gameRepository.create(formattedGame, function (err, gameCreated) {
    //         if (err) {
    //             console.log("There was a problem adding the information to the database: " + err.message);
    //         }  
            
    //         console.log("Success Creating: " + gameCreated._id);
    //     });
    // };
});

module.exports = router;