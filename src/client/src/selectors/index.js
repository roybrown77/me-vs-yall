import moment from 'moment-timezone';

import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

const getBet = (results) => {
    return (results.wins * 110) + (results.losses * 110) + (results.ties * 110);
};

const getWinnings = (results) => {
    return (results.wins * 100) - (results.losses * 110) - (results.ties * 110);
};

const formatMoney = (number, places, symbol, thousand, decimal) => {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

const getResults = (games, picks) => {
    let wins = 0;
    let losses = 0;
    let ties = 0;

    const gamesOver = areAnyGamesOver(games);

    if (gamesOver) {
        const filteredGames = games.filter(game=>{
            return !!game.isGameOver && game.seasonType > 1 && !(game.seasonType === 3 && game.weekNo === 4);
        });

        const filteredPicks = picks.filter(pick=>{
            return pick.seasonType > 1 && !(pick.seasonType === 3 && pick.weekNo === 4);
        });

        filteredGames.forEach(game=>{
            if (game.competitors[0].score === game.competitors[1].score) {
                ++ties;
            }

            const winner = game.competitors[0].score === game.competitors[1].score ? undefined : 
            (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

            game.competitors.forEach((competitor, index)=> {
                const winnerSelected = !!filteredPicks.find(x=>x.gameId === game._id && x.pickId === competitor._id);

                if (winnerSelected && competitor._id === winner) {
                    ++wins;
                }

                if (winnerSelected && competitor._id !== winner) {
                    ++losses;
                }
            });
        });
    }

    return {
        wins,
        losses,
        ties
    };
};

const formatWeeks = (gameWeeks) => {
    const formattedGameWeeks = gameWeeks.map((week)=>{
        const startDateTime = moment(week.beginDateTime).format('ddd M/D');
        const endDateTime = moment(week.endDateTime).format('ddd M/D');

        if (startDateTime !== endDateTime) {
            week.displayName = week.description + ' ' + 
            moment(new Date(week.beginDateTime)).tz('America/New_York').format('ddd M/D') + ' - ' + 
            moment(new Date(week.endDateTime)).tz('America/New_York').format('ddd M/D');
        } else {
            week.displayName = week.description + ' ' + moment(new Date(week.beginDateTime)).tz('America/New_York').format('ddd M/D');
        }

        return week;
    });

    return formattedGameWeeks;
};

const areAnyGamesOver = (games) => {
    return games.some(x=>!!x.isGameOver);
};

const leagues = [ 
    {id: '59723313734d1d6202a85f10', name: 'nfl', description: 'nfl', years: [2017], isDaily: false},
    //{id: '59723313734d1d6202a85f11', name: 'frenchopen', description: 'french open', years: [2018], isDaily: true},
    {id: '59723313734d1d6202a85f12', name: 'fifaworldcup', description: 'fifa world cup', years: [2018], isDaily: true},
    {id: '59723313734d1d6202a85f13', name: 'mlbplayoffs', description: 'mlb playoffs', years: [2018], isDaily: true},
    {id: '59723313734d1d6202a85f14', name: 'wimbledon', description: 'wimbledon', years: [2018], isDaily: true}
];

const teams = [
        {
            _id: '19823783734d1d04a1b39020',
            location: 'Russia',
            shortLocation: "RUS",
            name: "Russia",
            colors: ['#FFFFFF', '#0039A6', '#D52B1E']
        },
        {
            _id: '19823783734d1d04a1b39021',
            location: 'Saudi Arabia',
            shortLocation: "SA",
            name: "Saudi Arabia",
            colors: ['#006C35', '#FFFFFF']
        },
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
            stadiumCity: "Foxborough, MA"
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
            stadiumCity: "Arlington, TX"
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
            shortLocation: "WSH",
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
            shortLocation: "JAX",
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
            shortLocation: "NYG",
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
            shortLocation: "NYJ",
            name: "Jets",
            color: "#203731",
            stadiumName: "MetLife Stadium",
            stadiumCity: "East Rutherford, NJ"
        },
        {
            _id: "19823783734d1d04a1b3901b",
            location: 'Los Angeles',
            shortLocation: "LAR",
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
            shortLocation: "LAC",
            name: "Chargers",
            color: "#2072BA",
            stadiumName: "Los Angeles Stadium",
            stadiumCity: "Inglewood, CA"
        }
    ];

export {
    leagues,
    teams,
    getResults,
    areAnyGamesOver,
    formatWeeks,
    formatMoney,
    getWinnings,
    getBet
};