import moment from 'moment-timezone';

import get from 'lodash/get';
import last from 'lodash/last';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import orderBy from 'lodash/orderBy';

const leagues = [ 
    {
        id: '59723313734d1d6202a85f10', 
        name: 'nfl', 
        description: 'nfl', 
        years: [2017, 2018]
    },
    {
        id: '59723313734d1d6202a85f17', 
        name: 'premier', 
        description: 'premier', 
        years: [2018]
    },
    {
        id: '59723313734d1d6202a85f19', 
        name: 'nba', 
        description: 'nba', 
        years: [2018]
    }
];

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

const getLeaders = (games = [], picks = [], users = []) => {
    const grouping = groupBy(picks, 'userId');
        
    const picksByUser = transform(grouping, (result, value, key)=>{
        result.push({
            userId: key,
            picks: value
        });
    }, []);

    const sortedGames = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

    const pickResults = picksByUser.reduce((total, item) => {
        const user = users.find(x=>x.authServiceId === item.userId);
        if (!!user) {
          const pickResult = getResults(sortedGames,item.picks);
          total.push({
              id: item.userId,
              userName: get(user,'firstName','') + ' ' + get(user,'lastName',''),
              wins: pickResult.wins,
              losses: pickResult.losses
          });
        }

        return total;
    }, []);

    const pickResultsOrdered = orderBy(pickResults, ['wins', 'losses', 'userName'], ['desc', 'asc', 'asc', 'asc']);

    return pickResultsOrdered;
};

const getResults = (games = [], picks = []) => {
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

const formatWeeks = (gameWeeks = []) => {
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

const areAnyGamesOver = (games = []) => {
    return games.some(x=>!!x.isGameOver);
};

const getCurrentWeek = (weeks = []) => {
    return last(weeks);
};

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
    const time = areAllGamesOver ? day === 3 && new Date().getHours() <= 9 ? moment().startOf('day').add(9,'hours').toISOString() :
    (day === 3 && new Date().getHours() > 9 ? moment().add(7,'day').startOf('day').add(9,'hours').toISOString() : 
    day > 2 ? moment().add(7-Math.abs(3-day),'day').startOf('day').add(9,'hours').toISOString() : 
    day === 2 ? moment().add(1,'day').startOf('day').add(9,'hours').toISOString() : moment().add(2,'day').startOf('day').add(9,'hours').toISOString()) : undefined;
    return time;
};

const getVegasUser = () => {
    return {
        firstName: 'Westgate Las Vegas SuperBook',
        authServiceId: '1'
    };
};

const getVegasPicks = (games = []) => {
    return games.map(x=>{
        return {
            gameId: get(x,'spread.amount') ? x._id : '000000000000000000000000',
            userId: '1',
            pickId: get(x,'spread.amount') ? get(x,'spread.teamId') : get(x,'competitors.1._id') 
        };
    });
};

const getGroupedGames = (games = [], picks = [], teams = []) => {
    const formattedGames = games.map((game)=>{
        const displayDateTime = moment(new Date(game.startDateTime));
        return {
            ...game,
            startDateTimeDisplay: displayDateTime.format('dddd MMM D YYYY h:mm a'),
            winner: game.competitors[0].score === game.competitors[1].score ? 
                '000000000000000000000000' : (game.competitors[0].score > game.competitors[1].score ? 
                game.competitors[0]._id : game.competitors[1]._id),
            competitors: game.competitors.map((competitor)=> {
                    const team = teams.find(x=>x._id === competitor._id);
                    return {
                        ...competitor,
                        shortLocation: team.shortLocation === 'LAR' || team.shortLocation === 'LAC' || team.shortLocation === 'LAL' ? 
                        'LA' : team.shortLocation === 'NYG' || team.shortLocation === 'NYJ' ? 'NY' : team.shortLocation,
                        name: team.name || team.location,
                        color: team.color,
                        record: game.isGameOver ? competitor.finalRecord : competitor.record,
                        selected: picks.find(x=>x.gameId === game._id && 
                            (x.pickId === competitor._id || x.pickId === '000000000000000000000000')) ? true : false
                    };
                })
        };
    });

    return [
        ...orderBy(formattedGames.filter(x=>hasGameStarted(x.startDateTime) && !x.isGameOver),['_id']).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)),
        ...orderBy(formattedGames.filter(x=>!hasGameStarted(x.startDateTime)),['_id']).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)),
        ...orderBy(formattedGames.filter(x=>x.isGameOver),['_id']).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
    ];
};

const getAreAnyGamesInProgress = (games = []) => {
    return games.some(x=>hasGameStarted(x.startDateTime) && !x.isGameOver)
};

export {
    getResults,
    areAnyGamesOver,
    formatWeeks,
    formatMoney,
    getWinnings,
    getBet,
    getCurrentWeek,
    hasGameStarted,
    getAreAllGamesOver,
    getTimeUntilNextGamesLoad,
    getLeaders,
    getVegasUser,
    getVegasPicks,
    getGroupedGames,
    getAreAnyGamesInProgress,
    leagues
};
