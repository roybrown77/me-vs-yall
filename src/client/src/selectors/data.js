import moment from 'moment-timezone';

import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

const leagues = [ {id: '59723313734d1d6202a85f10', name: 'nfl'} ];

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
    return (negative === '-' ? negative + symbol : symbol + negative) + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

const areAnyGamesOver = (games) => {
    return games.some(x=>!!x.isGameOver);
};

const getUsers = () => {
    return [
        {
            id: 'google-oauth2|114172296334563495985',
            name: 'Roy B.'
        },
        {
            id: 'google-oauth2|114007081690870704922',
            name: 'Scott T.'
        },
        {
            id: 'google-oauth2|110505723196499693171',
            name: 'Keith H.'
        }
    ];
}

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

const getWeeks = (entities) => {
    const gameWeeks = get(entities,'gameWeeks',[]);
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

    const weeks = sortBy(formattedGameWeeks, ['seasonType', 'weekNo']);

    return weeks;
};

export {
    leagues,
    getResults,
    areAnyGamesOver,
    getWeeks,
    formatMoney,
    getWinnings,
    getBet,
    getUsers
};