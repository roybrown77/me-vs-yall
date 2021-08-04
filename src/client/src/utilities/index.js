import moment from 'moment-timezone';

import get from 'lodash/get';
import last from 'lodash/last';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import orderBy from 'lodash/orderBy';

import mccaffrey from '../styles/images/mccaffrey.jpg';
import beastMode from '../styles/images/beast-mode.png';
import mahomes from '../styles/images/mahomes.gif';
import mack from '../styles/images/mack.jpeg';

import kawhi from '../styles/images/kawhi.jpg';
import kadeemWoody from '../styles/images/kadeem-woody-wmcj.jpg';

import rickey from '../styles/images/rickey.gif';

import zachBaby from '../styles/images/zach-baby.jpg';

import hoodiesBw from '../styles/images/mvy-hoodie-white-bw.jpg';
import shirts from '../styles/images/mvy-tee-white-romey.jpg';
import shirtGray from '../styles/images/mvy-tee-gray.jpg';
import shirtsBw from '../styles/images/mvy-tee-black-bw.jpg';

const vegasPictures = [
    zachBaby
];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

const basketBallImages = [
    {id: 'kawhi', picture: kawhi, source: 'Kawhi Leonard / Vaughn Ridley / Getty Images'},
    {id: 'kadeemWoody', picture: kadeemWoody, source: 'Kadeem / Woody / Ron Shelton / 20th Century Fox'},
];

const homePageImages = [
    hoodiesBw,
    shirts,
    shirtGray,
    shirtsBw
];

const images = {
    '59723313734d1d6202a85f10': [
        {id: 'mccaffrey', picture: mccaffrey, source: 'Christian MacCaffrey / David T. Foster III / Charlotte Observer'},
        {id: 'beastMode', picture: beastMode, source: 'Marshawn Lynch / dribbble.com'},
        {id: 'mahomes', picture: mahomes, source: 'HOF Patrick Mahomes / dribbble.com'},
        {id: 'mack', picture: mack, source: 'Khalil Mack / Chicago Bears'}
    ],
    '59723313734d1d6202a85f15': [
    ],
    '59723313734d1d6202a85f17': [
    ],
    '59723313734d1d6202a85f19': basketBallImages,
    '59723313734d1d6202a85f35': basketBallImages,
    '59723313734d1d6202a85f25': [
    ],
    '59723313734d1d6202a85f37': [
    ],
    '59723313734d1d6202a85f27': [
    ],
    '59723313734d1d6202a85f29': [
    ],
    '59723313734d1d6202a85f21': [
        {id: 'rickey', picture: rickey, source: 'Rickey Henderson / dribbble.com'}
    ]
};

const getImage = (leagueId) => {
    return images[leagueId] && images[leagueId].length > 0 ? images[leagueId][getRandomIntInclusive(0,images[leagueId].length-1)] : null;
};

const getHomePageImage = () => {
    return homePageImages[getRandomIntInclusive(0,homePageImages.length-1)];
};

const leagues = [
    {
        id: '59723313734d1d6202a85f10', 
        name: 'nfl', 
        description: 'nfl',
        years: [2017, 2018, 2019, 2020, 2021]
    },
    {
        id: '59723313734d1d6202a85f19', 
        name: 'nba', 
        description: 'nba', 
        years: [2018, 2019, 2020]
    },
    // {
    //     id: '59723313734d1d6202a85f17', 
    //     name: 'premier', 
    //     description: 'premier',
    //     years: [2018, 2019, 2020]
    // },
    {
        id: '59723313734d1d6202a85f21', 
        name: 'mlb', 
        description: 'mlb', 
        years: [2020,2021]
    },
    // {
    //     id: '59723313734d1d6202a85f37', 
    //     name: 'wnba', 
    //     description: 'wnba', 
    //     years: [2020]
    // },
    // {
    //     id: '59723313734d1d6202a85f27', 
    //     name: 'mma', 
    //     description: 'mma', 
    //     years: [2019,2020]
    // },
    // {
    //     id: '59723313734d1d6202a85f25', 
    //     name: 'boxing', 
    //     description: 'boxing', 
    //     years: [2019,2020]
    // },
    {
        id: '59723313734d1d6202a85f15', 
        name: 'ncaaf', 
        description: 'ncaaf', 
        years: [2019, 2020]
    },
    // {
    //     id: '59723313734d1d6202a85f31', 
    //     name: 'ncaaw', 
    //     description: 'ncaaw', 
    //     years: [2019]
    // },
    // {
    //     id: '59723313734d1d6202a85f33', 
    //     name: 'ncaam', 
    //     description: 'ncaam', 
    //     years: [2019]
    // },
    // {
    //     id: '59723313734d1d6202a85f29', 
    //     name: 'mls', 
    //     description: 'mls',
    //     years: [2019]
    // },
    // {
    //     id: '59723313734d1d6202a85f35', 
    //     name: 'nba2k', 
    //     description: 'nba 2k', 
    //     years: [2020]
    // },
    // {
    //     id: '59723313734d1d6202a85f23', 
    //     name: 'xgames', 
    //     description: 'x games', 
    //     years: [2019]
    // },
];

