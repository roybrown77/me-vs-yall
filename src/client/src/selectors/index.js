import moment from 'moment-timezone';

import get from 'lodash/get';
import last from 'lodash/last';

const getBet = (results) => {
    return (results['wins'] * 110) + (results['losses'] * 110);
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
    let i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
    let j = i.length > 3 ? i.length % 3 : 0;

    const format = symbol + 
    (j ? i.substr(0, j) + thousand : "") + 
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + 
    (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");

    return format;
};

const getResults = (games, picks) => {
    const result = games.reduce((total,game)=>{
        if (get(game,'isGameOver',false)) {
            const winner = game.competitors[0].score === game.competitors[1].score ? '000000000000000000000000' : 
            (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

            const gamePicked = picks.find(x=>x.gameId === game._id);

            if (gamePicked) {
                const winnerSelected = gamePicked.pickId === winner;

                if (winnerSelected) {
                    total['wins']++;
                } else {
                    total['losses']++;
                }
            }
        }

        return total;
    }, {wins: 0, losses: 0});

    return result;
};

const formatWeeks = (gameWeeks) => {
    const formattedGameWeeks = gameWeeks.map((week)=>{
        const startDateTime = moment(week.beginDateTime).format('ddd M/D');
        const endDateTime = moment(week.endDateTime).format('ddd M/D');

        if (startDateTime !== endDateTime) {
            week.displayName = (get(week,'description') ? get(week,'description') + ' ' : '') + 
            moment(new Date(week.beginDateTime)).format('ddd M/D') + ' - ' + 
            moment(new Date(week.endDateTime)).format('ddd M/D');
        } else {
            week.displayName = (get(week,'description') ? get(week,'description') + ' ' : '') + 
            moment(new Date(week.beginDateTime)).tz('America/New_York').format('ddd M/D');
        }

        return week;
    });

    return formattedGameWeeks;
};

const areAnyGamesOver = (games) => {
    return games.some(x=>!!x.isGameOver);
};

const leagues = [ 
    {id: '59723313734d1d6202a85f10', name: 'nfl', description: 'nfl', years: [2017, 2018]},
    //{id: '59723313734d1d6202a85f11', name: 'frenchopen', description: 'french open', years: [2018]},
    //{id: '59723313734d1d6202a85f12', name: 'fifaworldcup', description: 'fifa world cup', years: [2018]},
    //{id: '59723313734d1d6202a85f13', name: 'mlbplayoffs', description: 'mlb playoffs', years: [2018]},
    //{id: '59723313734d1d6202a85f14', name: 'wimbledon', description: 'wimbledon', years: [2018]},
    //{id: '59723313734d1d6202a85f15', name: 'ncaaf', description: 'ncaaf', years: [2018]},
    {id: '59723313734d1d6202a85f17', name: 'premier', description: 'premier', years: [2018]}
];

const getCurrentWeek = (weeks) => {
    return last(weeks);
}

const hasGameStarted = (dateTime) => {
    const gameStartDateTime = moment(new Date(dateTime));
    const currentDateTime = moment(new Date());
    const difference = gameStartDateTime.diff(currentDateTime,'minutes');
    return difference <= 0;
};

const getAreAllGamesOver = (games = []) => {
    return !games.some(x=>!x.isGameOver);
};

const getTimeUntilNextGamesLoad = (games = []) => {
    const day = moment().weekday();
    const areAllGamesOver = getAreAllGamesOver(games);
    return areAllGamesOver ? day === 3 ? 
    moment().startOf('day').add(9,'hours').toISOString() : 
    moment().add((day > 2 ? 
        7-Math.abs(3-day) : 
        day === 2 ? 1 : 2), 'days').startOf('day').add(9,'hours').toISOString() : undefined;
}; 


export {
    leagues,
    getResults,
    areAnyGamesOver,
    formatWeeks,
    formatMoney,
    getWinnings,
    getBet,
    getCurrentWeek,
    hasGameStarted,
    getAreAllGamesOver,
    getTimeUntilNextGamesLoad
};
