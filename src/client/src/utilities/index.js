import moment from 'moment-timezone';

import get from 'lodash/get';
import last from 'lodash/last';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import orderBy from 'lodash/orderBy';

import polamalu from '../styles/images/polamalu.jpg';
import mack from '../styles/images/mack.jpg';
import reggie from '../styles/images/reggie.jpg';
import trevor from '../styles/images/trevor.jpg';

const vegasPictures = [
];

const getImage = (screen, leagueId) => {
    switch (leagueId) {
        case '59723313734d1d6202a85f10':
        return screen === 'scores' ? {picture: polamalu, source: 'Getty Images'} : {picture: mack, source: 'ChicagoBears.com'};
        case '59723313734d1d6202a85f15':
          return screen === 'scores' ? {picture: reggie, source: 'Lucy Nicholson / REUTERS'} : {picture: trevor, source: 'Christian Petersen / Getty Images'};
        // case '59723313734d1d6202a85f17':
        //   return reggie;
        // case '59723313734d1d6202a85f29':
        //   return reggie;
        // case '59723313734d1d6202a85f25':
        //   return reggie;
        // case '59723313734d1d6202a85f27':
        //   return reggie;
        // case '59723313734d1d6202a85f19':
        default:
          return null;
    };
};

const leagues = [ 
    {
        id: '59723313734d1d6202a85f10', 
        name: 'nfl', 
        description: 'nfl',
        years: [2017, 2018, 2019]
    },
    {
        id: '59723313734d1d6202a85f15', 
        name: 'ncaaf', 
        description: 'ncaaf', 
        years: [2019]
    },
    {
        id: '59723313734d1d6202a85f17', 
        name: 'premier', 
        description: 'premier',
        years: [2018, 2019]
    },
    {
        id: '59723313734d1d6202a85f29', 
        name: 'mls', 
        description: 'mls',
        years: [2019]
    },
    {
        id: '59723313734d1d6202a85f25', 
        name: 'boxing', 
        description: 'boxing', 
        years: [2019]
    },
    {
        id: '59723313734d1d6202a85f27', 
        name: 'mma', 
        description: 'mma', 
        years: [2019]
    },
    {
        id: '59723313734d1d6202a85f19', 
        name: 'nba', 
        description: 'nba', 
        years: [2018]
    },
    // {
    //     id: '59723313734d1d6202a85f21', 
    //     name: 'mlb', 
    //     description: 'mlb', 
    //     years: [2019]
    // }
];