const getLeagueStartDateTime = (leagueId, games) => {
    const monthDay = parseInt(moment().format('MMDD'));
    const year = moment().format('YYYY');
    const nextYear = parseInt(year) + 1;

    if (leagueId === '59723313734d1d6202a85f10' && (monthDay > 208 && monthDay < 801)) {
        return moment(`${year}0801`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f15' && (monthDay > 108 && monthDay < 820)) {
        return moment(`${year}0820`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f17' && (monthDay > 515 && monthDay < 820)) {
        return moment(`${year}0820`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f21' && (monthDay < 301 || monthDay > 1115)) {
        return moment(`${nextYear}0301`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f23' && (monthDay > 115)) {
        return moment(`${year}1231`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f29' && (monthDay < 301 || monthDay > 1115)) {
        return moment(`${nextYear}0301`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f31' && (monthDay > 415 && monthDay < 1007)) {
        return moment(`${year}1007`).toISOString();
    }

    if (leagueId === '59723313734d1d6202a85f33' && (monthDay > 415 && monthDay < 1007)) {
        return moment(`${year}1007`).toISOString();
    }

    return getStartDateTime(games);
}

const getStartDateTime = (games) => {
    return getAreAllGamesOver(games) ? null : getNextGameStartDateTime(games);
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

const getLeadersFormatted = (games = [], picks = [], users = [], teams = [], isRollup = false, spreadMode = false) => {
    const picksByUser = groupBy(picks, 'userId');

    const usersHash = users.reduce((obj, item) => {
         obj[item.authServiceId] = item
         return obj
       }, {});

    const teamsHash = teams.reduce((obj, item) => {
         obj[item._id] = item
         return obj
       }, {});

    let date;

    const pickResults = transform(picksByUser, (result, value, key) => {
        const user = usersHash[key];
        if (!!user) {
            const leaderPicks = picksByUser[key];
            const pickResult = getResults(games,leaderPicks, spreadMode);
            const winnings = getWinnings(pickResult);

            result.push({
                id: key,
                userName: get(user,'firstName','') + ' ' + get(user,'lastName',''),
                picture: key === '1' ? getVegasUser().picture : get(user,'picture'),
                wins: pickResult.wins,
                losses: pickResult.losses,
                spreadWins: pickResult.spreadWins,
                spreadLosses: pickResult.spreadLosses,
                winsBeforeGameOver: pickResult.winsBeforeGameOver,
                lossesBeforeGameOver: pickResult.lossesBeforeGameOver,
                winsInARow: pickResult.winsInARow,
                lossesInARow: pickResult.lossesInARow,
                percentage: pickResult.wins + pickResult.losses > 0 ? parseInt((pickResult.wins/(pickResult.wins + pickResult.losses)) * 100) + '%' : '',
                positiveWinnings: (winnings || 0) < 0 ? false : true,
                vegasWinnings: ((winnings || 0) < 0 ? '-' : '') + formatMoney(winnings),
                games: isRollup ? [] : games.map(game=>{
                    const newGameDate = moment(get(game,'startDateTime')).format('dddd MMM D YYYY');
                    const isNewDate = (date !== newGameDate);
                    if (isNewDate) date = newGameDate;
                    const hasStarted = hasGameStarted(game.startDateTime);
                    return {
                        ...game,
                        isNewDate,
                        date,
                        awayTeam: (spreadMode && game.competitors[0]._id === get(game,'spread.teamId') ? '(' + get(game,'spread.amount') + ') ': '') + teamsHash[game.competitors[0]._id].name,
                        awayIndicator: spreadMode ? getSpreadLeaderIndicator(game,leaderPicks,0,1,get(game,'spread.teamId')) : getLeaderIndicator(game,leaderPicks,0,1),
                        awayScore: hasStarted ? (get(game,'competitors.0.score') || 0) : undefined,
                        homeTeam: (spreadMode && game.competitors[1]._id === get(game,'spread.teamId') ? '(' + get(game,'spread.amount') + ') ': '') + teamsHash[game.competitors[1]._id].name,
                        homeIndicator: spreadMode ? getSpreadLeaderIndicator(game,leaderPicks,1,0,get(game,'spread.teamId')) : getLeaderIndicator(game,leaderPicks,1,0),
                        homeScore: hasStarted ? (get(game,'competitors.1.score') || 0) : undefined
                    }
                })
          });
        }

        return result;
    }, []);

    return orderBy(pickResults, ['winsBeforeGameOver', 'lossesBeforeGameOver', 'userName'], ['desc', 'asc', 'asc']);
};

const getResults = (games = [], picks = [], spreadMode = false) => {
    let winsInARow = 0;
    let lossesInARow = 0;

    const picksHash = picks.reduce((obj, item) => {
         obj[item.gameId] = item
         return obj
       }, {});

    const result = games.reduce((total,game)=>{
        const gamePicked = picksHash[game._id];

        if (gamePicked) {
            
            let winnerSelected = false;

            if (spreadMode && get(game,'spread.teamId')) {
                winnerSelected = 
                (game.competitors[0].score > game.competitors[1].score && gamePicked.pickId === game.competitors[0]._id && game.spread.teamId === game.competitors[0]._id && game.competitors[0].score - game.competitors[1].score >= getSpreadAmount(game.spread.amount)) || 
                (game.competitors[1].score > game.competitors[0].score && gamePicked.pickId === game.competitors[1]._id && game.spread.teamId === game.competitors[1]._id && game.competitors[1].score - game.competitors[0].score >= getSpreadAmount(game.spread.amount)) || 
                (game.competitors[0].score > game.competitors[1].score && gamePicked.pickId === game.competitors[1]._id && game.spread.teamId === game.competitors[0]._id && game.competitors[0].score - game.competitors[1].score < getSpreadAmount(game.spread.amount)) || 
                (game.competitors[1].score > game.competitors[0].score && gamePicked.pickId === game.competitors[0]._id && game.spread.teamId === game.competitors[1]._id && game.competitors[1].score - game.competitors[0].score < getSpreadAmount(game.spread.amount)) || 
                (game.competitors[0].score >= game.competitors[1].score && gamePicked.pickId === game.competitors[0]._id && game.spread.teamId === game.competitors[1]._id) || 
                (game.competitors[1].score >= game.competitors[0].score && gamePicked.pickId === game.competitors[1]._id && game.spread.teamId === game.competitors[0]._id);
            } else {
                const winner = game.competitors[0].score === game.competitors[1].score ? '000000000000000000000000' : 
                (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)
            
                winnerSelected = gamePicked.pickId === winner;
            }

            if (!spreadMode || (spreadMode && get(game,'spread.teamId'))) {
                if (winnerSelected) {
                    if (get(game,'isGameOver',false)) {
                        total['wins']++;
                        total['winsBeforeGameOver']++;
                        lossesInARow = 0;
                        winsInARow++;
                    } else {
                        if (hasGameStarted(game.startDateTime)) {
                            total['winsBeforeGameOver']++;
                            lossesInARow = 0;
                            winsInARow++;
                        }
                    }
                } else {
                    if (get(game,'isGameOver',false)) {
                        total['losses']++;
                        total['lossesBeforeGameOver']++;
                        winsInARow = 0;
                        lossesInARow++;
                    } else {
                        if (hasGameStarted(game.startDateTime)) {
                            total['lossesBeforeGameOver']++;
                            winsInARow = 0;
                            lossesInARow++;
                        }
                    }
                }
            }
        }

        return total;
    }, {wins: 0, losses: 0, winsBeforeGameOver: 0, lossesBeforeGameOver: 0, spreadWins: 0, spreadLosses: 0});

    result['lossesInARow'] = lossesInARow;
    result['winsInARow'] = winsInARow;

    return result;
};

const formatWeeks = (gameWeeks = []) => {
    const formattedGameWeeks = gameWeeks.map((week)=>{
        const startDateTime = moment(week.displayBeginDateTime || week.beginDateTime).format('ddd M/D');
        const endDateTime = moment(week.endDateTime).format('ddd M/D');

        if (startDateTime !== endDateTime) {
            week.displayName = (get(week,'description') ? get(week,'description') + ' ' : '') + 
            moment(new Date(week.displayBeginDateTime || week.beginDateTime)).tz('America/New_York').format('ddd M/D') + ' - ' + 
            moment(new Date(week.endDateTime)).tz('America/New_York').format('ddd M/D');
        } else {
            week.displayName = (get(week,'description') ? get(week,'description') + ' ' : '') + 
            moment(new Date(week.displayBeginDateTime || week.beginDateTime)).tz('America/New_York').format('ddd M/D');
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
    const difference = gameStartDateTime.diff(currentDateTime,'seconds');
    return difference < 5;
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

const getGroupedGames = (games = [], picks = [], teams = [], spreadMode = false) => {
    const formattedGames = games.map((game)=>{
        const displayDateTime = moment(new Date(game.startDateTime));
        if (spreadMode) {
            return {
            ...game,
            startDateTimeDisplay: displayDateTime.format('dddd MMM D YYYY h:mm a'),
            competitors: game.competitors.map((competitor, index)=> {
                    const team = teams.find(x=>x._id === competitor._id);
                    const index1 = index;
                    const index2 = index === 0 ? 1 : 0;
                    const teamAPick = picks.find(pick=>(pick.pickId === competitor._id) && pick.gameId === game._id);
                    const selectedWinner = get(game,'spread.teamId') && ((game.competitors[index1].score > game.competitors[index2].score && teamAPick && game.spread.teamId === game.competitors[index1]._id && game.competitors[index1].score - game.competitors[index2].score >= getSpreadAmount(game.spread.amount)) ||
                        (game.competitors[index1].score >= game.competitors[index2].score && teamAPick && game.spread.teamId === game.competitors[index2]._id) ||
                        (game.competitors[index2].score > game.competitors[index1].score && teamAPick && game.spread.teamId === game.competitors[index2]._id && game.competitors[index2].score - game.competitors[index1].score < getSpreadAmount(game.spread.amount)));
                    return {
                        ...competitor,
                        shortLocation: team.shortLocation,
                        name: team.name || team.location,
                        color: team.color,
                        record: competitor.finalRecord || competitor.record,
                        country: team.country,
                        selectedWinner,
                        selected: !!teamAPick
                    };
                })
            };
        }

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
                        shortLocation: team.shortLocation,
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

    return {
        notCompleted: orderBy(formattedGames.filter(x=>!x.isGameOver),['_id']).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)),
        completed: orderBy(formattedGames.filter(x=>x.isGameOver),['_id']).sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime))
    };
};

const copy = (games = [], picks = [], teams = []) => {
    const sortedGames = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

    let list = "";
    let newDate = "";

    sortedGames.forEach((game)=>{
        const displayDateTime = moment(new Date(game.startDateTime));
        const formattedDateTime = displayDateTime.format('dddd MMM D YYYY h:mm a');
        const teamA = teams.find(x=>x._id === game.competitors[0]._id);
        const teamB = teams.find(x=>x._id === game.competitors[1]._id);

        const selected = picks.find(x=>x.gameId === game._id && (x.pickId === game.competitors[0]._id || x.pickId === game.competitors[1]._id));

        if (newDate !== formattedDateTime) {
            list += '\n' + formattedDateTime + '\n\n';
            newDate = formattedDateTime;
        }
        if (selected) {
            list += selected.pickId === game.competitors[0]._id ? teamA.name + ' over ' + teamB.name + '\n' : teamB.name + ' over ' + teamA.name + '\n';
        } else {
            list += teamA.name + ' vs ' + teamB.name + '\n';
        }
    });

    return 'https://www.mevsyall.com\n' + list + '\nhttps://www.mevsyall.com\n\n';
};

const getAreAnyGamesInProgress = (games = []) => {
    return games.some(x=>hasGameStarted(x.startDateTime) && !x.isGameOver)
};

const getLeaderIndicator = (game,picks,index1,index2) => {
    return game.isGameOver && ((game.competitors[index1].score === game.competitors[index2].score && 
            picks.find(pick=>pick.pickId === '000000000000000000000000' && pick.gameId === game._id)) || 
            (game.competitors[index1].score > game.competitors[index2].score && 
            picks.find(pick=>(pick.pickId === game.competitors[index1]._id || pick.pickId === '000000000000000000000000') 
                && pick.gameId === game._id))) ? '#009933' : 

            game.isGameOver && ((game.competitors[index1].score === game.competitors[index2].score && 
            picks.find(pick=>pick.pickId === game.competitors[index1]._id && pick.gameId === game._id)) || 
            (game.isGameOver && game.competitors[index1].score < game.competitors[index2].score && 
            picks.find(pick=>(pick.pickId === game.competitors[index1]._id || pick.pickId === '000000000000000000000000') 
                && pick.gameId === game._id))) ? 'red' : 

            picks.find(pick=>((pick.pickId === game.competitors[index1]._id) || pick.pickId === '000000000000000000000000')  
                && pick.gameId === game._id) ? 'lightblue' : '';
}

const getSpreadLeaderIndicator = (game,picks,index1,index2,spread = null) => {
    if (!spread) return;

    const teamAPick = picks.find(pick=>(pick.pickId === game.competitors[index1]._id) && pick.gameId === game._id);
    
    return game.isGameOver && get(game,'spread.teamId') &&
            ((game.competitors[index1].score > game.competitors[index2].score && teamAPick && game.spread.teamId === game.competitors[index1]._id && game.competitors[index1].score - game.competitors[index2].score >= getSpreadAmount(game.spread.amount)) ||
            (game.competitors[index1].score >= game.competitors[index2].score && teamAPick && game.spread.teamId === game.competitors[index2]._id) ||
            (game.competitors[index2].score > game.competitors[index1].score && teamAPick && game.spread.teamId === game.competitors[index2]._id && game.competitors[index2].score - game.competitors[index1].score < getSpreadAmount(game.spread.amount))) 
            ? '#009933' : 

            game.isGameOver && get(game,'spread.teamId') && ((game.competitors[index1].score === game.competitors[index2].score) || teamAPick) ? 'red' : 

            teamAPick ? 'lightblue' : '';
}

const getPicksNotSelected = (games = [], picks = []) => {
    let count = 0;
    games.forEach(game=>{
        if (!picks.find(x=>x.gameId === game._id) && !game.isGameOver) {
            count++;
        }
    });
    return count;
}

const getLeaders = (games = [], picks = [], users = [], teams = [], isRollup = false, spreadMode = false) => {
    const sortedGames = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    const picksWithVegas = [...picks, ...getVegasPicks(sortedGames)];
    return getLeadersFormatted(sortedGames, picksWithVegas, users, teams, isRollup, spreadMode);
}

const getHomePageEmoji = () => {
    const emojis = ["🏎","💃","🎒","🍄","🌶","🍿","🥊","🚣","🥁","🚗","⛽️","🏖","☎️","🧰","💌","🅰️"];
    return emojis[getRandomIntInclusive(0,emojis.length-1)];
}

const getSpreadAmount = (spreadAmount) => {
    const amount = Math.abs(spreadAmount);
    return (amount > 70 ? 1.5 : amount);
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
    getImage,
    getRandomIntInclusive,
    images,
    getPicksNotSelected,
    copy,
    getHomePageImage,
    getHomePageEmoji
};
