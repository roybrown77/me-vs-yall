import moment from 'moment-timezone';

import get from 'lodash/get';

const getBet = (results) => {
    return (results['wins'] * 110) + (results['losses'] * 110) + (results['ties'] * 110);
};

const getWinnings = (results) => {
    return (results['wins'] * 100) - (results['losses'] * 110);
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

    const format = symbol + 
    (j ? i.substr(0, j) + thousand : "") + 
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + 
    (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");

    return format;
};

const getResults = (games, picks) => {
    const result = games.reduce((total,game)=>{
        if (get(game,'isGameOver',false)) {
            if (game.competitors[0].score === game.competitors[1].score) {
                total['ties']++;
            } else {
                const winner = game.competitors[0].score === game.competitors[1].score ? undefined : 
                (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

                game.competitors.forEach((competitor, index)=> {
                    const winnerSelected = !!picks.find(x=>x.gameId === game._id && x.pickId === competitor._id);

                    if (winnerSelected && competitor._id === winner) {
                        total['wins']++;
                    }

                    if (winnerSelected && competitor._id !== winner) {
                        total['losses']++;
                    }
                });
            }
        }

        return total;
    }, {wins: 0, losses: 0, ties: 0});

    return result;
};

const formatWeeks = (gameWeeks) => {
    const formattedGameWeeks = gameWeeks.map((week)=>{
        const startDateTime = moment(week.beginDateTime).format('ddd M/D');
        const endDateTime = moment(week.endDateTime).format('ddd M/D');

        if (startDateTime !== endDateTime) {
            week.displayName = (get(week,'description') ? get(week,'description') + ' ' : '') + 
            moment(new Date(week.beginDateTime)).tz('America/New_York').format('ddd M/D') + ' - ' + 
            moment(new Date(week.endDateTime)).tz('America/New_York').format('ddd M/D');
        } else {
            week.displayName = (get(week,'description') ? get(week,'description') + ' ' : '') + moment(new Date(week.beginDateTime)).tz('America/New_York').format('ddd M/D');
        }

        return week;
    });

    return formattedGameWeeks;
};

const areAnyGamesOver = (games) => {
    return games.some(x=>!!x.isGameOver);
};

const leagues = [ 
    {id: '59723313734d1d6202a85f10', name: 'nfl', description: 'nfl', years: [2017, 2018], isDaily: false},
    //{id: '59723313734d1d6202a85f11', name: 'frenchopen', description: 'french open', years: [2018], isDaily: true},
    //{id: '59723313734d1d6202a85f12', name: 'fifaworldcup', description: 'fifa world cup', years: [2018], isDaily: true},
    //{id: '59723313734d1d6202a85f13', name: 'mlbplayoffs', description: 'mlb playoffs', years: [2018], isDaily: true},
    //{id: '59723313734d1d6202a85f14', name: 'wimbledon', description: 'wimbledon', years: [2018], isDaily: true},
    {id: '59723313734d1d6202a85f15', name: 'ncaaf', description: 'ncaaf', years: [2018], isDaily: false},
    //{id: '59723313734d1d6202a85f17', name: 'premier', description: 'premier', years: [2018], isDaily: false}
];

export {
    leagues,
    getResults,
    areAnyGamesOver,
    formatWeeks,
    formatMoney,
    getWinnings,
    getBet
};