const getLeagueStartDateTime = (leagueId, games) => {
    const monthDay = parseInt(moment().format('MMDD'));
    const year = moment().format('YYYY');

    if (leagueId === '59723313734d1d6202a85f10' && (monthDay > 208 && monthDay < 801)) {
        return moment(`${year}0801`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f15' && (monthDay > 108 && monthDay < 801)) {
        return moment(`${year}0801`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f17' && (monthDay > 515 && monthDay < 801)) {
        return moment(`${year}0801`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f19' && (monthDay > 615 && monthDay < 1201)) {
        return moment(`${year}1201`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f21' && (monthDay < 401 || monthDay > 1115)) {
        return moment(`${year}0401`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f23' && (monthDay > 115)) {
        return moment(`${year}1231`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f29' && (monthDay < 301 || monthDay > 1101)) {
        return moment(`${year}0301`).toISOString();
    }

    return getStartDateTime(games);
}

const getLeagueNextGameStartDateTime = (leagueId, games) => {
    const monthDay = parseInt(moment().format('MMDD'));
    const year = moment().format('YYYY');

    if (leagueId === '59723313734d1d6202a85f10' && (monthDay > 208 && monthDay < 801)) {
        return moment(`${year}0801`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f15' && (monthDay > 108 && monthDay < 801)) {
        return moment(`${year}0801`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f17' && (monthDay > 515 && monthDay < 801)) {
        return moment(`${year}0801`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f19' && (monthDay > 615 && monthDay < 1201)) {
        return moment(`${year}1201`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f21' && (monthDay < 401 || monthDay > 1115)) {
        return moment(`${year}0401`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f23' && (monthDay > 115)) {
        return moment(`${year}1231`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f29' && (monthDay < 301 || monthDay > 1101)) {
        return moment(`${year}0301`).toISOString();
    }

    return getNextGameStartDateTime(games);
}

const getStartDateTime = (games) => {
    return getAreAllGamesOver(games) ? getTimeUntilNextGamesLoad(games) : getNextGameStartDateTime(games);
}

const getNextGameStartDateTime = (games) => {
    return get(games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).find(x=>x.isGameOver !== true),'startDateTime');
}

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

const getLeaders = (games = [], picks = [], users = [], teams = []) => {
    const grouping = groupBy(picks, 'userId');
        
    const leaders = transform(grouping, (result, value, key)=>{
        result.push({
            userId: key,
            picks: value
        });
    }, []);

    let date; 

    const pickResults = leaders.reduce((total, item) => {
        const user = users.find(x=>x.authServiceId === item.userId);
        if (!!user) {
            const leaderPicks = item.picks;
            const pickResult = getResults(games,leaderPicks);

            total.push({
                id: item.userId,
                userName: get(user,'firstName','') + ' ' + get(user,'lastName',''),
                picture: get(user,'picture'),
                wins: pickResult.wins,
                losses: pickResult.losses,
                spreadWins: pickResult.spreadWins,
                spreadLosses: pickResult.spreadLosses,
                winsBeforeGameOver: pickResult.winsBeforeGameOver,
                lossesBeforeGameOver: pickResult.lossesBeforeGameOver,
                games
          });
        }

        return total;
    }, []);

    const pickResultsOrdered = orderBy(pickResults, ['winsBeforeGameOver', 'lossesBeforeGameOver', 'userName'], ['desc', 'asc', 'asc']);

    return pickResultsOrdered.map(leader=>{
        const winnings = getWinnings(leader);
        return {
            ...leader,
            percentage: leader.wins + leader.losses > 0 ? parseInt((leader.wins/(leader.wins + leader.losses)) * 100) + '%' : '',
            color: (winnings || 0) < 0 ? 'red' : '#009933',
            vegasWinnings: ((winnings || 0) < 0 ? '-' : '') + formatMoney(winnings),
            games: leader.games.map(game=>{
                const newGameDate = moment(get(game,'startDateTime')).format('dddd MMM D YYYY');
                const isNewDate = (date !== newGameDate);
                if (isNewDate) date = newGameDate;
                const hasStarted = hasGameStarted(game.startDateTime);
                return {
                    ...game,
                    isNewDate,
                    date,
                    awayTeam: get(teams.find(team=>team._id === game.competitors[0]._id), 'name'),
                    awayIndicator: getLeaderIndicator(game,picks,leader,0,1),
                    awayScore: hasStarted ? (get(game,'competitors.0.score') || 0) : undefined,
                    homeTeam: get(teams.find(team=>team._id === game.competitors[1]._id), 'name'),
                    homeIndicator: getLeaderIndicator(game,picks,leader,1,0),
                    homeScore: hasStarted ? (get(game,'competitors.1.score') || 0) : undefined
                }
            })
        }
    });
};

const getResults = (games = [], picks = []) => {
    const result = games.reduce((total,game)=>{
        //if (get(game,'isGameOver',false)) {
            const gamePicked = picks.find(x=>x.gameId === game._id);

            if (gamePicked) {
                const winner = game.competitors[0].score === game.competitors[1].score ? '000000000000000000000000' : 
                    (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)
                
                const winnerSelected = gamePicked.pickId === winner;

                const pickedSpreadTeam = gamePicked.pickId === get(game,'spread.teamId');

                const spreadTeamWon = get(game,'spread.teamId') === winner;

                const spreadDiff = winner === game.competitors[0].id ? 
                    game.competitors[0].score - game.competitors[1].score : winner === game.competitors[1].id ? game.competitors[1].score - game.competitors[0].score : 0;

                const wonBySpread = get(game,'spread.teamId') === winner && spreadDiff >= Math.abs(get(game,'spread.amount'));

                if (winnerSelected) {
                    // if (spreadTeamWon) {
                    //     if (pickedSpreadTeam) {
                    //         if (wonBySpread) {
                    //             total['spreadWins']++;
                    //         } else {
                    //             total['spreadLosses']++;
                    //         }
                    //     } else {
                    //         total['spreadLosses']++;
                    //     }
                    // } else {
                    //     if (pickedSpreadTeam) {
                    //         total['spreadLosses']++;
                    //     } else {
                    //         total['spreadWins']++;
                    //     }
                    // }

                    if (get(game,'isGameOver',false)) {
                        total['wins']++;
                        total['winsBeforeGameOver']++;
                    } else {
                        if (hasGameStarted(game.startDateTime)) {
                            total['winsBeforeGameOver']++;
                        }
                    }
                } else {
                    // if (pickedSpreadTeam) {
                    //     total['spreadLosses']++;
                    // } else {
                    //     if (wonBySpread) {
                    //         total['spreadLosses']++;
                    //     } else {
                    //         total['spreadWins']++;
                    //     }
                    // }

                    if (get(game,'isGameOver',false)) {
                        total['losses']++;
                        total['lossesBeforeGameOver']++;
                    } else {
                        if (hasGameStarted(game.startDateTime)) {
                            total['lossesBeforeGameOver']++;
                        }
                    }
                }
            }
        //}

        return total;
    }, {wins: 0, losses: 0, winsBeforeGameOver: 0, lossesBeforeGameOver: 0, spreadWins: 0, spreadLosses: 0});

    return result;
};

const formatWeeks = (gameWeeks = []) => {
    const formattedGameWeeks = gameWeeks.map((week)=>{
        const startDateTime = moment(week.beginDateTime).format('ddd M/D');
        const endDateTime = moment(week.endDateTime).format('ddd M/D');

        if (startDateTime !== endDateTime) {
            week.displayName = (get(week,'description') ? get(week,'description') + ' ' : '') + 
            moment(new Date(week.beginDateTime)).tz('America/New_York').format('ddd M/D') + ' - ' + 
            moment(new Date(week.endDateTime)).tz('America/New_York').format('ddd M/D');
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
    // must check if any games in progress then if have not started to return it as current week
    const currentDateTime = moment();
    const dateFound = weeks.find(x=>currentDateTime.diff(moment(x.startDateTime),'seconds') >= 0 && currentDateTime.diff(moment(x.endDateTime).add(8,'hours'),'seconds') <= 0);
    return dateFound || last(weeks);
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
    const time = areAllGamesOver ? (day === 2 && new Date().getHours() <= 19 ? moment().startOf('day').add(19,'hours').toISOString() :
    day === 2 && new Date().getHours() > 19 ? moment().add(7,'day').startOf('day').add(19,'hours').toISOString() : 
    day > 2 ? moment().add(7-Math.abs(3-day),'day').startOf('day').add(19,'hours').toISOString() : 
    moment().add(2-day,'day').startOf('day').add(19,'hours').toISOString()) : undefined;
    return time;
};

const getVegasUser = () => {
    return {
        firstName: 'Vegas SuperBook',
        authServiceId: '1',
        picture: vegasPictures[Math.floor(Math.random()*vegasPictures.length)]
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
                        shortLocation: ['LAR','LAC','LAL','LAD','LAA'].includes(team.shortLocation) ? 'LA' : 
                        ['NYG','NYJ','NYY','NYM'].includes(team.shortLocation) ? 'NY' : 
                        ['CHC','CHW'].includes(team.shortLocation) ? 'CHI' : team.shortLocation,
                        name: team.name || team.location,
                        color: team.color,
                        record: competitor.finalRecord || competitor.record,
                        country: team.country,
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

const getLeaderIndicator = (game,picks,leader,index1,index2) => {
    return game.isGameOver && ((game.competitors[index1].score === game.competitors[index2].score && 
            picks.find(pick=>pick.pickId === '000000000000000000000000' && pick.userId === leader.id && pick.gameId === game._id)) || 
            (game.competitors[index1].score > game.competitors[index2].score && 
            picks.find(pick=>(pick.pickId === game.competitors[index1]._id || pick.pickId === '000000000000000000000000') 
                && pick.userId === leader.id && pick.gameId === game._id))) ? '#009933' : 

            game.isGameOver && ((game.competitors[index1].score === game.competitors[index2].score && 
            picks.find(pick=>pick.pickId === game.competitors[index1]._id && pick.userId === leader.id && pick.gameId === game._id)) || 
            (game.isGameOver && game.competitors[index1].score < game.competitors[index2].score && 
            picks.find(pick=>(pick.pickId === game.competitors[index1]._id || pick.pickId === '000000000000000000000000') 
                && pick.userId === leader.id && pick.gameId === game._id))) ? 'red' : 

            moment() > moment(game.startDateTime) && 
            picks.find(pick=>((pick.pickId === game.competitors[index1]._id) || pick.pickId === '000000000000000000000000') && 
                pick.userId === leader.id && pick.gameId === game._id) ? 'lightblue' : '';
}

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
    leagues,
    getNextGameStartDateTime,
    getStartDateTime,
    getLeaderIndicator,
    getLeagueStartDateTime,
    getLeagueNextGameStartDateTime,
    getImage
};
