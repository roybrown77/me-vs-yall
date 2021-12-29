import moment from 'moment-timezone';

const getPicksNotSelected = (games = [], picks = []) => {
    let count = 0;
    games.forEach(game=>{
        if (!picks.find(x=>x.gameId === game._id) && !game.isGameOver) {
            count++;
        }
    });
    return count;
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

export {
    getPicksNotSelected,
    copy
};