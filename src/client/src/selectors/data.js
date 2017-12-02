import moment from 'moment';

import get from 'lodash/get';

const leagues = [ {id: '59723313734d1d6202a85f10', name: 'nfl'} ];

const areAnyGamesOver = (games) => {
    return games.some(x=>!!x.isGameOver);
};

const getResults = (games, picks) => {
    let wins = 0;
    let losses = 0;
    let ties = 0;

    const gamesOver = areAnyGamesOver(games);

    if (gamesOver) {
        const filteredGames = games.filter(game=>{
            return !!game.isGameOver && game.weekNo > 5;
        });

        const filteredPicks = picks.filter(pick=>{
            return pick.weekNo > 5;
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
            week.displayName = week.namePrefix + ' ' + week.weekNumberDisplay + ' ' + moment(week.beginDateTime).format('ddd M/D') + ' - ' + moment(week.endDateTime).format('ddd M/D');
        } else {
            week.displayName = week.namePrefix + ' ' + week.weekNumberDisplay + ' ' + moment(week.beginDateTime).format('ddd M/D');
        }

        return week;
    });

    const weeks = formattedGameWeeks.sort((a,b)=>{
        return a.weekNo - b.weekNo;
    });

    return weeks;
};

export {
    leagues,
    getResults,
    areAnyGamesOver,
    getWeeks
};