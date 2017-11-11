const leagues = [ {id: '59723313734d1d6202a85f10', name: 'nfl'} ];

const rawWeeks = [
                    // {
                    //     weekNo: 1,
                    //     weekNumberDisplay: "",
                    //     namePrefix: "Hall of Fame Game",
                    //     beginDateTime: "2017-08-03T05:00:00+04:00",
                    //     endDateTime: "2017-08-04T02:00:00+04:00"
                    // },
                    // {
                    //     weekNo: 2,
                    //     weekNumberDisplay: 1,
                    //     namePrefix: "Pre Week",
                    //     beginDateTime: "2017-08-09T05:00:00+04:00",
                    //     endDateTime: "2017-08-14T02:00:00+04:00"
                    // },
                    // {
                    //     weekNo: 3,
                    //     weekNumberDisplay: 2,
                    //     namePrefix: "Pre Week",
                    //     beginDateTime: "2017-08-17T05:00:00+04:00",
                    //     endDateTime: "2017-08-22T02:00:00+04:00"
                    // },
                    // {
                    //     weekNo: 4,
                    //     weekNumberDisplay: 3,
                    //     namePrefix: "Pre Week",
                    //     beginDateTime: "2017-08-24T05:00:00+04:00",
                    //     endDateTime: "2017-08-28T02:00:00+04:00"
                    // },
                    // {
                    //     weekNo: 5,
                    //     weekNumberDisplay: 4,
                    //     namePrefix: "Pre Week",
                    //     beginDateTime: "2017-08-31T05:00:00+04:00",
                    //     endDateTime: "2017-09-01T02:00:00+04:00"
                    // },
                    {
                        weekNo: 6,
                        weekNumberDisplay: 1,
                        namePrefix: "Week",
                        beginDateTime: "2017-09-07T05:00:00+04:00",
                        endDateTime: "2017-09-12T02:00:00+04:00"
                    },
                    {
                        weekNo: 7,
                        weekNumberDisplay: 2,
                        namePrefix: "Week",
                        beginDateTime: "2017-09-14T05:00:00+04:00",
                        endDateTime: "2017-09-19T02:00:00+04:00"
                    },
                    {
                        weekNo: 8,
                        weekNumberDisplay: 3,
                        namePrefix: "Week",
                        beginDateTime: "2017-09-21T05:00:00+04:00",
                        endDateTime: "2017-09-26T02:00:00+04:00"
                    },
                    {
                        weekNo: 9,
                        weekNumberDisplay: 4,
                        namePrefix: "Week",
                        beginDateTime: "2017-09-28T05:00:00+04:00",
                        endDateTime: "2017-10-03T02:00:00+04:00"
                    },
                    {
                        weekNo: 10,
                        weekNumberDisplay: 5,
                        namePrefix: "Week",
                        beginDateTime: "2017-10-05T05:00:00+04:00",
                        endDateTime: "2017-10-10T02:00:00+04:00"
                    },
                    {
                        weekNo: 11,
                        weekNumberDisplay: 6,
                        namePrefix: "Week",
                        beginDateTime: "2017-10-12T05:00:00+04:00",
                        endDateTime: "2017-10-17T02:00:00+04:00"
                    },
                    {
                        weekNo: 12,
                        weekNumberDisplay: 7,
                        namePrefix: "Week",
                        beginDateTime: "2017-10-19T05:00:00+04:00",
                        endDateTime: "2017-10-24T02:00:00+04:00"
                    },
                    {
                        weekNo: 13,
                        weekNumberDisplay: 8,
                        namePrefix: "Week",
                        beginDateTime: "2017-10-26T05:00:00+04:00",
                        endDateTime: "2017-10-31T02:00:00+04:00"
                    },
                    {
                        weekNo: 14,
                        weekNumberDisplay: 9,
                        namePrefix: "Week",
                        beginDateTime: "2017-11-02T05:00:00+04:00",
                        endDateTime: "2017-11-07T02:00:00+04:00"
                    },
                    {
                        weekNo: 15,
                        weekNumberDisplay: 10,
                        namePrefix: "Week",
                        beginDateTime: "2017-11-09T05:00:00+04:00",
                        endDateTime: "2017-11-14T02:00:00+04:00"
                    },
                    // {
                    //     weekNo: 16,
                    //     weekNumberDisplay: 11,
                    //     namePrefix: "Week",
                    //     beginDateTime: "2017-11-16T05:00:00+04:00",
                    //     endDateTime: "2017-11-21T02:00:00+04:00"
                    // },
                  ];

const getResults = (games, picks) => {
    let wins = 0;
    let losses = 0;
    let ties = 0;

    const gamesOver = areAnyGamesOver(games);

    if (gamesOver) {
        games.forEach((game)=>{
            if (game.isGameOver && game.competitors[0].score === game.competitors[1].score ) {
                ++ties;
            }

            const winner = game.competitors[0].score === game.competitors[1].score ? null : (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

            game.competitors.forEach((competitor, index)=> {
                const winnerSelected = picks.find(x=>x.gameId === game._id && x.pickId === competitor._id) ? true : false;

                if (winnerSelected && competitor._id === winner && game.isGameOver) {
                    ++wins;
                }

                if (winnerSelected && competitor._id !== winner && game.isGameOver) {
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

const areAnyGamesOver = (games) => {
    return games.some(x=>!!x.isGameOver);
};

export {
    rawWeeks,
    leagues,
    getResults,
    areAnyGamesOver
};